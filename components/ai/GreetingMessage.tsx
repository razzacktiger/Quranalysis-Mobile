import React from 'react';
import { View, Text } from 'react-native';

export interface GreetingMessageProps {
  testID?: string;
}

/**
 * Initial greeting message shown when chat is empty
 * Provides usage examples and sets the tone for interaction
 */
export function GreetingMessage({ testID }: GreetingMessageProps) {
  return (
    <View testID={testID} className="mb-4">
      {/* Assistant avatar and greeting */}
      <View className="items-start mb-3">
        <View className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[90%]">
          <Text className="text-base text-gray-900 leading-6">
            Assalamu Alaikum! I can help you log your Quran practice sessions and track mistakes.
          </Text>
        </View>
      </View>

      {/* Usage examples card */}
      <View className="bg-primary/5 rounded-xl p-4 border border-primary/10">
        <Text className="text-sm font-medium text-gray-700 mb-3">
          Try saying or typing:
        </Text>

        <View className="gap-2">
          <ExampleItem text="I practiced Al-Fatiha for 20 minutes" />
          <ExampleItem text="I made a tajweed mistake on ayah 5" />
          <ExampleItem text="Reviewed Surah Yaseen, made 2 hesitation errors" />
        </View>

        <Text className="text-sm text-gray-500 mt-4">
          What would you like to log?
        </Text>
      </View>
    </View>
  );
}

/**
 * Individual example item with bullet styling
 */
function ExampleItem({ text }: { text: string }) {
  return (
    <View className="flex-row items-start">
      <Text className="text-primary mr-2">•</Text>
      <Text className="text-sm text-gray-600 flex-1 italic">"{text}"</Text>
    </View>
  );
}
