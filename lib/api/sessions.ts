// Session API functions for Supabase CRUD operations

import { supabase } from '../supabase';
import type {
  SessionData,
  SessionPortion,
  MistakeData,
  SessionFormData,
  PortionFormData,
  MistakeFormData,
} from '@/types/session';

// Response type for session with relations
export interface SessionWithRelations extends SessionData {
  session_portions: SessionPortion[];
  mistakes: MistakeData[];
}

/**
 * Fetch all sessions for the current user with portions and mistakes
 */
export async function fetchSessions(): Promise<SessionWithRelations[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('sessions')
    .select(`
      *,
      session_portions (*),
      mistakes (*)
    `)
    .eq('user_id', user.id)
    .order('session_date', { ascending: false });

  if (error) throw new Error(error.message);
  return data as SessionWithRelations[];
}

/**
 * Fetch a single session by ID with portions and mistakes
 */
export async function fetchSession(sessionId: string): Promise<SessionWithRelations> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('sessions')
    .select(`
      *,
      session_portions (*),
      mistakes (*)
    `)
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .single();

  if (error) throw new Error(error.message);
  return data as SessionWithRelations;
}

/**
 * Create a new session with portions and mistakes
 * Uses transaction-like pattern: session -> portions -> mistakes
 */
export async function createSession(formData: SessionFormData): Promise<SessionWithRelations> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // 1. Insert session
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .insert({
      user_id: user.id,
      session_date: formData.session_date,
      session_type: formData.session_type,
      duration_minutes: formData.duration_minutes,
      performance_score: formData.performance_score,
      session_goal: formData.session_goal,
      additional_notes: formData.additional_notes,
    })
    .select()
    .single();

  if (sessionError) throw new Error(sessionError.message);

  // 2. Insert portions (map tempId to real IDs)
  const portionsToInsert = formData.portions.map((p) => ({
    session_id: session.id,
    surah_name: p.surah_name,
    ayah_start: p.ayah_start ?? 1,
    ayah_end: p.ayah_end ?? 1,
    juz_number: p.juz_number ?? 1,
    pages_read: p.pages_read ?? 1, // DB constraint requires >= 1
    repetition_count: p.repetition_count,
    recency_category: p.recency_category,
  }));

  const { data: portions, error: portionsError } = await supabase
    .from('session_portions')
    .insert(portionsToInsert)
    .select();

  if (portionsError) {
    // Rollback: delete the session
    await supabase.from('sessions').delete().eq('id', session.id);
    throw new Error(portionsError.message);
  }

  // 3. Map tempId to real portion IDs for mistakes
  const tempIdToRealId = new Map<string, string>();
  formData.portions.forEach((p, i) => {
    tempIdToRealId.set(p.tempId, portions[i].id);
  });

  // 4. Insert mistakes if any
  let mistakes: MistakeData[] = [];
  if (formData.mistakes.length > 0) {
    const mistakesToInsert = formData.mistakes.map((m) => ({
      session_id: session.id,
      session_portion_id: tempIdToRealId.get(m.portionTempId) ?? portions[0].id,
      error_category: m.error_category,
      error_subcategory: m.error_subcategory,
      severity_level: m.severity_level,
      ayah_number: m.ayah_number,
      additional_notes: m.additional_notes,
    }));

    const { data: insertedMistakes, error: mistakesError } = await supabase
      .from('mistakes')
      .insert(mistakesToInsert)
      .select();

    if (mistakesError) {
      // Rollback: delete portions and session
      await supabase.from('session_portions').delete().eq('session_id', session.id);
      await supabase.from('sessions').delete().eq('id', session.id);
      throw new Error(mistakesError.message);
    }

    mistakes = insertedMistakes as MistakeData[];
  }

  return {
    ...session,
    session_portions: portions as SessionPortion[],
    mistakes,
  } as SessionWithRelations;
}

/**
 * Update an existing session with portions and mistakes
 * Handles upsert for existing items and delete for removed items
 */
export async function updateSession(
  sessionId: string,
  formData: SessionFormData
): Promise<SessionWithRelations> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // 1. Update session metadata
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .update({
      session_date: formData.session_date,
      session_type: formData.session_type,
      duration_minutes: formData.duration_minutes,
      performance_score: formData.performance_score,
      session_goal: formData.session_goal,
      additional_notes: formData.additional_notes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (sessionError) throw new Error(sessionError.message);

  // 2. Handle portions: update existing, insert new, delete removed
  const existingPortionIds = formData.portions
    .filter((p) => p.databaseId)
    .map((p) => p.databaseId as string);

  // Delete removed portions (cascade will delete their mistakes)
  if (existingPortionIds.length > 0) {
    await supabase
      .from('session_portions')
      .delete()
      .eq('session_id', sessionId)
      .not('id', 'in', `(${existingPortionIds.join(',')})`);
  } else {
    // Delete all existing portions if none are kept
    await supabase
      .from('session_portions')
      .delete()
      .eq('session_id', sessionId);
  }

  // Upsert portions
  const portionResults: SessionPortion[] = [];
  const tempIdToRealId = new Map<string, string>();

  for (const portion of formData.portions) {
    const portionData = {
      surah_name: portion.surah_name,
      ayah_start: portion.ayah_start ?? 1,
      ayah_end: portion.ayah_end ?? 1,
      juz_number: portion.juz_number ?? 1,
      pages_read: portion.pages_read ?? 1, // DB constraint requires >= 1
      repetition_count: portion.repetition_count,
      recency_category: portion.recency_category,
    };

    if (portion.databaseId) {
      // Update existing
      const { data, error } = await supabase
        .from('session_portions')
        .update(portionData)
        .eq('id', portion.databaseId)
        .select()
        .single();

      if (error) throw new Error(error.message);
      portionResults.push(data as SessionPortion);
      tempIdToRealId.set(portion.tempId, portion.databaseId);
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('session_portions')
        .insert({ session_id: sessionId, ...portionData })
        .select()
        .single();

      if (error) throw new Error(error.message);
      portionResults.push(data as SessionPortion);
      tempIdToRealId.set(portion.tempId, data.id);
    }
  }

  // 3. Handle mistakes: similar upsert pattern
  const existingMistakeIds = formData.mistakes
    .filter((m) => m.databaseId)
    .map((m) => m.databaseId as string);

  // Delete removed mistakes
  if (existingMistakeIds.length > 0) {
    await supabase
      .from('mistakes')
      .delete()
      .eq('session_id', sessionId)
      .not('id', 'in', `(${existingMistakeIds.join(',')})`);
  } else {
    await supabase
      .from('mistakes')
      .delete()
      .eq('session_id', sessionId);
  }

  // Upsert mistakes
  const mistakeResults: MistakeData[] = [];

  for (const mistake of formData.mistakes) {
    const mistakeData = {
      session_portion_id: tempIdToRealId.get(mistake.portionTempId) ?? portionResults[0].id,
      error_category: mistake.error_category,
      error_subcategory: mistake.error_subcategory,
      severity_level: mistake.severity_level,
      ayah_number: mistake.ayah_number,
      additional_notes: mistake.additional_notes,
    };

    if (mistake.databaseId) {
      // Update existing
      const { data, error } = await supabase
        .from('mistakes')
        .update(mistakeData)
        .eq('id', mistake.databaseId)
        .select()
        .single();

      if (error) throw new Error(error.message);
      mistakeResults.push(data as MistakeData);
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('mistakes')
        .insert({ session_id: sessionId, ...mistakeData })
        .select()
        .single();

      if (error) throw new Error(error.message);
      mistakeResults.push(data as MistakeData);
    }
  }

  return {
    ...session,
    session_portions: portionResults,
    mistakes: mistakeResults,
  } as SessionWithRelations;
}

/**
 * Delete a session (cascade deletes portions and mistakes via DB)
 */
export async function deleteSession(sessionId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', sessionId)
    .eq('user_id', user.id);

  if (error) throw new Error(error.message);
}
