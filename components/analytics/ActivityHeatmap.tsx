import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSessions } from '@/lib/hooks';

const WEEKS_TO_SHOW = 12;
const DAYS_IN_WEEK = 7;
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

export interface ActivityHeatmapProps {
  testID?: string;
  onDayPress?: (date: string, count: number) => void;
}

/**
 * Get color intensity based on session count
 * 0 = gray, 1 = light green, 2 = medium green, 3+ = dark green
 */
function getIntensityColor(count: number): string {
  if (count === 0) return 'bg-gray-100';
  if (count === 1) return 'bg-green-200';
  if (count === 2) return 'bg-green-400';
  return 'bg-green-600';
}

/**
 * Generate array of dates for the last N weeks
 * Returns dates organized by week (column) and day (row)
 */
function generateDateGrid(weeks: number): string[][] {
  const grid: string[][] = [];
  const today = new Date();

  // Start from the beginning of the week, N weeks ago
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - (weeks * 7) + (7 - today.getDay()));

  for (let week = 0; week < weeks; week++) {
    const weekDates: string[] = [];
    for (let day = 0; day < DAYS_IN_WEEK; day++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + (week * 7) + day);
      weekDates.push(date.toISOString().split('T')[0]);
    }
    grid.push(weekDates);
  }

  return grid;
}

/**
 * ActivityHeatmap - GitHub-style contribution graph
 * Shows practice activity over the last 12 weeks
 */
export function ActivityHeatmap({ testID, onDayPress }: ActivityHeatmapProps) {
  const { data: sessions, isLoading } = useSessions();

  // Count sessions per date
  const sessionCountByDate = useMemo(() => {
    const counts: Record<string, number> = {};
    if (sessions) {
      for (const session of sessions) {
        const date = session.session_date;
        counts[date] = (counts[date] || 0) + 1;
      }
    }
    return counts;
  }, [sessions]);

  // Generate date grid
  const dateGrid = useMemo(() => generateDateGrid(WEEKS_TO_SHOW), []);

  // Get month labels for the grid
  const monthLabels = useMemo(() => {
    const labels: { month: string; week: number }[] = [];
    let lastMonth = '';

    dateGrid.forEach((week, weekIndex) => {
      const firstDayOfWeek = new Date(week[0]);
      const month = firstDayOfWeek.toLocaleDateString('en-US', { month: 'short' });
      if (month !== lastMonth) {
        labels.push({ month, week: weekIndex });
        lastMonth = month;
      }
    });

    return labels;
  }, [dateGrid]);

  // Loading state
  if (isLoading) {
    return (
      <View testID={`${testID}-loading`} className="bg-white rounded-xl p-4 border border-gray-100">
        <View className="h-32 items-center justify-center">
          <Text className="text-gray-400">Loading activity...</Text>
        </View>
      </View>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <View testID={testID} className="bg-white rounded-xl p-4 border border-gray-100">
      {/* Month labels */}
      <View className="flex-row mb-1 ml-8">
        {monthLabels.map(({ month, week }, index) => (
          <Text
            key={`${month}-${index}`}
            className="text-xs text-gray-400"
            style={{
              position: 'absolute',
              left: week * 14 + 32, // 14 = cell width (10) + gap (4)
            }}
          >
            {month}
          </Text>
        ))}
      </View>

      {/* Heatmap grid */}
      <View className="flex-row mt-4">
        {/* Day labels */}
        <View className="mr-2 justify-between" style={{ height: DAYS_IN_WEEK * 14 - 4 }}>
          {DAY_LABELS.map((label, index) => (
            <Text key={index} className="text-xs text-gray-400 h-3">
              {label}
            </Text>
          ))}
        </View>

        {/* Grid of cells */}
        <View className="flex-row gap-1">
          {dateGrid.map((week, weekIndex) => (
            <View key={weekIndex} className="gap-1">
              {week.map((date, dayIndex) => {
                const count = sessionCountByDate[date] || 0;
                const isFuture = date > today;

                return (
                  <Pressable
                    key={date}
                    testID={date === today ? 'heatmap-cell-today' : undefined}
                    onPress={() => !isFuture && onDayPress?.(date, count)}
                    className={`w-2.5 h-2.5 rounded-sm ${
                      isFuture ? 'bg-gray-50' : getIntensityColor(count)
                    }`}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </View>

      {/* Legend */}
      <View className="flex-row items-center justify-end mt-3 gap-1">
        <Text className="text-xs text-gray-400 mr-1">Less</Text>
        <View className="w-2.5 h-2.5 rounded-sm bg-gray-100" />
        <View className="w-2.5 h-2.5 rounded-sm bg-green-200" />
        <View className="w-2.5 h-2.5 rounded-sm bg-green-400" />
        <View className="w-2.5 h-2.5 rounded-sm bg-green-600" />
        <Text className="text-xs text-gray-400 ml-1">More</Text>
      </View>
    </View>
  );
}
