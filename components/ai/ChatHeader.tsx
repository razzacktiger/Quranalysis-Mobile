import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface ChatHeaderProps {
  onClose: () => void;
  onConfirm?: () => void;
  isReadyToSave?: boolean;
  testID?: string;
}

/**
 * Chat modal header with close button, title, and confirm action
 * Features a subtle emerald accent line for visual distinction
 */
export function ChatHeader({
  onClose,
  onConfirm,
  isReadyToSave = false,
  testID,
}: ChatHeaderProps) {
  return (
    <View testID={testID} className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      {/* Subtle accent line at top */}
      <View className="h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

      <View className="flex-row items-center justify-between px-4 py-3">
        {/* Close button */}
        <Pressable
          testID={`${testID}-close`}
          onPress={onClose}
          className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-gray-800"
          accessibilityLabel="Close chat"
          accessibilityRole="button"
        >
          <Ionicons name="close" size={24} color="#6B7280" />
        </Pressable>

        {/* Title */}
        <View className="flex-1 items-center">
          <Text
            testID={`${testID}-title`}
            className="text-lg font-semibold text-gray-900 dark:text-gray-100"
          >
            AI Assistant
          </Text>
          <Text className="text-xs text-gray-400">
            Log your Quran practice
          </Text>
        </View>

        {/* Confirm button - only visible when ready to save and handler provided */}
        {isReadyToSave && onConfirm ? (
          <Pressable
            testID={`${testID}-confirm`}
            onPress={onConfirm}
            className="px-4 py-2 bg-primary rounded-full active:bg-primary/80"
            accessibilityLabel="Review and save session"
            accessibilityRole="button"
          >
            <Text className="text-white font-semibold text-sm">Review</Text>
          </Pressable>
        ) : (
          <View className="w-10" />
        )}
      </View>
    </View>
  );
}
