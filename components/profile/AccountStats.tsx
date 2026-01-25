import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface AccountStatsProps {
  totalSessions: number;
  totalPracticeMinutes: number;
  memberSinceDate: string | null;
  mostPracticedSurah: string | null;
  testID?: string;
}

/**
 * AccountStats - Displays account statistics on the profile screen
 * Shows total sessions, practice time, member since date, and most practiced surah
 */
export function AccountStats({
  totalSessions,
  totalPracticeMinutes,
  memberSinceDate,
  mostPracticedSurah,
  testID = 'account-stats',
}: AccountStatsProps) {
  // Format practice time as hours and minutes
  const formatPracticeTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours} hr`;
    }
    return `${hours} hr ${remainingMinutes} min`;
  };

  // Format member since date
  const formatMemberSince = (dateStr: string | null): string => {
    if (!dateStr) return 'New member';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <View testID={testID} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      {/* Section Header */}
      <Text className="text-lg font-semibold text-gray-900 mb-4">Account</Text>

      {/* Stats Grid - 2 rows of 2 */}
      <View>
        {/* Row 1 */}
        <View className="flex-row gap-3 mb-3">
          {/* Total Sessions */}
          <View
            testID="stat-total-sessions"
            className="flex-1 bg-gray-50 rounded-lg p-3"
          >
            <View className="flex-row items-center mb-1">
              <Ionicons name="calendar-outline" size={16} color="#6366f1" />
              <Text className="text-xs text-gray-500 ml-1">Sessions</Text>
            </View>
            <Text className="text-lg font-bold text-gray-900">{totalSessions}</Text>
          </View>

          {/* Practice Time */}
          <View
            testID="stat-practice-time"
            className="flex-1 bg-gray-50 rounded-lg p-3"
          >
            <View className="flex-row items-center mb-1">
              <Ionicons name="time-outline" size={16} color="#6366f1" />
              <Text className="text-xs text-gray-500 ml-1">Practice Time</Text>
            </View>
            <Text className="text-lg font-bold text-gray-900">
              {formatPracticeTime(totalPracticeMinutes)}
            </Text>
          </View>
        </View>

        {/* Row 2 */}
        <View className="flex-row gap-3">
          {/* Member Since */}
          <View
            testID="stat-member-since"
            className="flex-1 bg-gray-50 rounded-lg p-3"
          >
            <View className="flex-row items-center mb-1">
              <Ionicons name="person-add-outline" size={16} color="#6366f1" />
              <Text className="text-xs text-gray-500 ml-1">Member Since</Text>
            </View>
            <Text className="text-lg font-bold text-gray-900">
              {formatMemberSince(memberSinceDate)}
            </Text>
          </View>

          {/* Most Practiced Surah */}
          <View
            testID="stat-most-practiced"
            className="flex-1 bg-gray-50 rounded-lg p-3"
          >
            <View className="flex-row items-center mb-1">
              <Ionicons name="book-outline" size={16} color="#6366f1" />
              <Text className="text-xs text-gray-500 ml-1">Most Practiced</Text>
            </View>
            <Text
              className="text-lg font-bold text-gray-900"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {mostPracticedSurah ?? 'N/A'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
