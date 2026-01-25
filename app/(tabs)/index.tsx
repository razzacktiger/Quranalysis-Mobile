import React, { useMemo } from 'react';
import { View, Text, ScrollView, RefreshControl, Pressable, ActivityIndicator } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useAuth } from '@/lib/auth';
import { StatsGrid, ActivityHeatmap, PerformanceChart, MistakeChart } from '@/components/analytics';
import { SessionCard } from '@/components/sessions';
import { useSessions } from '@/lib/hooks';

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: sessions, isLoading, refetch, isRefetching } = useSessions();

  // Get last 5 sessions sorted by date (most recent first)
  const recentSessions = useMemo(() => {
    if (!sessions || sessions.length === 0) return [];
    return [...sessions]
      .sort((a, b) => new Date(b.session_date).getTime() - new Date(a.session_date).getTime())
      .slice(0, 5);
  }, [sessions]);

  const hasNoSessions = !isLoading && (!sessions || sessions.length === 0);

  // Get first name for greeting
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  const handleRefresh = () => {
    refetch();
  };

  return (
    <ScrollView
      testID="dashboard-screen"
      className="flex-1 bg-gray-50 dark:bg-gray-900"
      contentContainerClassName="p-4"
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
      }
    >
      {/* Welcome Header */}
      <View className="mb-6">
        <Text testID="dashboard-welcome" className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome, {firstName}!
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 mt-1">
          Here's your practice overview
        </Text>
      </View>

      {/* Stats Grid */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
          Your Stats
        </Text>
        <StatsGrid testID="stats-grid" />
      </View>

      {/* Activity Heatmap */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
          Activity
        </Text>
        <ActivityHeatmap testID="activity-heatmap" />
      </View>

      {/* Performance Chart */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
          Performance Trend
        </Text>
        <PerformanceChart testID="performance-chart" />
      </View>

      {/* Mistake Chart */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
          Mistake Analysis
        </Text>
        <MistakeChart testID="mistake-chart" />
      </View>

      {/* Recent Sessions */}
      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Recent Sessions
          </Text>
          {recentSessions.length > 0 && (
            <Pressable
              testID="view-all-sessions"
              onPress={() => router.push('/(tabs)/sessions')}
              className="px-3 py-1"
            >
              <Text className="text-emerald-600 dark:text-emerald-400 font-medium">View All</Text>
            </Pressable>
          )}
        </View>

        {/* Loading state */}
        {isLoading && (
          <View testID="recent-sessions-loading" className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-100 dark:border-gray-700 items-center">
            <ActivityIndicator size="small" color="#10B981" />
            <Text className="text-gray-400 mt-2">Loading sessions...</Text>
          </View>
        )}

        {/* Empty state for new users */}
        {hasNoSessions && (
          <View testID="recent-sessions-empty" className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 items-center">
            <Text className="text-4xl mb-3">📚</Text>
            <Text className="text-gray-600 dark:text-gray-300 font-medium text-center">
              No sessions yet
            </Text>
            <Text className="text-gray-400 text-sm text-center mt-1">
              Start tracking your Quran practice by adding your first session
            </Text>
            <Pressable
              testID="add-first-session"
              onPress={() => router.push('/(tabs)/add-session' as Href)}
              className="mt-4 bg-emerald-500 px-6 py-2.5 rounded-full"
            >
              <Text className="text-white font-semibold">Add First Session</Text>
            </Pressable>
          </View>
        )}

        {/* Recent sessions list */}
        {!isLoading && recentSessions.length > 0 && (
          <View testID="recent-sessions-list">
            {recentSessions.map((session, index) => (
              <SessionCard
                key={session.id}
                session={session}
                testID={`recent-session-${index}`}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
