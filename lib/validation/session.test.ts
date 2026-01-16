import { sessionSchema, portionSchema, mistakeSchema, sessionFormSchema } from './session';

describe('sessionSchema', () => {
  it('accepts valid session data', () => {
    const validSession = {
      session_date: '2025-01-15',
      session_type: 'reading_practice',
      duration_minutes: 30,
      performance_score: 7.5,
    };
    const result = sessionSchema.safeParse(validSession);
    expect(result.success).toBe(true);
  });

  it('rejects invalid performance_score > 10', () => {
    const invalidSession = {
      session_date: '2025-01-15',
      session_type: 'reading_practice',
      duration_minutes: 30,
      performance_score: 11,
    };
    const result = sessionSchema.safeParse(invalidSession);
    expect(result.success).toBe(false);
  });

  it('rejects invalid performance_score < 0', () => {
    const invalidSession = {
      session_date: '2025-01-15',
      session_type: 'reading_practice',
      duration_minutes: 30,
      performance_score: -1,
    };
    const result = sessionSchema.safeParse(invalidSession);
    expect(result.success).toBe(false);
  });

  it('accepts performance_score with decimals', () => {
    const validSession = {
      session_date: '2025-01-15',
      session_type: 'reading_practice',
      duration_minutes: 30,
      performance_score: 8.5,
    };
    const result = sessionSchema.safeParse(validSession);
    expect(result.success).toBe(true);
  });

  it('rejects invalid session_type', () => {
    const invalidSession = {
      session_date: '2025-01-15',
      session_type: 'invalid_type',
      duration_minutes: 30,
      performance_score: 7,
    };
    const result = sessionSchema.safeParse(invalidSession);
    expect(result.success).toBe(false);
  });

  it('rejects duration_minutes <= 0', () => {
    const invalidSession = {
      session_date: '2025-01-15',
      session_type: 'reading_practice',
      duration_minutes: 0,
      performance_score: 7,
    };
    const result = sessionSchema.safeParse(invalidSession);
    expect(result.success).toBe(false);
  });
});

describe('portionSchema', () => {
  it('accepts valid portion with ayah_end >= ayah_start', () => {
    const validPortion = {
      tempId: '123e4567-e89b-12d3-a456-426614174000',
      surah_name: 'Al-Fatiha',
      ayah_start: 1,
      ayah_end: 7,
      repetition_count: 3,
      recency_category: 'new',
    };
    const result = portionSchema.safeParse(validPortion);
    expect(result.success).toBe(true);
  });

  it('rejects ayah_end < ayah_start', () => {
    const invalidPortion = {
      tempId: '123e4567-e89b-12d3-a456-426614174000',
      surah_name: 'Al-Fatiha',
      ayah_start: 7,
      ayah_end: 1,
      repetition_count: 3,
      recency_category: 'new',
    };
    const result = portionSchema.safeParse(invalidPortion);
    expect(result.success).toBe(false);
  });

  it('accepts ayah_end equal to ayah_start', () => {
    const validPortion = {
      tempId: '123e4567-e89b-12d3-a456-426614174000',
      surah_name: 'Al-Fatiha',
      ayah_start: 5,
      ayah_end: 5,
      repetition_count: 3,
      recency_category: 'new',
    };
    const result = portionSchema.safeParse(validPortion);
    expect(result.success).toBe(true);
  });

  it('rejects invalid recency_category', () => {
    const invalidPortion = {
      tempId: '123e4567-e89b-12d3-a456-426614174000',
      surah_name: 'Al-Fatiha',
      ayah_start: 1,
      ayah_end: 7,
      repetition_count: 3,
      recency_category: 'invalid',
    };
    const result = portionSchema.safeParse(invalidPortion);
    expect(result.success).toBe(false);
  });
});

describe('mistakeSchema', () => {
  it('accepts severity_level 1-5', () => {
    for (let level = 1; level <= 5; level++) {
      const validMistake = {
        tempId: '123e4567-e89b-12d3-a456-426614174000',
        portionTempId: '123e4567-e89b-12d3-a456-426614174001',
        error_category: 'pronunciation',
        severity_level: level,
        ayah_number: 1,
      };
      const result = mistakeSchema.safeParse(validMistake);
      expect(result.success).toBe(true);
    }
  });

  it('rejects severity_level > 5', () => {
    const invalidMistake = {
      tempId: '123e4567-e89b-12d3-a456-426614174000',
      portionTempId: '123e4567-e89b-12d3-a456-426614174001',
      error_category: 'pronunciation',
      severity_level: 6,
      ayah_number: 1,
    };
    const result = mistakeSchema.safeParse(invalidMistake);
    expect(result.success).toBe(false);
  });

  it('rejects severity_level < 1', () => {
    const invalidMistake = {
      tempId: '123e4567-e89b-12d3-a456-426614174000',
      portionTempId: '123e4567-e89b-12d3-a456-426614174001',
      error_category: 'pronunciation',
      severity_level: 0,
      ayah_number: 1,
    };
    const result = mistakeSchema.safeParse(invalidMistake);
    expect(result.success).toBe(false);
  });

  it('rejects invalid error_category', () => {
    const invalidMistake = {
      tempId: '123e4567-e89b-12d3-a456-426614174000',
      portionTempId: '123e4567-e89b-12d3-a456-426614174001',
      error_category: 'invalid_category',
      severity_level: 3,
      ayah_number: 1,
    };
    const result = mistakeSchema.safeParse(invalidMistake);
    expect(result.success).toBe(false);
  });
});

describe('sessionFormSchema', () => {
  it('accepts valid complete session form', () => {
    const validForm = {
      session_date: '2025-01-15',
      session_type: 'reading_practice',
      duration_minutes: 30,
      performance_score: 8,
      portions: [
        {
          tempId: '123e4567-e89b-12d3-a456-426614174000',
          surah_name: 'Al-Fatiha',
          ayah_start: 1,
          ayah_end: 7,
          repetition_count: 3,
          recency_category: 'new',
        },
      ],
      mistakes: [],
    };
    const result = sessionFormSchema.safeParse(validForm);
    expect(result.success).toBe(true);
  });

  it('rejects form with no portions', () => {
    const invalidForm = {
      session_date: '2025-01-15',
      session_type: 'reading_practice',
      duration_minutes: 30,
      performance_score: 8,
      portions: [],
      mistakes: [],
    };
    const result = sessionFormSchema.safeParse(invalidForm);
    expect(result.success).toBe(false);
  });
});
