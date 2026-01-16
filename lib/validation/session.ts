import { z } from 'zod';
import {
  SESSION_TYPES,
  RECENCY_CATEGORIES,
  ERROR_CATEGORIES,
  ERROR_SUBCATEGORIES,
} from '@/types/session';

// Session schema
export const sessionSchema = z.object({
  session_date: z.string().min(1, 'Session date is required'),
  session_type: z.enum(SESSION_TYPES, {
    message: 'Invalid session type',
  }),
  duration_minutes: z.number().int().positive('Duration must be positive'),
  performance_score: z
    .number()
    .min(0, 'Score must be at least 0')
    .max(10, 'Score must be at most 10'),
  session_goal: z.string().optional(),
  additional_notes: z.string().optional(),
});

// Portion schema with custom refinement for ayah validation
export const portionSchema = z
  .object({
    tempId: z.string().uuid(),
    databaseId: z.string().uuid().optional(),
    surah_name: z.string().min(1, 'Surah name is required'),
    ayah_start: z.number().int().positive().optional(),
    ayah_end: z.number().int().positive().optional(),
    repetition_count: z.number().int().nonnegative(),
    recency_category: z.enum(RECENCY_CATEGORIES, {
      message: 'Invalid recency category',
    }),
    juz_number: z.number().int().positive().optional(),
    pages_read: z.number().nonnegative().optional(),
  })
  .refine(
    (data) => {
      if (data.ayah_start !== undefined && data.ayah_end !== undefined) {
        return data.ayah_end >= data.ayah_start;
      }
      return true;
    },
    {
      message: 'End ayah must be greater than or equal to start ayah',
      path: ['ayah_end'],
    }
  );

// Mistake schema
export const mistakeSchema = z.object({
  tempId: z.string().uuid(),
  databaseId: z.string().uuid().optional(),
  portionTempId: z.string().uuid(),
  error_category: z.enum(ERROR_CATEGORIES, {
    message: 'Invalid error category',
  }),
  error_subcategory: z.enum(ERROR_SUBCATEGORIES).optional(),
  severity_level: z
    .number()
    .int()
    .min(1, 'Severity must be at least 1')
    .max(5, 'Severity must be at most 5'),
  ayah_number: z.number().int().positive(),
  additional_notes: z.string().optional(),
});

// Complete session form schema
export const sessionFormSchema = sessionSchema.extend({
  portions: z.array(portionSchema).min(1, 'At least one portion is required'),
  mistakes: z.array(mistakeSchema),
});

// Export types inferred from schemas
export type SessionSchemaType = z.infer<typeof sessionSchema>;
export type PortionSchemaType = z.infer<typeof portionSchema>;
export type MistakeSchemaType = z.infer<typeof mistakeSchema>;
export type SessionFormSchemaType = z.infer<typeof sessionFormSchema>;
