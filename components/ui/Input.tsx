import React from 'react';
import { View, Text, TextInput, type TextInputProps } from 'react-native';

export interface InputProps extends Omit<TextInputProps, 'onChange'> {
  label?: string;
  error?: string;
  testID?: string;
  onChangeText?: (text: string) => void;
}

export function Input({
  label,
  error,
  testID,
  className,
  ...props
}: InputProps) {
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</Text>
      )}
      <TextInput
        testID={testID}
        className={`
          border rounded-lg px-4 py-3 text-base text-gray-900 dark:text-gray-100
          ${error ? 'border-red-500 bg-red-50 dark:bg-red-900/30' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'}
          ${className ?? ''}
        `}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && (
        <Text testID={`${testID}-error`} className="text-sm text-red-500 mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}
