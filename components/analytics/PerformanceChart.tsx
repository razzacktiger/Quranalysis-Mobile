import React, { useMemo, useState } from 'react';
import { View, Text, Dimensions, ScrollView, Pressable } from 'react-native';
import Svg, { Path, Line, Circle, Rect, Text as SvgText } from 'react-native-svg';
import { useSessions } from '@/lib/hooks';
import { SESSION_TYPES, type SessionType } from '@/types/session';

const CHART_HEIGHT = 180;
const LEGEND_HEIGHT = 32; // Space for legend below chart
const TOTAL_CONTENT_HEIGHT = CHART_HEIGHT + LEGEND_HEIGHT;
const CHART_PADDING = { top: 20, right: 16, bottom: 30, left: 36 };
const MIN_SESSIONS = 3;

/**
 * Format session type for display
 */
function formatSessionType(type: SessionType): string {
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export interface PerformanceChartProps {
  testID?: string;
}

/**
 * Get color for performance score
 */
function getScoreColor(score: number): string {
  if (score < 5) return '#EF4444'; // red
  if (score <= 7) return '#F59E0B'; // yellow/amber
  return '#22C55E'; // green
}

/**
 * Format date for X-axis label
 */
function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

/**
 * PerformanceChart - Line chart showing performance over last 30 sessions
 */
export function PerformanceChart({ testID }: PerformanceChartProps) {
  const { data: sessions, isLoading } = useSessions();
  const [selectedType, setSelectedType] = useState<SessionType | null>(null);

  // Get available session types from the data
  const availableTypes = useMemo(() => {
    if (!sessions) return [];
    const types = new Set(sessions.map((s) => s.session_type));
    return SESSION_TYPES.filter((type) => types.has(type));
  }, [sessions]);

  const chartData = useMemo(() => {
    if (!sessions || sessions.length === 0) return [];

    // Filter by session type if selected
    let filteredSessions = sessions;
    if (selectedType) {
      filteredSessions = sessions.filter((s) => s.session_type === selectedType);
    }

    // Get last 30 sessions, sorted by date (oldest first for chart)
    const sortedSessions = [...filteredSessions]
      .sort((a, b) => new Date(a.session_date).getTime() - new Date(b.session_date).getTime())
      .slice(-30);

    return sortedSessions.map((session) => ({
      date: session.session_date,
      score: session.performance_score,
    }));
  }, [sessions, selectedType]);

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 32; // Account for container padding

  const innerWidth = chartWidth - CHART_PADDING.left - CHART_PADDING.right;
  const innerHeight = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;

  // Calculate positions for data points
  const points = useMemo(() => {
    if (chartData.length === 0) return [];

    const xStep = chartData.length > 1 ? innerWidth / (chartData.length - 1) : 0;

    return chartData.map((d, i) => ({
      x: CHART_PADDING.left + (chartData.length > 1 ? i * xStep : innerWidth / 2),
      y: CHART_PADDING.top + innerHeight - (d.score / 10) * innerHeight,
      score: d.score,
      date: d.date,
    }));
  }, [chartData, innerWidth, innerHeight]);

  // Generate SVG path for the line
  const linePath = useMemo(() => {
    if (points.length === 0) return '';

    return points.reduce((path, point, i) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      return `${path} L ${point.x} ${point.y}`;
    }, '');
  }, [points]);

  // Generate gradient fill path (area under the line)
  const areaPath = useMemo(() => {
    if (points.length === 0) return '';

    const baseline = CHART_PADDING.top + innerHeight;
    const firstX = points[0].x;
    const lastX = points[points.length - 1].x;

    return `${linePath} L ${lastX} ${baseline} L ${firstX} ${baseline} Z`;
  }, [linePath, points, innerHeight]);

  // X-axis labels (show ~5 labels)
  const xLabels = useMemo(() => {
    if (chartData.length <= 5) {
      return chartData.map((d, i) => ({ label: formatDateLabel(d.date), index: i }));
    }

    const step = Math.floor(chartData.length / 4);
    const labels = [];
    for (let i = 0; i < chartData.length; i += step) {
      labels.push({ label: formatDateLabel(chartData[i].date), index: i });
    }
    // Always include last point
    if (labels[labels.length - 1].index !== chartData.length - 1) {
      labels.push({ label: formatDateLabel(chartData[chartData.length - 1].date), index: chartData.length - 1 });
    }
    return labels;
  }, [chartData]);

  const xStep = chartData.length > 1 ? innerWidth / (chartData.length - 1) : 0;
  const showChart = !isLoading && chartData.length >= MIN_SESSIONS;
  const showEmpty = !isLoading && chartData.length < MIN_SESSIONS;

  // Unified render - always same structure to prevent layout thrashing
  return (
    <View testID={testID} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
      {/* Filter chips - always render after loading */}
      {!isLoading && (
        <View className="flex-row flex-wrap mb-3">
          <Pressable
            testID="filter-all"
            onPress={() => setSelectedType(null)}
            className={`px-3 py-1.5 rounded-full mr-2 mb-2 ${
              selectedType === null ? 'bg-emerald-500' : 'bg-gray-100 dark:bg-gray-700'
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                selectedType === null ? 'text-white' : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              All
            </Text>
          </Pressable>
          {availableTypes.map((type) => (
            <Pressable
              key={type}
              testID={`filter-${type}`}
              onPress={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-full mr-2 mb-2 ${
                selectedType === type ? 'bg-emerald-500' : 'bg-gray-100 dark:bg-gray-700'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  selectedType === type ? 'text-white' : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {formatSessionType(type)}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Loading state - use TOTAL_CONTENT_HEIGHT for consistent sizing */}
      {isLoading && (
        <View style={{ height: TOTAL_CONTENT_HEIGHT }} className="items-center justify-center">
          <Text className="text-gray-400">Loading chart...</Text>
        </View>
      )}

      {/* Empty state - use TOTAL_CONTENT_HEIGHT for consistent sizing */}
      {showEmpty && (
        <View style={{ height: TOTAL_CONTENT_HEIGHT }} className="items-center justify-center">
          <Text className="text-gray-500 dark:text-gray-400 text-center">
            📊 Need at least {MIN_SESSIONS} sessions{'\n'}to show performance chart
          </Text>
          <Text className="text-gray-400 text-sm mt-2">
            {chartData.length} of {MIN_SESSIONS}{selectedType ? ` ${formatSessionType(selectedType)}` : ''} sessions
          </Text>
        </View>
      )}

      {/* Chart */}
      {showChart && (
        <>
          <Svg width={chartWidth} height={CHART_HEIGHT}>
        {/* Color zone backgrounds */}
        {/* Red zone: 0-5 */}
        <Rect
          x={CHART_PADDING.left}
          y={CHART_PADDING.top + innerHeight * 0.5}
          width={innerWidth}
          height={innerHeight * 0.5}
          fill="#FEE2E2"
          opacity={0.5}
        />
        {/* Yellow zone: 5-7 */}
        <Rect
          x={CHART_PADDING.left}
          y={CHART_PADDING.top + innerHeight * 0.3}
          width={innerWidth}
          height={innerHeight * 0.2}
          fill="#FEF3C7"
          opacity={0.5}
        />
        {/* Green zone: 7-10 */}
        <Rect
          x={CHART_PADDING.left}
          y={CHART_PADDING.top}
          width={innerWidth}
          height={innerHeight * 0.3}
          fill="#DCFCE7"
          opacity={0.5}
        />

        {/* Y-axis grid lines and labels */}
        {[0, 2.5, 5, 7.5, 10].map((value) => {
          const y = CHART_PADDING.top + innerHeight - (value / 10) * innerHeight;
          return (
            <React.Fragment key={value}>
              <Line
                x1={CHART_PADDING.left}
                y1={y}
                x2={CHART_PADDING.left + innerWidth}
                y2={y}
                stroke="#E5E7EB"
                strokeWidth={1}
              />
              <SvgText
                x={CHART_PADDING.left - 8}
                y={y + 4}
                fontSize={10}
                fill="#9CA3AF"
                textAnchor="end"
              >
                {value}
              </SvgText>
            </React.Fragment>
          );
        })}

        {/* Area fill under line */}
        <Path d={areaPath} fill="#22C55E" opacity={0.1} />

        {/* Main line */}
        <Path
          d={linePath}
          stroke="#22C55E"
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((point, i) => (
          <Circle
            key={i}
            cx={point.x}
            cy={point.y}
            r={4}
            fill={getScoreColor(point.score)}
            stroke="white"
            strokeWidth={2}
          />
        ))}

        {/* X-axis labels */}
        {xLabels.map(({ label, index }) => {
          const x = CHART_PADDING.left + (chartData.length > 1 ? index * xStep : innerWidth / 2);
          return (
            <SvgText
              key={index}
              x={x}
              y={CHART_HEIGHT - 8}
              fontSize={9}
              fill="#9CA3AF"
              textAnchor="middle"
            >
              {label}
            </SvgText>
          );
        })}
        </Svg>

        {/* Legend */}
        <View className="flex-row items-center justify-center mt-2 gap-4">
          <View className="flex-row items-center gap-1">
            <View className="w-3 h-3 rounded-sm bg-red-500" />
            <Text className="text-xs text-gray-500 dark:text-gray-400">&lt;5</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <View className="w-3 h-3 rounded-sm bg-amber-500" />
            <Text className="text-xs text-gray-500 dark:text-gray-400">5-7</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <View className="w-3 h-3 rounded-sm bg-green-500" />
            <Text className="text-xs text-gray-500 dark:text-gray-400">&gt;7</Text>
          </View>
        </View>
        </>
      )}
    </View>
  );
}
