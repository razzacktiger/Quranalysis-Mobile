import React, { useMemo } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { useStats } from '@/lib/hooks';
import { ERROR_CATEGORIES, type ErrorCategory } from '@/types/session';

const CHART_HEIGHT = 200;
const BAR_HEIGHT = 24;
const BAR_GAP = 8;
const LABEL_WIDTH = 90;
const PADDING = { left: 16, right: 16 };

// Color scheme for each category
const CATEGORY_COLORS: Record<ErrorCategory, string> = {
  pronunciation: '#EF4444', // red
  tajweed: '#F59E0B', // amber
  memorization: '#8B5CF6', // purple
  translation: '#3B82F6', // blue
  fluency: '#10B981', // emerald
  waqf: '#EC4899', // pink
  other: '#6B7280', // gray
};

// Format category name for display
function formatCategory(category: ErrorCategory): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export interface MistakeChartProps {
  testID?: string;
}

/**
 * MistakeChart - Horizontal bar chart showing mistakes by category
 */
export function MistakeChart({ testID }: MistakeChartProps) {
  const { stats, isLoading } = useStats();

  // Sort categories by count (highest first) and filter to those with mistakes
  const chartData = useMemo(() => {
    const { mistakesByCategory } = stats;

    return ERROR_CATEGORIES
      .map((category) => ({
        category,
        count: mistakesByCategory[category] || 0,
        color: CATEGORY_COLORS[category],
      }))
      .filter((d) => d.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [stats]);

  // Calculate total for percentages
  const totalMistakes = useMemo(() => {
    return chartData.reduce((sum, d) => sum + d.count, 0);
  }, [chartData]);

  // Calculate max for scaling bars
  const maxCount = useMemo(() => {
    return Math.max(...chartData.map((d) => d.count), 1);
  }, [chartData]);

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 32 - PADDING.left - PADDING.right; // Account for container padding
  const barAreaWidth = chartWidth - LABEL_WIDTH;

  if (isLoading) {
    return (
      <View testID={`${testID}-loading`} className="bg-white rounded-xl p-4 border border-gray-100">
        <View style={{ height: CHART_HEIGHT }} className="items-center justify-center">
          <Text className="text-gray-400">Loading mistakes...</Text>
        </View>
      </View>
    );
  }

  if (chartData.length === 0) {
    return (
      <View testID={testID} className="bg-white rounded-xl p-4 border border-gray-100">
        <View style={{ height: CHART_HEIGHT }} className="items-center justify-center">
          <Text className="text-gray-500 text-center">
            🎉 No mistakes recorded yet!
          </Text>
          <Text className="text-gray-400 text-sm mt-2">
            Keep practicing to track your improvement
          </Text>
        </View>
      </View>
    );
  }

  const dynamicHeight = Math.max(CHART_HEIGHT, chartData.length * (BAR_HEIGHT + BAR_GAP) + 40);

  return (
    <View testID={testID} className="bg-white rounded-xl p-4 border border-gray-100">
      {/* Header with total */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-sm font-medium text-gray-600">By Category</Text>
        <Text className="text-sm text-gray-400">{totalMistakes} total</Text>
      </View>

      <Svg width={chartWidth} height={dynamicHeight - 40}>
        {chartData.map((d, index) => {
          const y = index * (BAR_HEIGHT + BAR_GAP);
          const barWidth = (d.count / maxCount) * barAreaWidth;
          const percentage = Math.round((d.count / totalMistakes) * 100);

          return (
            <React.Fragment key={d.category}>
              {/* Category label */}
              <SvgText
                x={0}
                y={y + BAR_HEIGHT / 2 + 4}
                fontSize={12}
                fill="#4B5563"
                textAnchor="start"
              >
                {formatCategory(d.category)}
              </SvgText>

              {/* Bar background */}
              <Rect
                x={LABEL_WIDTH}
                y={y}
                width={barAreaWidth}
                height={BAR_HEIGHT}
                rx={4}
                fill="#F3F4F6"
              />

              {/* Colored bar */}
              <Rect
                x={LABEL_WIDTH}
                y={y}
                width={barWidth}
                height={BAR_HEIGHT}
                rx={4}
                fill={d.color}
              />

              {/* Count and percentage label */}
              <SvgText
                x={LABEL_WIDTH + barWidth + 8}
                y={y + BAR_HEIGHT / 2 + 4}
                fontSize={11}
                fill="#6B7280"
                textAnchor="start"
              >
                {d.count} ({percentage}%)
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>

      {/* Legend showing all categories */}
      <View className="flex-row flex-wrap mt-4 gap-3">
        {ERROR_CATEGORIES.map((category) => (
          <View key={category} className="flex-row items-center gap-1">
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                backgroundColor: CATEGORY_COLORS[category],
              }}
            />
            <Text className="text-xs text-gray-500">{formatCategory(category)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
