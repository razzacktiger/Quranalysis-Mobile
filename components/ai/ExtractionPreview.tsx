import React from 'react';
import { View, Text } from 'react-native';
import type { CombinedExtractionResult } from '@/lib/validation/ai';

export interface ExtractionPreviewProps {
  extraction: CombinedExtractionResult;
  testID?: string;
}

/**
 * Inline preview of what the AI extracted from the message
 * Shows icons and counts for portions, duration, and mistakes
 */
export function ExtractionPreview({
  extraction,
  testID,
}: ExtractionPreviewProps) {
  const hasPortions = extraction.portions.length > 0;
  const hasMistakes = extraction.mistakes.length > 0;
  const hasDuration = extraction.session?.duration_minutes != null;
  const hasPerformance = extraction.session?.performance_score != null;

  // Don't render if nothing was extracted
  if (!hasPortions && !hasMistakes && !hasDuration && !hasPerformance) {
    return null;
  }

  return (
    <View
      testID={testID}
      className="flex-row flex-wrap gap-2 mt-2 ml-1"
    >
      {/* Portions count */}
      {hasPortions && (
        <View
          testID={`${testID}-portions`}
          className="flex-row items-center bg-blue-50 px-2 py-1 rounded-full"
        >
          <Text className="text-sm mr-1">📖</Text>
          <Text className="text-xs text-blue-700 font-medium">
            {extraction.portions.length} portion
            {extraction.portions.length !== 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {/* Duration */}
      {hasDuration && (
        <View
          testID={`${testID}-duration`}
          className="flex-row items-center bg-green-50 px-2 py-1 rounded-full"
        >
          <Text className="text-sm mr-1">⏱</Text>
          <Text className="text-xs text-green-700 font-medium">
            {extraction.session?.duration_minutes} min
          </Text>
        </View>
      )}

      {/* Performance score */}
      {hasPerformance && (
        <View
          testID={`${testID}-performance`}
          className="flex-row items-center bg-purple-50 px-2 py-1 rounded-full"
        >
          <Text className="text-sm mr-1">⭐</Text>
          <Text className="text-xs text-purple-700 font-medium">
            {extraction.session?.performance_score}/10
          </Text>
        </View>
      )}

      {/* Mistakes count */}
      {hasMistakes && (
        <View
          testID={`${testID}-mistakes`}
          className="flex-row items-center bg-red-50 px-2 py-1 rounded-full"
        >
          <Text className="text-sm mr-1">⚠️</Text>
          <Text className="text-xs text-red-700 font-medium">
            {extraction.mistakes.length} mistake
            {extraction.mistakes.length !== 1 ? 's' : ''}
          </Text>
        </View>
      )}
    </View>
  );
}
