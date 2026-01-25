import React, { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList } from 'react-native';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  label?: string;
  error?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  testID?: string;
}

export function Select({
  label,
  error,
  placeholder = 'Select...',
  options,
  value,
  onValueChange,
  testID,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onValueChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</Text>
      )}
      <Pressable
        testID={testID}
        onPress={() => setIsOpen(true)}
        className={`
          border rounded-lg px-4 py-3 flex-row justify-between items-center
          ${error ? 'border-red-500 bg-red-50 dark:bg-red-900/30' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'}
        `}
      >
        <Text
          className={selectedOption ? 'text-base text-gray-900 dark:text-gray-100' : 'text-base text-gray-400'}
        >
          {selectedOption?.label ?? placeholder}
        </Text>
        <Text className="text-gray-400">▼</Text>
      </Pressable>
      {error && (
        <Text testID={`${testID}-error`} className="text-sm text-red-500 mt-1">
          {error}
        </Text>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-end"
          onPress={() => setIsOpen(false)}
        >
          <View className="bg-white dark:bg-gray-800 rounded-t-2xl max-h-[50%]">
            <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">{label ?? 'Select'}</Text>
              <Pressable onPress={() => setIsOpen(false)}>
                <Text className="text-primary text-base font-medium">Done</Text>
              </Pressable>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  testID={`${testID}-option-${item.value}`}
                  onPress={() => handleSelect(item.value)}
                  className={`
                    px-4 py-3 border-b border-gray-100 dark:border-gray-700
                    ${item.value === value ? 'bg-primary/10' : ''}
                  `}
                >
                  <Text
                    className={`
                      text-base
                      ${item.value === value ? 'text-primary font-medium' : 'text-gray-900 dark:text-gray-100'}
                    `}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
