import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { AuthUser } from '@/types';

interface ProfileHeaderProps {
  user: AuthUser;
  testID?: string;
}

/**
 * ProfileHeader - Displays user avatar, name, and email
 * Shows a placeholder icon when avatar_url is not available
 */
export function ProfileHeader({ user, testID = 'profile-header' }: ProfileHeaderProps) {
  const hasAvatar = !!user.avatar_url;

  return (
    <View
      testID={testID}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 items-center"
    >
      {/* Avatar */}
      {hasAvatar ? (
        <Image
          testID="user-avatar"
          source={{ uri: user.avatar_url! }}
          className="w-24 h-24 rounded-full mb-4"
          accessibilityLabel="User avatar"
        />
      ) : (
        <View
          testID="user-avatar"
          className="w-24 h-24 rounded-full mb-4 bg-gray-200 dark:bg-gray-700 items-center justify-center"
        >
          <Ionicons name="person" size={48} color="#9ca3af" />
        </View>
      )}

      {/* Name */}
      <Text
        testID="user-name"
        className="text-xl font-bold text-gray-900 dark:text-white mb-1"
      >
        {user.name ?? 'User'}
      </Text>

      {/* Email */}
      <Text
        testID="user-email"
        className="text-sm text-gray-500 dark:text-gray-400"
      >
        {user.email}
      </Text>
    </View>
  );
}
