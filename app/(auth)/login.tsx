import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useAuth } from '@/lib/auth';

export default function LoginScreen() {
  const { signIn, isLoading, error } = useAuth();

  return (
    <View
      testID="login-screen"
      className="flex-1 items-center justify-center bg-white px-6"
    >
      {/* App Branding */}
      <View className="mb-12 items-center">
        <Text
          testID="app-title"
          className="text-4xl font-bold text-primary mb-2"
        >
          Quranalysis
        </Text>
        <Text className="text-gray-500 text-center">
          Track your Quran learning journey
        </Text>
      </View>

      {/* Error Message */}
      {error && (
        <View
          testID="error-message"
          className="mb-6 p-4 bg-red-100 rounded-lg w-full"
        >
          <Text className="text-red-600 text-center">{error}</Text>
        </View>
      )}

      {/* Sign In Button */}
      <Pressable
        testID="google-sign-in-button"
        onPress={signIn}
        disabled={isLoading}
        className="w-full bg-white border border-gray-300 rounded-lg py-4 px-6 flex-row items-center justify-center"
        style={({ pressed }) => ({
          opacity: pressed || isLoading ? 0.7 : 1,
        })}
      >
        {isLoading ? (
          <ActivityIndicator testID="loading-indicator" color="#4285F4" />
        ) : (
          <>
            <Text className="text-gray-700 font-semibold text-base">
              Sign in with Google
            </Text>
          </>
        )}
      </Pressable>

      {/* Footer */}
      <View className="mt-8">
        <Text className="text-gray-400 text-sm text-center">
          By signing in, you agree to our Terms of Service
        </Text>
      </View>
    </View>
  );
}
