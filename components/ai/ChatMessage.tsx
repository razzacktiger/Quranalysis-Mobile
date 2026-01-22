import React from 'react';
import { View, Text } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import type { Message } from '@/lib/hooks/useAIChat';
import { ExtractionPreview } from './ExtractionPreview';

/**
 * Safely format a timestamp, returning fallback on error
 */
function safeFormatTimeAgo(timestamp: Date): string {
  try {
    return formatDistanceToNow(timestamp, { addSuffix: true });
  } catch {
    return 'recently';
  }
}

export interface ChatMessageProps {
  message: Message;
  showExtraction?: boolean;
  testID?: string;
}

/**
 * Chat message bubble component
 * Renders user messages right-aligned (blue) and assistant messages left-aligned (gray)
 */
export function ChatMessage({
  message,
  showExtraction = true,
  testID,
}: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <View
      testID={testID}
      className={`mb-3 ${isUser ? 'items-end' : 'items-start'}`}
    >
      {/* Message bubble */}
      <View
        testID={`${testID}-bubble`}
        className={`max-w-[85%] px-4 py-3 ${
          isUser
            ? 'bg-blue-500 rounded-2xl rounded-br-sm'
            : 'bg-gray-100 rounded-2xl rounded-bl-sm'
        }`}
      >
        <Text
          testID={`${testID}-content`}
          accessibilityRole="text"
          accessibilityLabel={isUser ? 'Your message' : 'Assistant message'}
          className={`text-base ${isUser ? 'text-white' : 'text-gray-900'}`}
        >
          {message.content}
        </Text>
      </View>

      {/* Extraction preview for assistant messages */}
      {!isUser && showExtraction && message.extraction && (
        <ExtractionPreview
          extraction={message.extraction}
          testID={`${testID}-extraction`}
        />
      )}

      {/* Timestamp */}
      <Text
        testID={`${testID}-timestamp`}
        accessibilityLabel={`Sent ${safeFormatTimeAgo(message.timestamp)}`}
        className={`text-xs text-gray-400 mt-1 ${isUser ? 'mr-1' : 'ml-1'}`}
      >
        {safeFormatTimeAgo(message.timestamp)}
      </Text>
    </View>
  );
}
