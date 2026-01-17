import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type TrendDirection = 'up' | 'down' | 'neutral';

export interface StatCardProps {
  /** Icon name from Ionicons */
  icon: keyof typeof Ionicons.glyphMap;
  /** Label describing the stat */
  label: string;
  /** The main value to display */
  value: string | number;
  /** Optional trend direction (shows arrow) */
  trend?: TrendDirection;
  /** Optional subtitle text (e.g., "+5 this week") */
  subtitle?: string;
  /** Background color class (NativeWind) */
  bgColor?: string;
  /** Icon color */
  iconColor?: string;
  /** testID for E2E testing */
  testID?: string;
}

/**
 * StatCard - Displays a single statistic with icon, label, value
 * Used in the dashboard stats grid
 */
export function StatCard({
  icon,
  label,
  value,
  trend,
  subtitle,
  bgColor = 'bg-white',
  iconColor = '#6366f1', // indigo-500
  testID,
}: StatCardProps) {
  // Get trend icon and color
  const getTrendIcon = (): keyof typeof Ionicons.glyphMap | null => {
    if (trend === 'up') return 'trending-up';
    if (trend === 'down') return 'trending-down';
    return null;
  };

  const getTrendColor = (): string => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-gray-400';
  };

  const trendIcon = getTrendIcon();

  return (
    <View
      testID={testID}
      className={`${bgColor} rounded-xl p-4 shadow-sm border border-gray-100 flex-1`}
    >
      {/* Header: Icon and Trend */}
      <View className="flex-row justify-between items-start mb-2">
        <View className="bg-gray-100 rounded-lg p-2">
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        {trendIcon && (
          <View className={getTrendColor()}>
            <Ionicons
              name={trendIcon}
              size={16}
              color={trend === 'up' ? '#22c55e' : trend === 'down' ? '#ef4444' : '#9ca3af'}
            />
          </View>
        )}
      </View>

      {/* Value */}
      <Text
        testID={`${testID}-value`}
        className="text-2xl font-bold text-gray-900 mb-1"
      >
        {value}
      </Text>

      {/* Label */}
      <Text className="text-sm text-gray-500">{label}</Text>

      {/* Subtitle (optional) */}
      {subtitle && (
        <Text
          testID={`${testID}-subtitle`}
          className={`text-xs mt-1 ${
            trend === 'up'
              ? 'text-green-600'
              : trend === 'down'
              ? 'text-red-600'
              : 'text-gray-400'
          }`}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
}
