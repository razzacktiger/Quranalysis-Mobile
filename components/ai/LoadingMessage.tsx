import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export interface LoadingMessageProps {
  testID?: string;
}

/**
 * Loading indicator shown while waiting for AI response
 * Styled as an assistant message bubble with animated spinner
 */
export function LoadingMessage({ testID }: LoadingMessageProps) {
  return (
    <View
      testID={testID}
      className="mb-3 items-start"
      accessibilityLabel="AI is thinking"
    >
      <View
        className="flex-row items-center bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm"
        accessibilityRole="progressbar"
      >
        <ActivityIndicator
          testID={`${testID}-spinner`}
          size="small"
          color="#6B7280"
          accessibilityLabel="Loading"
        />
        <Text className="text-gray-500 dark:text-gray-400 ml-2 text-base">Thinking...</Text>
      </View>
    </View>
  );
}
