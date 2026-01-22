import React, { useState } from 'react';
import { View, Text, Pressable, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ExtractedPortion, ExtractedMistake, ExtractedSession } from '@/lib/validation/ai';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface ExtractionSummaryProps {
  session: Partial<ExtractedSession>;
  portions: ExtractedPortion[];
  mistakes: ExtractedMistake[];
  testID?: string;
}

/**
 * Collapsible summary showing running tally of extracted data
 * Displays count badges when collapsed, detailed list when expanded
 */
export function ExtractionSummary({
  session,
  portions,
  mistakes,
  testID,
}: ExtractionSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const portionCount = portions.filter((p) => p.surah_name).length;
  const mistakeCount = mistakes.length;
  const hasSession = session.session_type || session.duration_minutes;
  const totalItems = portionCount + mistakeCount + (hasSession ? 1 : 0);

  // Don't render if nothing has been extracted
  if (totalItems === 0) {
    return null;
  }

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <View testID={testID} className="mx-4 mb-2">
      <Pressable
        testID={`${testID}-toggle`}
        onPress={toggleExpanded}
        className="bg-primary/5 rounded-xl border border-primary/10 overflow-hidden"
        accessibilityLabel={`Extraction summary: ${totalItems} items. ${isExpanded ? 'Tap to collapse' : 'Tap to expand'}`}
        accessibilityRole="button"
      >
        {/* Header row - always visible */}
        <View className="flex-row items-center justify-between px-4 py-3">
          <View className="flex-row items-center flex-1">
            <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center mr-3">
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-900">
                Extracted Data
              </Text>
              <Text className="text-xs text-gray-500">
                {portionCount > 0 && `${portionCount} portion${portionCount !== 1 ? 's' : ''}`}
                {portionCount > 0 && mistakeCount > 0 && ' • '}
                {mistakeCount > 0 && `${mistakeCount} mistake${mistakeCount !== 1 ? 's' : ''}`}
                {(portionCount > 0 || mistakeCount > 0) && hasSession && ' • '}
                {hasSession && 'Session info'}
              </Text>
            </View>
          </View>

          {/* Expand/collapse chevron */}
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#6B7280"
          />
        </View>

        {/* Expanded details */}
        {isExpanded && (
          <View
            testID={`${testID}-details`}
            className="px-4 pb-3 border-t border-primary/10"
          >
            {/* Session info */}
            {hasSession && (
              <View className="mt-3">
                <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Session
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {session.session_type && (
                    <View className="bg-white px-3 py-1.5 rounded-lg border border-gray-100">
                      <Text className="text-xs text-gray-600">
                        {formatSessionType(session.session_type)}
                      </Text>
                    </View>
                  )}
                  {session.duration_minutes && (
                    <View className="bg-white px-3 py-1.5 rounded-lg border border-gray-100">
                      <Text className="text-xs text-gray-600">
                        {session.duration_minutes} min
                      </Text>
                    </View>
                  )}
                  {session.performance_score != null && (
                    <View className="bg-white px-3 py-1.5 rounded-lg border border-gray-100">
                      <Text className="text-xs text-gray-600">
                        Score: {session.performance_score}/10
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Portions */}
            {portionCount > 0 && (
              <View className="mt-3">
                <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Portions
                </Text>
                <View className="gap-1.5">
                  {portions
                    .filter((p) => p.surah_name)
                    .map((portion, index) => (
                      <View
                        key={index}
                        className="flex-row items-center bg-white px-3 py-2 rounded-lg border border-gray-100"
                      >
                        <View className="w-6 h-6 rounded-full bg-blue-50 items-center justify-center mr-2">
                          <Text className="text-xs">📖</Text>
                        </View>
                        <Text className="text-sm text-gray-700 flex-1">
                          {portion.surah_name}
                          {portion.ayah_start && portion.ayah_end && (
                            <Text className="text-gray-400">
                              {' '}({portion.ayah_start}-{portion.ayah_end})
                            </Text>
                          )}
                        </Text>
                        {portion.recency_category && (
                          <View className="bg-primary/10 px-2 py-0.5 rounded-full">
                            <Text className="text-xs text-primary capitalize">
                              {portion.recency_category}
                            </Text>
                          </View>
                        )}
                      </View>
                    ))}
                </View>
              </View>
            )}

            {/* Mistakes */}
            {mistakeCount > 0 && (
              <View className="mt-3">
                <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Mistakes
                </Text>
                <View className="gap-1.5">
                  {mistakes.map((mistake, index) => (
                    <View
                      key={index}
                      className="flex-row items-center bg-white px-3 py-2 rounded-lg border border-gray-100"
                    >
                      <View className="w-6 h-6 rounded-full bg-red-50 items-center justify-center mr-2">
                        <Text className="text-xs">⚠️</Text>
                      </View>
                      <Text className="text-sm text-gray-700 flex-1">
                        {mistake.portion_surah} - {formatCategory(mistake.error_category)}
                      </Text>
                      <View
                        className={`px-2 py-0.5 rounded-full ${getSeverityColor(mistake.severity_level)}`}
                      >
                        <Text className="text-xs text-white font-medium">
                          {mistake.severity_level}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </Pressable>
    </View>
  );
}

/**
 * Format session type for display
 */
function formatSessionType(type: string): string {
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Format error category for display
 */
function formatCategory(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

/**
 * Get background color class based on severity level
 */
function getSeverityColor(level: number): string {
  switch (level) {
    case 1:
      return 'bg-green-500';
    case 2:
      return 'bg-yellow-500';
    case 3:
      return 'bg-orange-500';
    case 4:
      return 'bg-red-500';
    case 5:
      return 'bg-red-700';
    default:
      return 'bg-gray-500';
  }
}
