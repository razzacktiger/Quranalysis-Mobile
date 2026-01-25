import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useAuth } from '@/lib/auth';
import { useSessions } from '@/lib/hooks';
import { ProfileHeader, AccountStats } from '@/components/profile';

export default function ProfileScreen() {
  const { user, signOut, isLoading: authLoading } = useAuth();
  const { data: sessions } = useSessions();

  // Calculate account stats from sessions
  const accountStats = useMemo(() => {
    if (!sessions || sessions.length === 0) {
      return {
        totalSessions: 0,
        totalPracticeMinutes: 0,
        memberSinceDate: null,
        mostPracticedSurah: null,
      };
    }

    // Total sessions
    const totalSessions = sessions.length;

    // Total practice time (sum of duration_minutes)
    const totalPracticeMinutes = sessions.reduce(
      (sum, session) => sum + (session.duration_minutes ?? 0),
      0
    );

    // Member since (oldest session date)
    const sortedByDate = [...sessions].sort(
      (a, b) => new Date(a.session_date).getTime() - new Date(b.session_date).getTime()
    );
    const memberSinceDate = sortedByDate[0]?.session_date ?? null;

    // Most practiced surah (weighted by repetition count)
    const surahCounts: Record<string, number> = {};
    for (const session of sessions) {
      for (const portion of session.session_portions ?? []) {
        const surah = portion.surah_name;
        const reps = portion.repetition_count ?? 1;
        surahCounts[surah] = (surahCounts[surah] ?? 0) + reps;
      }
    }
    const mostPracticedSurah =
      Object.entries(surahCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    return {
      totalSessions,
      totalPracticeMinutes,
      memberSinceDate,
      mostPracticedSurah,
    };
  }, [sessions]);

  // App version from Constants
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  // External link handlers with error handling
  const handleHelpPress = async () => {
    const url = 'https://github.com/razzacktiger/Quranalysis-Mobile/issues';
    try {
      await Linking.openURL(url);
    } catch {
      // Silently fail - URL will open in browser if available
    }
  };

  const handlePrivacyPress = async () => {
    const url = 'https://github.com/razzacktiger/Quranalysis-Mobile/blob/main/PRIVACY.md';
    try {
      await Linking.openURL(url);
    } catch {
      // Silently fail - URL will open in browser if available
    }
  };

  if (!user) {
    return (
      <View testID="profile-screen" className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <ScrollView
      testID="profile-screen"
      className="flex-1 bg-gray-50"
      contentContainerClassName="p-4"
    >
      {/* Profile Header */}
      <View className="mb-4">
        <ProfileHeader user={user} />
      </View>

      {/* Account Stats */}
      <View className="mb-4">
        <AccountStats {...accountStats} />
      </View>

      {/* About Section */}
      <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
        <Text className="text-lg font-semibold text-gray-900 mb-4">About</Text>

        {/* Help & Support */}
        <Pressable
          testID="help-link"
          onPress={handleHelpPress}
          className="flex-row items-center py-3 border-b border-gray-100"
        >
          <View className="w-8 h-8 rounded-lg bg-gray-100 items-center justify-center mr-3">
            <Ionicons name="help-circle-outline" size={20} color="#6366f1" />
          </View>
          <Text className="flex-1 text-gray-700">Help & Support</Text>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </Pressable>

        {/* Privacy Policy */}
        <Pressable
          testID="privacy-link"
          onPress={handlePrivacyPress}
          className="flex-row items-center py-3 border-b border-gray-100"
        >
          <View className="w-8 h-8 rounded-lg bg-gray-100 items-center justify-center mr-3">
            <Ionicons name="shield-checkmark-outline" size={20} color="#6366f1" />
          </View>
          <Text className="flex-1 text-gray-700">Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </Pressable>

        {/* Version */}
        <View testID="app-version" className="flex-row items-center py-3">
          <View className="w-8 h-8 rounded-lg bg-gray-100 items-center justify-center mr-3">
            <Ionicons name="information-circle-outline" size={20} color="#6366f1" />
          </View>
          <Text className="flex-1 text-gray-700">Version</Text>
          <Text className="text-gray-400">{appVersion}</Text>
        </View>
      </View>

      {/* Sign Out Button */}
      <Pressable
        testID="sign-out-button"
        onPress={signOut}
        disabled={authLoading}
        className="bg-red-500 rounded-xl py-4 px-6 items-center mb-8"
        style={({ pressed }) => ({
          opacity: pressed || authLoading ? 0.7 : 1,
        })}
      >
        {authLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View className="flex-row items-center">
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text className="text-white font-semibold text-base ml-2">Sign Out</Text>
          </View>
        )}
      </Pressable>
    </ScrollView>
  );
}
