import React, { useMemo } from 'react';
import { View, Text, Pressable, ScrollView, Dimensions } from 'react-native';
import { useSessions } from '@/lib/hooks';

const WEEKS_TO_SHOW = 13;
const DAYS_IN_WEEK = 7;
const CELL_SIZE = 14; // Size of each cell in pixels
const CELL_GAP = 2; // Gap between cells
const DAY_LABEL_WIDTH = 28; // Width for day labels column

export interface ActivityHeatmapProps {
  testID?: string;
  onDayPress?: (date: string, count: number) => void;
}

/**
 * Get color intensity based on session count
 */
function getIntensityColor(count: number): string {
  if (count === 0) return 'bg-gray-200';
  if (count === 1) return 'bg-green-300';
  if (count === 2) return 'bg-green-500';
  return 'bg-green-700';
}

/**
 * Generate array of dates for the last N weeks
 */
function generateDateGrid(weeks: number): { date: string; month: string; day: number }[][] {
  const grid: { date: string; month: string; day: number }[][] = [];
  const today = new Date();

  // Find the most recent Saturday (end of week)
  const endDate = new Date(today);
  const daysUntilSaturday = 6 - endDate.getDay();
  endDate.setDate(endDate.getDate() + daysUntilSaturday);

  // Start from N weeks before
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - (weeks * 7) + 1);

  for (let week = 0; week < weeks; week++) {
    const weekData: { date: string; month: string; day: number }[] = [];
    for (let day = 0; day < DAYS_IN_WEEK; day++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + (week * 7) + day);
      weekData.push({
        date: date.toISOString().split('T')[0],
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        day: date.getDate(),
      });
    }
    grid.push(weekData);
  }

  return grid;
}

/**
 * ActivityHeatmap - GitHub-style contribution graph
 */
export function ActivityHeatmap({ testID, onDayPress }: ActivityHeatmapProps) {
  const { data: sessions, isLoading } = useSessions();

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

  const dateGrid = useMemo(() => generateDateGrid(WEEKS_TO_SHOW), []);

  // Get month labels - only show when month changes and there's room
  const monthLabels = useMemo(() => {
    const labels: { month: string; weekIndex: number }[] = [];
    let lastMonth = '';

    dateGrid.forEach((week, weekIndex) => {
      const month = week[0].month;
      if (month !== lastMonth) {
        // Only add if there's at least 2 weeks before next month change
        // to prevent crowding
        labels.push({ month, weekIndex });
        lastMonth = month;
      }
    });

    return labels;
  }, [dateGrid]);

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
  const columnWidth = CELL_SIZE + CELL_GAP;

  return (
    <View testID={testID} className="bg-white rounded-xl p-4 border border-gray-100">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 8 }}
      >
        <View>
          {/* Month labels row */}
          <View
            className="flex-row mb-2"
            style={{ marginLeft: DAY_LABEL_WIDTH, height: 16 }}
          >
            {monthLabels.map(({ month, weekIndex }, idx) => (
              <Text
                key={`${month}-${idx}`}
                className="text-xs text-gray-500 absolute"
                style={{
                  left: weekIndex * columnWidth,
                }}
              >
                {month}
              </Text>
            ))}
          </View>

          {/* Grid with day labels */}
          <View className="flex-row">
            {/* Day labels column */}
            <View style={{ width: DAY_LABEL_WIDTH }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label, index) => (
                <View
                  key={label}
                  style={{ height: CELL_SIZE + CELL_GAP }}
                  className="justify-center"
                >
                  {index % 2 === 1 && (
                    <Text className="text-xs text-gray-400">{label}</Text>
                  )}
                </View>
              ))}
            </View>

            {/* Weeks grid */}
            <View className="flex-row">
              {dateGrid.map((week, weekIndex) => (
                <View key={weekIndex} style={{ marginRight: CELL_GAP }}>
                  {week.map(({ date }) => {
                    const count = sessionCountByDate[date] || 0;
                    const isFuture = date > today;

                    return (
                      <Pressable
                        key={date}
                        testID={date === today ? 'heatmap-cell-today' : undefined}
                        onPress={() => !isFuture && onDayPress?.(date, count)}
                        style={{
                          width: CELL_SIZE,
                          height: CELL_SIZE,
                          marginBottom: CELL_GAP,
                          borderRadius: 3,
                        }}
                        className={isFuture ? 'bg-gray-100' : getIntensityColor(count)}
                      />
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Legend */}
      <View className="flex-row items-center justify-end mt-3 gap-1">
        <Text className="text-xs text-gray-400 mr-2">Less</Text>
        <View style={{ width: 12, height: 12, borderRadius: 2 }} className="bg-gray-200" />
        <View style={{ width: 12, height: 12, borderRadius: 2 }} className="bg-green-300" />
        <View style={{ width: 12, height: 12, borderRadius: 2 }} className="bg-green-500" />
        <View style={{ width: 12, height: 12, borderRadius: 2 }} className="bg-green-700" />
        <Text className="text-xs text-gray-400 ml-2">More</Text>
      </View>
    </View>
  );
}
