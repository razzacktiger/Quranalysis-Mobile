import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatCard } from './StatCard';
import { useStats } from '@/lib/hooks';

export interface StatsGridProps {
  testID?: string;
}

/**
 * StatsGrid - 2x2 grid displaying key statistics
 * Uses useStats hook to derive data from sessions
 */
export function StatsGrid({ testID }: StatsGridProps) {
  const { stats, isLoading, error } = useStats();

  // Loading state with skeleton
  if (isLoading) {
    return (
      <View testID={`${testID}-loading`}>
        <View className="flex-row gap-3 mb-3">
          {[1, 2].map((i) => (
            <View
              key={i}
              className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-4 h-28 items-center justify-center"
            >
              <ActivityIndicator size="small" color="#6366f1" />
            </View>
          ))}
        </View>
        <View className="flex-row gap-3">
          {[3, 4].map((i) => (
            <View
              key={i}
              className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-4 h-28 items-center justify-center"
            >
              <ActivityIndicator size="small" color="#6366f1" />
            </View>
          ))}
        </View>
      </View>
    );
  }

  // Error state - show zeros
  if (error) {
    return (
      <View testID={testID}>
        <View className="flex-row gap-3 mb-3">
          <View className="flex-1">
            <StatCard
              testID="stat-total-sessions"
              icon="book-outline"
              label="Total Sessions"
              value={0}
            />
          </View>
          <View className="flex-1">
            <StatCard
              testID="stat-avg-performance"
              icon="star-outline"
              label="Avg Performance"
              value="0"
            />
          </View>
        </View>
        <View className="flex-row gap-3">
          <View className="flex-1">
            <StatCard
              testID="stat-total-mistakes"
              icon="alert-circle-outline"
              label="Total Mistakes"
              value={0}
            />
          </View>
          <View className="flex-1">
            <StatCard
              testID="stat-streak"
              icon="flame-outline"
              label="Current Streak"
              value="0 days"
            />
          </View>
        </View>
      </View>
    );
  }

  // Get top mistake category
  const topMistakeCategory = Object.entries(stats.mistakesByCategory)
    .sort(([, a], [, b]) => b - a)[0];
  const topCategoryText = topMistakeCategory
    ? `Most: ${topMistakeCategory[0]}`
    : undefined;

  // Format performance with color indicator
  const getPerformanceTrend = (): 'up' | 'down' | 'neutral' => {
    if (stats.averagePerformance >= 7) return 'up';
    if (stats.averagePerformance < 5) return 'down';
    return 'neutral';
  };

  return (
    <View testID={testID}>
      {/* Row 1 */}
      <View className="flex-row gap-3 mb-3">
        <View className="flex-1">
          <StatCard
            testID="stat-total-sessions"
            icon="book-outline"
            label="Total Sessions"
            value={stats.totalSessions}
            iconColor="#3b82f6" // blue-500
          />
        </View>
        <View className="flex-1">
          <StatCard
            testID="stat-avg-performance"
            icon="star-outline"
            label="Avg Performance"
            value={stats.averagePerformance.toFixed(1)}
            trend={getPerformanceTrend()}
            iconColor="#f59e0b" // amber-500
          />
        </View>
      </View>

      {/* Row 2 */}
      <View className="flex-row gap-3">
        <View className="flex-1">
          <StatCard
            testID="stat-total-mistakes"
            icon="alert-circle-outline"
            label="Total Mistakes"
            value={stats.totalMistakes}
            subtitle={topCategoryText}
            iconColor="#ef4444" // red-500
          />
        </View>
        <View className="flex-1">
          <StatCard
            testID="stat-streak"
            icon="flame-outline"
            label="Current Streak"
            value={`${stats.streak.current} day${stats.streak.current !== 1 ? 's' : ''}`}
            subtitle={stats.streak.best > stats.streak.current ? `Best: ${stats.streak.best}` : undefined}
            trend={stats.streak.current > 0 ? 'up' : 'neutral'}
            iconColor="#f97316" // orange-500
          />
        </View>
      </View>
    </View>
  );
}
