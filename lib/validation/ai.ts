import { z } from 'zod';
import {
  SESSION_TYPES,
  RECENCY_CATEGORIES,
  ERROR_CATEGORIES,
  ERROR_SUBCATEGORIES,
} from '@/types/session';

/**
 * Confidence levels for AI extraction results
 */
export const CONFIDENCE_LEVELS = ['high', 'medium', 'low'] as const;
export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[number];

/**
 * Schema for extracted session data from AI
 * Fields are nullable since AI may not extract all information
 */
export const extractedSessionSchema = z.object({
  duration_minutes: z.number().int().positive().nullable(),
  session_type: z.enum(SESSION_TYPES).nullable(),
  performance_score: z.number().min(0).max(10).nullable(),
  session_goal: z.string().nullable(),
});

/**
 * Schema for extracted portion data from AI
 * Represents a section of Quran practiced in a session
 *
 * Note: Uses nullable (not optional) because AI returns explicit null for missing values.
 * When converting to PortionFormData, null values need defaults (e.g., repetition_count: 0)
 */
export const extractedPortionSchema = z.object({
  surah_name: z.string().nullable(),
  ayah_start: z.number().int().positive().nullable(),
  ayah_end: z.number().int().positive().nullable(),
  recency_category: z.enum(RECENCY_CATEGORIES).nullable(),
  repetition_count: z.number().int().nonnegative().nullable(),
});

/**
 * Complete session extraction schema for AI responses
 * Used to validate and type the structured output from Gemini
 */
export const sessionExtractionSchema = z.object({
  session: extractedSessionSchema,
  portions: z.array(extractedPortionSchema),
  missing_fields: z.array(z.string()),
  follow_up_question: z.string().nullable(),
  confidence: z.enum(CONFIDENCE_LEVELS),
});

// Export inferred types for session extraction
export type ExtractedSession = z.infer<typeof extractedSessionSchema>;
export type ExtractedPortion = z.infer<typeof extractedPortionSchema>;
export type SessionExtractionResult = z.infer<typeof sessionExtractionSchema>;

// ============================================================================
// MISTAKE EXTRACTION SCHEMAS
// ============================================================================

/**
 * Severity levels for mistakes (1-5 scale)
 */
export const SEVERITY_LEVELS = [1, 2, 3, 4, 5] as const;
export type SeverityLevel = (typeof SEVERITY_LEVELS)[number];

/**
 * Schema for extracted mistake data from AI
 * Represents an error made during Quran recitation
 */
export const extractedMistakeSchema = z.object({
  portion_surah: z.string(),
  error_category: z.enum(ERROR_CATEGORIES),
  error_subcategory: z.enum(ERROR_SUBCATEGORIES).nullable(),
  severity_level: z.number().int().min(1).max(5),
  ayah_number: z.number().int().positive().nullable(),
  additional_notes: z.string().nullable(),
});

/**
 * Complete mistake extraction schema for AI responses
 */
export const mistakeExtractionSchema = z.object({
  mistakes: z.array(extractedMistakeSchema),
  follow_up_question: z.string().nullable(),
  confidence: z.enum(CONFIDENCE_LEVELS),
});

// Export inferred types for mistake extraction
export type ExtractedMistake = z.infer<typeof extractedMistakeSchema>;
export type MistakeExtractionResult = z.infer<typeof mistakeExtractionSchema>;

// ============================================================================
// COMBINED EXTRACTION SCHEMA (for conversational chat)
// ============================================================================

/**
 * Combined schema for chat responses that may include both session and mistake data
 * Used when AI extracts information from a conversational flow
 */
export const combinedExtractionSchema = z.object({
  session: extractedSessionSchema.nullable(),
  portions: z.array(extractedPortionSchema),
  mistakes: z.array(extractedMistakeSchema),
  missing_fields: z.array(z.string()),
  follow_up_question: z.string().nullable(),
  confidence: z.enum(CONFIDENCE_LEVELS),
});

export type CombinedExtractionResult = z.infer<typeof combinedExtractionSchema>;
