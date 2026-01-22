import {
  calculateTotalSessions,
  calculateAveragePerformance,
  calculateTotalMistakes,
  calculateCurrentStreak,
  calculateMistakesByCategory,
  calculateSessionsByType,
  calculateAyahsAndPages,
} from './stats';
import type { SessionWithRelations } from '@/lib/api/sessions';
import type { SessionPortion, MistakeData } from '@/types/session';

// Helper to create mock session data (SessionWithRelations = flattened structure)
const createSession = (overrides: Partial<SessionWithRelations> = {}): SessionWithRelations => ({
  id: 'session-1',
  user_id: 'user-1',
  session_date: '2025-01-15',
  session_type: 'reading_practice',
  duration_minutes: 30,
  performance_score: 7,
  created_at: '2025-01-15T10:00:00Z',
  updated_at: '2025-01-15T10:00:00Z',
  session_portions: [],
  mistakes: [],
  ...overrides,
});

const createPortion = (overrides: Partial<SessionPortion> = {}): SessionPortion => ({
  id: 'portion-1',
  session_id: 'session-1',
  surah_name: 'Al-Fatiha',
  ayah_start: 1,
  ayah_end: 7,
  juz_number: 1,
  pages_read: 1,
  repetition_count: 3,
  recency_category: 'new',
  created_at: '2025-01-15T10:00:00Z',
  ...overrides,
});

const createMistake = (overrides: Partial<MistakeData> = {}): MistakeData => ({
  id: 'mistake-1',
  session_id: 'session-1',
  session_portion_id: 'portion-1',
  error_category: 'pronunciation',
  severity_level: 3,
  ayah_number: 2,
  created_at: '2025-01-15T10:00:00Z',
  ...overrides,
});

describe('calculateTotalSessions', () => {
  it('returns 0 for empty array', () => {
    expect(calculateTotalSessions([])).toBe(0);
  });

  it('counts all sessions', () => {
    const sessions = [
      createSession({ id: 'session-1' }),
      createSession({ id: 'session-2' }),
      createSession({ id: 'session-3' }),
    ];
    expect(calculateTotalSessions(sessions)).toBe(3);
  });
});

describe('calculateAveragePerformance', () => {
  it('returns 0 for empty array', () => {
    expect(calculateAveragePerformance([])).toBe(0);
  });

  it('calculates mean correctly', () => {
    const sessions = [
      createSession({ performance_score: 8 }),
      createSession({ performance_score: 6 }),
      createSession({ performance_score: 10 }),
    ];
    // (8 + 6 + 10) / 3 = 8
    expect(calculateAveragePerformance(sessions)).toBe(8);
  });

  it('rounds to 1 decimal place', () => {
    const sessions = [
      createSession({ performance_score: 7 }),
      createSession({ performance_score: 8 }),
      createSession({ performance_score: 9 }),
    ];
    // (7 + 8 + 9) / 3 = 8
    expect(calculateAveragePerformance(sessions)).toBe(8);
  });

  it('handles single session', () => {
    const sessions = [createSession({ performance_score: 5 })];
    expect(calculateAveragePerformance(sessions)).toBe(5);
  });
});

describe('calculateTotalMistakes', () => {
  it('returns 0 for empty array', () => {
    expect(calculateTotalMistakes([])).toBe(0);
  });

  it('returns 0 for sessions with no mistakes', () => {
    const sessions = [
      createSession({ session_portions: [createPortion()], mistakes: [] }),
      createSession({ session_portions: [createPortion()], mistakes: [] }),
    ];
    expect(calculateTotalMistakes(sessions)).toBe(0);
  });

  it('sums mistakes across all sessions', () => {
    const sessions = [
      createSession({ mistakes: [createMistake(), createMistake()] }),
      createSession({ mistakes: [createMistake()] }),
      createSession({ mistakes: [createMistake(), createMistake(), createMistake()] }),
    ];
    expect(calculateTotalMistakes(sessions)).toBe(6);
  });
});

describe('calculateCurrentStreak', () => {
  // Helper to get date string N days ago from today
  const daysAgo = (n: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - n);
    return date.toISOString().split('T')[0];
  };

  it('returns { current: 0, best: 0 } for empty array', () => {
    expect(calculateCurrentStreak([])).toEqual({ current: 0, best: 0 });
  });

  it('counts consecutive days including today', () => {
    const sessions = [
      createSession({ session_date: daysAgo(0) }), // today
      createSession({ session_date: daysAgo(1) }), // yesterday
      createSession({ session_date: daysAgo(2) }), // 2 days ago
    ];
    expect(calculateCurrentStreak(sessions)).toEqual({ current: 3, best: 3 });
  });

  it('breaks streak on gap day', () => {
    const sessions = [
      createSession({ session_date: daysAgo(0) }), // today
      createSession({ session_date: daysAgo(1) }), // yesterday
      // gap on day 2
      createSession({ session_date: daysAgo(3) }), // 3 days ago
    ];
    expect(calculateCurrentStreak(sessions)).toEqual({ current: 2, best: 2 });
  });

  it('today counts only if session exists', () => {
    const sessions = [
      // no session today
      createSession({ session_date: daysAgo(1) }), // yesterday
      createSession({ session_date: daysAgo(2) }), // 2 days ago
    ];
    // Streak from yesterday is still current (within 1 day)
    expect(calculateCurrentStreak(sessions).current).toBe(2);
  });

  it('tracks best streak separately from current', () => {
    const sessions = [
      createSession({ session_date: daysAgo(0) }), // today (current streak: 1)
      // gap
      createSession({ session_date: daysAgo(5) }), // 5 days ago
      createSession({ session_date: daysAgo(6) }), // 6 days ago
      createSession({ session_date: daysAgo(7) }), // 7 days ago
      createSession({ session_date: daysAgo(8) }), // 8 days ago (best streak: 4)
    ];
    expect(calculateCurrentStreak(sessions)).toEqual({ current: 1, best: 4 });
  });

  it('handles multiple sessions on same day', () => {
    const sessions = [
      createSession({ session_date: daysAgo(0) }),
      createSession({ session_date: daysAgo(0) }), // same day
      createSession({ session_date: daysAgo(1) }),
    ];
    expect(calculateCurrentStreak(sessions)).toEqual({ current: 2, best: 2 });
  });

  it('returns 0 current streak if gap of 2+ days from today', () => {
    const sessions = [
      createSession({ session_date: daysAgo(3) }),
      createSession({ session_date: daysAgo(4) }),
    ];
    expect(calculateCurrentStreak(sessions).current).toBe(0);
  });

  it('handles ISO timestamp format (with time component)', () => {
    // Real sessions are stored with full ISO timestamps like "2025-01-21T00:00:00Z"
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const sessions = [
      createSession({ session_date: today.toISOString() }), // Full ISO: "2025-01-22T12:30:00.000Z"
      createSession({ session_date: yesterday.toISOString() }),
    ];
    expect(calculateCurrentStreak(sessions)).toEqual({ current: 2, best: 2 });
  });
});

describe('calculateMistakesByCategory', () => {
  it('returns empty object for no mistakes', () => {
    const sessions = [createSession({ session_portions: [createPortion()], mistakes: [] })];
    expect(calculateMistakesByCategory(sessions)).toEqual({});
  });

  it('groups by category correctly', () => {
    const sessions = [
      createSession({
        mistakes: [
          createMistake({ error_category: 'pronunciation' }),
          createMistake({ error_category: 'pronunciation' }),
          createMistake({ error_category: 'tajweed' }),
          createMistake({ error_category: 'memorization' }),
          createMistake({ error_category: 'memorization' }),
          createMistake({ error_category: 'memorization' }),
        ],
      }),
    ];
    expect(calculateMistakesByCategory(sessions)).toEqual({
      pronunciation: 2,
      tajweed: 1,
      memorization: 3,
    });
  });

  it('aggregates across multiple sessions', () => {
    const sessions = [
      createSession({ mistakes: [createMistake({ error_category: 'pronunciation' })] }),
      createSession({ mistakes: [createMistake({ error_category: 'pronunciation' })] }),
    ];
    expect(calculateMistakesByCategory(sessions)).toEqual({
      pronunciation: 2,
    });
  });
});

describe('calculateSessionsByType', () => {
  it('returns empty object for no sessions', () => {
    expect(calculateSessionsByType([])).toEqual({});
  });

  it('groups by session type correctly', () => {
    const sessions = [
      createSession({ session_type: 'reading_practice' }),
      createSession({ session_type: 'reading_practice' }),
      createSession({ session_type: 'memorization' }),
      createSession({ session_type: 'audit' }),
    ];
    expect(calculateSessionsByType(sessions)).toEqual({
      reading_practice: 2,
      memorization: 1,
      audit: 1,
    });
  });
});

describe('calculateAyahsAndPages', () => {
  it('returns { totalAyahs: 0, totalPages: 0 } for empty array', () => {
    expect(calculateAyahsAndPages([])).toEqual({ totalAyahs: 0, totalPages: 0 });
  });

  it('sums ayahs and pages across portions', () => {
    const sessions = [
      createSession({
        session_portions: [
          createPortion({ ayah_start: 1, ayah_end: 7, pages_read: 1 }), // 7 ayahs
          createPortion({ ayah_start: 1, ayah_end: 5, pages_read: 2 }), // 5 ayahs
        ],
      }),
      createSession({
        session_portions: [
          createPortion({ ayah_start: 10, ayah_end: 20, pages_read: 3 }), // 11 ayahs
        ],
      }),
    ];
    expect(calculateAyahsAndPages(sessions)).toEqual({
      totalAyahs: 23, // 7 + 5 + 11
      totalPages: 6, // 1 + 2 + 3
    });
  });

  it('handles portions with same start and end ayah', () => {
    const sessions = [
      createSession({
        session_portions: [createPortion({ ayah_start: 5, ayah_end: 5, pages_read: 1 })],
      }),
    ];
    expect(calculateAyahsAndPages(sessions)).toEqual({
      totalAyahs: 1,
      totalPages: 1,
    });
  });
});
