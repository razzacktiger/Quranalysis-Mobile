import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { EditableField } from './EditableField';
import { PortionCard, type PortionCardData } from './PortionCard';
import { MistakeCard, type MistakeCardData } from './MistakeCard';
import { useCreateSession } from '@/lib/hooks/useSessions';
import type { CurrentExtraction } from '@/lib/hooks/useAIChat';
import type {
  SessionFormData,
  PortionFormData,
  MistakeFormData,
  SessionType,
  RecencyCategory,
  SeverityLevel,
  SESSION_TYPES,
} from '@/types/session';

export interface SessionConfirmationProps {
  extraction: CurrentExtraction;
  onAddMore: () => void;
  onCancel: () => void;
  onSuccess: () => void;
  testID?: string;
}

// Session type options for picker
const SESSION_TYPE_OPTIONS: Array<{ value: SessionType; label: string }> = [
  { value: 'reading_practice', label: 'Reading Practice' },
  { value: 'memorization', label: 'Memorization' },
  { value: 'audit', label: 'Audit' },
  { value: 'mistake_session', label: 'Mistake Review' },
  { value: 'practice_test', label: 'Practice Test' },
  { value: 'study_session', label: 'Study Session' },
];

// Generate unique temp ID
function generateTempId(): string {
  return `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Confirmation screen for reviewing and saving AI-extracted session data
 * Allows editing all fields before final save
 */
export function SessionConfirmation({
  extraction,
  onAddMore,
  onCancel,
  onSuccess,
  testID,
}: SessionConfirmationProps) {
  const createSession = useCreateSession();

  // Local state for editable session fields
  // Use ISO string to capture current date AND time
  const [sessionDate, setSessionDate] = useState(
    new Date().toISOString()
  );
  const [sessionType, setSessionType] = useState<SessionType>(
    extraction.session.session_type ?? 'reading_practice'
  );
  const [durationMinutes, setDurationMinutes] = useState(
    extraction.session.duration_minutes?.toString() ?? '30'
  );
  const [performanceScore, setPerformanceScore] = useState(
    extraction.session.performance_score?.toString() ?? '7'
  );

  // Local state for portions (converted from extraction)
  // Also auto-create portions from mistakes if no portions exist
  const [portions, setPortions] = useState<PortionCardData[]>(() => {
    // Start with extracted portions
    const extractedPortions = extraction.portions.map((p) => ({
      tempId: generateTempId(),
      surah_name: p.surah_name,
      ayah_start: p.ayah_start,
      ayah_end: p.ayah_end,
      recency_category: p.recency_category,
      repetition_count: p.repetition_count,
    }));

    // If no portions but we have mistakes, auto-create portions from unique mistake surahs
    if (extractedPortions.length === 0 && extraction.mistakes.length > 0) {
      const uniqueSurahs = new Set(
        extraction.mistakes
          .map((m) => m.portion_surah)
          .filter((s) => s && s !== 'Unknown')
      );
      return Array.from(uniqueSurahs).map((surah) => ({
        tempId: generateTempId(),
        surah_name: surah,
        ayah_start: null,
        ayah_end: null,
        recency_category: null,
        repetition_count: null,
      }));
    }

    return extractedPortions;
  });

  // Local state for mistakes (converted from extraction)
  const [mistakes, setMistakes] = useState<MistakeCardData[]>(() =>
    extraction.mistakes.map((m) => ({
      tempId: generateTempId(),
      portionTempId: '', // Will be linked during save
      portion_surah: m.portion_surah,
      error_category: m.error_category,
      error_subcategory: m.error_subcategory ?? null,
      severity_level: m.severity_level as SeverityLevel,
      ayah_number: m.ayah_number,
      additional_notes: m.additional_notes,
    }))
  );

  // Validation: at least one portion with a surah name OR mistakes with valid surahs
  const isValid = useMemo(() => {
    const hasValidPortion = portions.some(
      (p) => p.surah_name !== null && p.surah_name.trim() !== ''
    );
    const hasValidMistake = mistakes.some(
      (m) => m.portion_surah && m.portion_surah !== 'Unknown'
    );
    return hasValidPortion || hasValidMistake;
  }, [portions, mistakes]);

  // Available surahs from portions for linking mistakes
  const availableSurahs = useMemo(() => {
    return portions
      .map((p) => p.surah_name)
      .filter((name): name is string => name !== null && name.trim() !== '');
  }, [portions]);

  // Handle portion edit
  const handlePortionEdit = (updatedPortion: PortionCardData) => {
    setPortions((prev) =>
      prev.map((p) => (p.tempId === updatedPortion.tempId ? updatedPortion : p))
    );
  };

  // Handle portion remove
  const handlePortionRemove = (tempId: string) => {
    setPortions((prev) => prev.filter((p) => p.tempId !== tempId));
  };

  // Handle mistake edit
  const handleMistakeEdit = (updatedMistake: MistakeCardData) => {
    setMistakes((prev) =>
      prev.map((m) => (m.tempId === updatedMistake.tempId ? updatedMistake : m))
    );
  };

  // Handle mistake remove
  const handleMistakeRemove = (tempId: string) => {
    setMistakes((prev) => prev.filter((m) => m.tempId !== tempId));
  };

  // Handle save
  const handleSave = async () => {
    if (!isValid) {
      Alert.alert('Incomplete Data', 'Please add at least one portion with a surah name.');
      return;
    }

    // Convert local state to SessionFormData
    const portionFormData: PortionFormData[] = portions
      .filter((p) => p.surah_name !== null)
      .map((p) => ({
        tempId: p.tempId,
        surah_name: p.surah_name!,
        ayah_start: p.ayah_start ?? undefined,
        ayah_end: p.ayah_end ?? undefined,
        recency_category: p.recency_category ?? 'recent',
        repetition_count: p.repetition_count ?? 1,
      }));

    // Link mistakes to portions by matching surah name
    const mistakeFormData: MistakeFormData[] = mistakes.map((m) => {
      // Find matching portion by surah name
      const matchingPortion = portionFormData.find(
        (p) => p.surah_name.toLowerCase() === m.portion_surah.toLowerCase()
      );
      return {
        tempId: m.tempId,
        portionTempId: matchingPortion?.tempId ?? portionFormData[0]?.tempId ?? '',
        error_category: m.error_category,
        error_subcategory: m.error_subcategory ?? undefined,
        severity_level: m.severity_level,
        ayah_number: m.ayah_number ?? 1,
        additional_notes: m.additional_notes ?? undefined,
      };
    });

    const formData: SessionFormData = {
      session_date: sessionDate,
      session_type: sessionType,
      duration_minutes: parseInt(durationMinutes, 10) || 30,
      performance_score: parseInt(performanceScore, 10) || 7,
      portions: portionFormData,
      mistakes: mistakeFormData,
    };

    try {
      await createSession.mutateAsync(formData);
      onSuccess();
    } catch (error) {
      Alert.alert(
        'Save Failed',
        error instanceof Error ? error.message : 'An error occurred while saving.'
      );
    }
  };

  return (
    <View testID={testID} className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Session Details Section */}
        <View className="bg-white dark:bg-gray-800 mx-4 mt-4 rounded-xl px-4 py-2">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 py-3 border-b border-gray-100 dark:border-gray-700">
            Session Details
          </Text>

          <EditableField
            testID={`${testID}-date`}
            label="Date"
            value={format(new Date(sessionDate), 'MMM d, yyyy h:mm a')}
            onEdit={(formatted) => {
              // Keep current timestamp if user doesn't actually change it
              // For proper date editing, a date picker would be better
              try {
                const parsed = new Date(formatted);
                if (!isNaN(parsed.getTime())) {
                  setSessionDate(parsed.toISOString());
                }
              } catch {
                // Invalid date format, ignore
              }
            }}
            placeholder="Select date"
          />

          <EditableField
            testID={`${testID}-duration`}
            label="Duration"
            value={durationMinutes}
            onEdit={setDurationMinutes}
            inputType="number"
            placeholder="Minutes"
          />

          <EditableField
            testID={`${testID}-type`}
            label="Type"
            value={sessionType}
            onEdit={(val) => setSessionType(val as SessionType)}
            options={SESSION_TYPE_OPTIONS}
          />

          <EditableField
            testID={`${testID}-performance`}
            label="Performance"
            value={performanceScore}
            onEdit={setPerformanceScore}
            inputType="number"
            placeholder="Score (0-10)"
          />
        </View>

        {/* Portions Section */}
        <View className="mx-4 mt-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Portions ({portions.length})
          </Text>

          {portions.length === 0 ? (
            <View className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 items-center">
              <Ionicons name="book-outline" size={32} color="#9CA3AF" />
              <Text className="text-gray-500 dark:text-gray-400 mt-2">No portions extracted</Text>
              <Pressable
                onPress={onAddMore}
                className="mt-3 px-4 py-2 bg-primary/10 rounded-full"
              >
                <Text className="text-primary font-medium">Add via Chat</Text>
              </Pressable>
            </View>
          ) : (
            portions.map((portion) => (
              <PortionCard
                key={portion.tempId}
                testID={`${testID}-portion-${portion.tempId}`}
                portion={portion}
                onEdit={handlePortionEdit}
                onRemove={handlePortionRemove}
              />
            ))
          )}
        </View>

        {/* Mistakes Section */}
        <View className="mx-4 mt-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Mistakes ({mistakes.length})
          </Text>

          {mistakes.length === 0 ? (
            <View className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 items-center">
              <Ionicons name="alert-circle-outline" size={32} color="#9CA3AF" />
              <Text className="text-gray-500 dark:text-gray-400 mt-2">No mistakes recorded</Text>
              <Text className="text-gray-400 text-sm">That's great!</Text>
            </View>
          ) : (
            mistakes.map((mistake) => (
              <MistakeCard
                key={mistake.tempId}
                testID={`${testID}-mistake-${mistake.tempId}`}
                mistake={mistake}
                onEdit={handleMistakeEdit}
                onRemove={handleMistakeRemove}
                availableSurahs={availableSurahs}
              />
            ))
          )}
        </View>

        {/* Add More Button */}
        <View className="mx-4 mt-4 mb-6">
          <Pressable
            testID={`${testID}-add-more`}
            onPress={onAddMore}
            className="flex-row items-center justify-center py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl"
          >
            <Ionicons name="chatbubble-ellipses" size={20} color="#6B7280" />
            <Text className="text-gray-600 dark:text-gray-400 font-medium ml-2">
              Add More via Chat
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="flex-row px-4 py-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 gap-3">
        <Pressable
          testID={`${testID}-cancel`}
          onPress={onCancel}
          disabled={createSession.isPending}
          className="flex-1 py-3 items-center rounded-xl border border-gray-300 dark:border-gray-600"
        >
          <Text className="text-gray-700 dark:text-gray-300 font-semibold">Cancel</Text>
        </Pressable>

        <Pressable
          testID={`${testID}-save`}
          onPress={handleSave}
          disabled={!isValid || createSession.isPending}
          className={`flex-1 py-3 items-center rounded-xl ${
            isValid && !createSession.isPending ? 'bg-primary' : 'bg-gray-300'
          }`}
        >
          {createSession.isPending ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text className="text-white font-semibold">Save Session</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
