import React from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useAuth } from '@/lib/auth';
import { StatsGrid, ActivityHeatmap, PerformanceChart } from '@/components/analytics';
import { useSessions } from '@/lib/hooks';

export default function DashboardScreen() {
  const { user } = useAuth();
  const { refetch, isRefetching } = useSessions();

  // Get first name for greeting
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  const handleRefresh = () => {
    refetch();
  };

  return (
    <ScrollView
      testID="dashboard-screen"
      className="flex-1 bg-gray-50"
      contentContainerClassName="p-4"
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
      }
    >
      {/* Welcome Header */}
      <View className="mb-6">
        <Text testID="dashboard-welcome" className="text-2xl font-bold text-gray-900">
          Welcome, {firstName}!
        </Text>
        <Text className="text-gray-500 mt-1">
          Here's your practice overview
        </Text>
      </View>

      {/* Stats Grid */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-800 mb-3">
          Your Stats
        </Text>
        <StatsGrid testID="stats-grid" />
      </View>

      {/* Activity Heatmap */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-800 mb-3">
          Activity
        </Text>
        <ActivityHeatmap testID="activity-heatmap" />
      </View>

      {/* Performance Chart */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-800 mb-3">
          Performance Trend
        </Text>
        <PerformanceChart testID="performance-chart" />
      </View>

      {/* Mistake Chart Placeholder */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-800 mb-3">
          Mistake Analysis
        </Text>
        <View
          testID="mistake-chart-placeholder"
          className="bg-white rounded-xl p-6 border border-gray-100 items-center justify-center"
        >
          <Text className="text-gray-400 text-sm">
            📊 Mistake Analysis coming soon...
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
