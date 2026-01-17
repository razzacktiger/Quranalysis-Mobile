import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useAuth } from '@/lib/auth';

export default function ProfileScreen() {
  const { user, signOut, isLoading } = useAuth();

  return (
    <View testID="profile-screen" className="flex-1 bg-white p-6">
      {/* User Info */}
      <View className="items-center mb-8 pt-8">
        <View className="w-20 h-20 rounded-full bg-gray-200 items-center justify-center mb-4">
          <Text className="text-2xl text-gray-500">
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </Text>
        </View>
        <Text className="text-xl font-semibold">{user?.name ?? 'User'}</Text>
        <Text className="text-gray-500">{user?.email}</Text>
      </View>

      {/* Sign Out Button */}
      <Pressable
        testID="sign-out-button"
        onPress={signOut}
        disabled={isLoading}
        className="w-full bg-red-500 rounded-lg py-4 px-6 items-center"
        style={({ pressed }) => ({
          opacity: pressed || isLoading ? 0.7 : 1,
        })}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold text-base">Sign Out</Text>
        )}
      </Pressable>
    </View>
  );
}
