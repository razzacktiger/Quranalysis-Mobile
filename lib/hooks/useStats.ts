// Stats hook - derives statistics from session data

import { useMemo } from 'react';
import { useSessions } from './useSessions';
import {
  calculateTotalSessions,
  calculateAveragePerformance,
  calculateTotalMistakes,
  calculateCurrentStreak,
  calculateMistakesByCategory,
  calculateSessionsByType,
  calculateAyahsAndPages,
} from '@/lib/utils/stats';
import type { ErrorCategory, SessionType } from '@/types/session';

export interface StatsData {
  totalSessions: number;
  averagePerformance: number;
  totalMistakes: number;
  streak: { current: number; best: number };
  mistakesByCategory: Partial<Record<ErrorCategory, number>>;
  sessionsByType: Partial<Record<SessionType, number>>;
  totals: { totalAyahs: number; totalPages: number };
}

/**
 * Hook to derive statistics from session data
 * Memoizes calculations to prevent unnecessary recalculation
 */
export function useStats() {
  const { data: sessions, isLoading, error } = useSessions();

  const stats = useMemo<StatsData>(() => {
    if (!sessions || sessions.length === 0) {
      return {
        totalSessions: 0,
        averagePerformance: 0,
        totalMistakes: 0,
        streak: { current: 0, best: 0 },
        mistakesByCategory: {},
        sessionsByType: {},
        totals: { totalAyahs: 0, totalPages: 0 },
      };
    }

    return {
      totalSessions: calculateTotalSessions(sessions),
      averagePerformance: calculateAveragePerformance(sessions),
      totalMistakes: calculateTotalMistakes(sessions),
      streak: calculateCurrentStreak(sessions),
      mistakesByCategory: calculateMistakesByCategory(sessions),
      sessionsByType: calculateSessionsByType(sessions),
      totals: calculateAyahsAndPages(sessions),
    };
  }, [sessions]);

  return {
    stats,
    isLoading,
    error,
  };
}
