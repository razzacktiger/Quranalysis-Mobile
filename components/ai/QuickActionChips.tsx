import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';

export interface QuickAction {
  id: string;
  emoji: string;
  label: string;
  prompt: string;
}

export interface QuickActionChipsProps {
  onSelectAction: (prompt: string) => void;
  disabled?: boolean;
  testID?: string;
}

/**
 * Default quick actions for common session logging tasks
 */
export const DEFAULT_QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'log-session',
    emoji: '📖',
    label: 'Log session',
    prompt: 'I want to log a practice session',
  },
  {
    id: 'add-mistake',
    emoji: '⚠️',
    label: 'Add mistake',
    prompt: 'I want to record a mistake I made',
  },
  {
    id: 'review-today',
    emoji: '📝',
    label: 'Review today',
    prompt: 'What did I practice today?',
  },
  {
    id: 'memorization',
    emoji: '🧠',
    label: 'Memorization',
    prompt: 'I worked on memorizing new ayahs',
  },
];

/**
 * Horizontal scrolling chips for quick action selection
 * Provides contextual shortcuts for common session logging patterns
 */
export function QuickActionChips({
  onSelectAction,
  disabled = false,
  testID,
}: QuickActionChipsProps) {
  return (
    <View testID={testID} className="py-2 bg-gray-50/50">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        className="flex-row"
      >
        {DEFAULT_QUICK_ACTIONS.map((action) => (
          <Pressable
            key={action.id}
            testID={`${testID}-${action.id}`}
            onPress={() => !disabled && onSelectAction(action.prompt)}
            disabled={disabled}
            className={`
              flex-row items-center px-4 py-2 rounded-full border
              ${disabled
                ? 'bg-gray-100 border-gray-200 opacity-50'
                : 'bg-white border-gray-200 active:bg-gray-50 active:border-gray-300'
              }
            `}
            accessibilityLabel={action.label}
            accessibilityRole="button"
            accessibilityState={{ disabled }}
          >
            <Text className="text-base mr-2">{action.emoji}</Text>
            <Text
              className={`text-sm font-medium ${
                disabled ? 'text-gray-400' : 'text-gray-700'
              }`}
            >
              {action.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
