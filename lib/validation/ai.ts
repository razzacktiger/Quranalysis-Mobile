import { z } from 'zod';
import { SESSION_TYPES, RECENCY_CATEGORIES } from '@/types/session';

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

// Export inferred types
export type ExtractedSession = z.infer<typeof extractedSessionSchema>;
export type ExtractedPortion = z.infer<typeof extractedPortionSchema>;
export type SessionExtractionResult = z.infer<typeof sessionExtractionSchema>;
