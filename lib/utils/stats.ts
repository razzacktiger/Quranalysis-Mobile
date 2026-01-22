import type { SessionWithRelations } from '@/lib/api/sessions';
import type { ErrorCategory, SessionType } from '@/types/session';

/**
 * Calculate total number of sessions
 */
export function calculateTotalSessions(sessions: SessionWithRelations[]): number {
  return sessions.length;
}

/**
 * Calculate average performance score across all sessions
 * Returns 0 for empty array, rounds to 1 decimal place
 */
export function calculateAveragePerformance(sessions: SessionWithRelations[]): number {
  if (sessions.length === 0) return 0;

  const total = sessions.reduce((sum, s) => sum + s.performance_score, 0);
  const avg = total / sessions.length;

  // Round to 1 decimal place
  return Math.round(avg * 10) / 10;
}

/**
 * Calculate total mistakes across all sessions
 */
export function calculateTotalMistakes(sessions: SessionWithRelations[]): number {
  return sessions.reduce((sum, s) => sum + s.mistakes.length, 0);
}

/**
 * Calculate current and best streak of consecutive practice days
 * - Current streak: consecutive days ending at today or yesterday
 * - Best streak: longest consecutive streak ever
 */
export function calculateCurrentStreak(
  sessions: SessionWithRelations[]
): { current: number; best: number } {
  if (sessions.length === 0) return { current: 0, best: 0 };

  // Get unique dates (sorted descending - most recent first)
  // Normalize to YYYY-MM-DD format (handles both ISO timestamps and date-only strings)
  const uniqueDates = [
    ...new Set(sessions.map((s) => s.session_date.split('T')[0])),
  ].sort((a, b) => b.localeCompare(a));

  if (uniqueDates.length === 0) return { current: 0, best: 0 };

  // Helper to get date string for N days ago
  const getDateStr = (daysAgo: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  };

  const today = getDateStr(0);
  const yesterday = getDateStr(1);

  // Convert dates to a Set for O(1) lookup
  const dateSet = new Set(uniqueDates);

  // Calculate all streaks
  let currentStreak = 0;

  // First, find the current streak (starting from today or yesterday)
  const mostRecentDate = uniqueDates[0];
  const startFromToday = mostRecentDate === today;
  const startFromYesterday = mostRecentDate === yesterday;

  if (!startFromToday && !startFromYesterday) {
    // Most recent session is older than yesterday - no current streak
    currentStreak = 0;
  } else {
    // Count consecutive days starting from today
    let checkDay = 0;
    while (dateSet.has(getDateStr(checkDay)) || (checkDay === 0 && startFromYesterday)) {
      if (dateSet.has(getDateStr(checkDay))) {
        currentStreak++;
      } else if (checkDay === 0 && startFromYesterday) {
        // Today has no session but yesterday does - start counting from yesterday
        checkDay++;
        continue;
      }
      checkDay++;
    }

    // Handle case where streak starts from yesterday
    if (!startFromToday && startFromYesterday) {
      currentStreak = 0;
      checkDay = 1; // Start from yesterday
      while (dateSet.has(getDateStr(checkDay))) {
        currentStreak++;
        checkDay++;
      }
    }
  }

  // Calculate best streak by finding all consecutive sequences
  let bestStreak = currentStreak;

  // Sort dates ascending for streak calculation
  const sortedDates = [...uniqueDates].sort((a, b) => a.localeCompare(b));

  let tempStreak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currDate = new Date(sortedDates[i]);

    // Calculate difference in days
    const diffTime = currDate.getTime() - prevDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      tempStreak++;
    } else {
      bestStreak = Math.max(bestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  bestStreak = Math.max(bestStreak, tempStreak);

  return { current: currentStreak, best: bestStreak };
}

/**
 * Group mistakes by error category and count
 */
export function calculateMistakesByCategory(
  sessions: SessionWithRelations[]
): Partial<Record<ErrorCategory, number>> {
  const result: Partial<Record<ErrorCategory, number>> = {};

  for (const session of sessions) {
    for (const mistake of session.mistakes) {
      const category = mistake.error_category;
      result[category] = (result[category] || 0) + 1;
    }
  }

  return result;
}

/**
 * Group sessions by type and count
 */
export function calculateSessionsByType(
  sessions: SessionWithRelations[]
): Partial<Record<SessionType, number>> {
  const result: Partial<Record<SessionType, number>> = {};

  for (const session of sessions) {
    const type = session.session_type;
    result[type] = (result[type] || 0) + 1;
  }

  return result;
}

/**
 * Calculate total ayahs and pages across all sessions
 */
export function calculateAyahsAndPages(
  sessions: SessionWithRelations[]
): { totalAyahs: number; totalPages: number } {
  let totalAyahs = 0;
  let totalPages = 0;

  for (const session of sessions) {
    for (const portion of session.session_portions) {
      // Ayahs = end - start + 1 (inclusive range)
      totalAyahs += portion.ayah_end - portion.ayah_start + 1;
      totalPages += portion.pages_read;
    }
  }

  return { totalAyahs, totalPages };
}
