// Session Types - matches Supabase database schema

// Enums as const arrays for runtime iteration
export const SESSION_TYPES = [
  'reading_practice',
  'memorization',
  'audit',
  'mistake_session',
  'practice_test',
  'study_session',
] as const;
export type SessionType = (typeof SESSION_TYPES)[number];

export const RECENCY_CATEGORIES = [
  'new',
  'recent',
  'reviewing',
  'maintenance',
] as const;
export type RecencyCategory = (typeof RECENCY_CATEGORIES)[number];

export const ERROR_CATEGORIES = [
  'pronunciation',
  'tajweed',
  'memorization',
  'translation',
  'fluency',
  'waqf',
  'other',
] as const;
export type ErrorCategory = (typeof ERROR_CATEGORIES)[number];

export const ERROR_SUBCATEGORIES = [
  // Pronunciation
  'makhraj',
  'sifat',
  // Tajweed
  'ghunna',
  'qalqalah',
  'madd',
  'idgham',
  'ikhfa',
  'iqlab',
  // Memorization
  'word_order',
  'verse_skip',
  'word_substitution',
  'mutashabih',
  'forgotten_word',
  'forgotten_verse_start',
  'forgotten_verse_end',
  'forgotten_verse_middle',
  'forgotten_verse_all',
  'forgotten_verse_middle_end',
  'forgotten_verse_start_middle',
  'verse_slipping',
  // Fluency
  'hesitation',
  'repetition',
  'rhythm',
  // Waqf
  'wrong_stop',
  'missed_stop',
  'disencouraged_stop',
  'disencouraged_continue',
] as const;
export type ErrorSubcategory = (typeof ERROR_SUBCATEGORIES)[number];

// Severity level (1-5)
export type SeverityLevel = 1 | 2 | 3 | 4 | 5;

// Core Database Types
export interface SessionData {
  id: string;
  user_id: string;
  session_date: string;
  session_type: SessionType;
  duration_minutes: number;
  performance_score: number;
  session_goal?: string;
  additional_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SessionPortion {
  id: string;
  session_id: string;
  surah_name: string;
  ayah_start: number;
  ayah_end: number;
  juz_number: number;
  pages_read: number;
  repetition_count: number;
  recency_category: RecencyCategory;
  created_at: string;
}

export interface MistakeData {
  id: string;
  session_id: string;
  session_portion_id: string;
  error_category: ErrorCategory;
  error_subcategory?: ErrorSubcategory;
  severity_level: SeverityLevel;
  ayah_number: number;
  additional_notes?: string;
  created_at: string;
}

// Frontend Form Types
export interface SessionFormData {
  session_date: string;
  session_type: SessionType;
  duration_minutes: number;
  performance_score: number;
  session_goal?: string;
  additional_notes?: string;
  portions: PortionFormData[];
  mistakes: MistakeFormData[];
}

export interface PortionFormData {
  tempId: string;
  databaseId?: string;
  surah_name: string;
  ayah_start?: number;
  ayah_end?: number;
  repetition_count: number;
  recency_category: RecencyCategory;
  juz_number?: number;
  pages_read?: number;
}

export interface MistakeFormData {
  tempId: string;
  databaseId?: string;
  portionTempId: string;
  error_category: ErrorCategory;
  error_subcategory?: ErrorSubcategory;
  severity_level: SeverityLevel;
  ayah_number: number;
  additional_notes?: string;
}

// API Request/Response Types
export interface CreateSessionRequest {
  session: Omit<SessionData, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
  session_portions: Omit<SessionPortion, 'id' | 'session_id' | 'created_at'>[];
  mistakes: Omit<MistakeData, 'id' | 'session_id' | 'session_portion_id' | 'created_at'>[];
}

export interface UpdateSessionRequest {
  session: Partial<Omit<SessionData, 'id' | 'user_id' | 'created_at'>>;
  session_portions: Omit<SessionPortion, 'session_id' | 'created_at'>[];
  mistakes: Omit<MistakeData, 'session_id' | 'created_at'>[];
}

export interface FullSessionData {
  session: SessionData;
  session_portions: SessionPortion[];
  mistakes: MistakeData[];
}

// Utility Types
export interface SessionStats {
  portion_count: number;
  mistake_count: number;
  avg_mistake_severity: number;
  surahs_practiced: string[];
  total_ayahs: number;
  total_pages: number;
  total_repetitions: number;
}

export interface SessionSummary extends SessionData {
  stats: SessionStats;
}

export interface ValidationErrors {
  session?: Record<string, string>;
  portions?: Record<string, Record<string, string>>;
  mistakes?: Record<string, Record<string, string>>;
}
