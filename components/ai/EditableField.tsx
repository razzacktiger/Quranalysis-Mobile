import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface EditableFieldProps {
  label: string;
  value: string;
  onEdit: (newValue: string) => void;
  /** Options for picker-style selection (optional) */
  options?: Array<{ value: string; label: string }>;
  /** Input type for text editing */
  inputType?: 'text' | 'number';
  /** Placeholder when empty */
  placeholder?: string;
  testID?: string;
}

/**
 * Tap-to-edit field component
 * Shows inline text with edit icon, opens modal for editing
 * Supports both free text and picker-style selection
 */
export function EditableField({
  label,
  value,
  onEdit,
  options,
  inputType = 'text',
  placeholder = 'Tap to edit',
  testID,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleOpen = () => {
    setTempValue(value);
    setIsEditing(true);
  };

  const handleSave = () => {
    onEdit(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const handleSelectOption = (optionValue: string) => {
    onEdit(optionValue);
    setIsEditing(false);
  };

  // Format display value for options (show label instead of value)
  const displayValue = options
    ? options.find((opt) => opt.value === value)?.label ?? value
    : value;

  return (
    <>
      {/* Display mode */}
      <Pressable
        testID={testID}
        onPress={handleOpen}
        className="flex-row items-center justify-between py-3 px-1 border-b border-gray-100"
        accessibilityRole="button"
        accessibilityLabel={`Edit ${label}`}
        accessibilityHint={`Current value: ${displayValue || 'not set'}`}
      >
        <Text className="text-sm text-gray-500 w-24">{label}</Text>
        <View className="flex-1 flex-row items-center justify-end">
          <Text
            className={`text-base mr-2 ${displayValue ? 'text-gray-900' : 'text-gray-400'}`}
            numberOfLines={1}
          >
            {displayValue || placeholder}
          </Text>
          <Ionicons name="pencil" size={16} color="#9CA3AF" />
        </View>
      </Pressable>

      {/* Edit modal */}
      <Modal
        visible={isEditing}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center px-4"
          onPress={handleCancel}
        >
          <Pressable
            className="bg-white rounded-2xl w-full max-w-sm overflow-hidden"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <View className="px-4 py-3 border-b border-gray-100">
              <Text className="text-lg font-semibold text-gray-900">
                Edit {label}
              </Text>
            </View>

            {/* Content */}
            {options ? (
              // Picker-style selection
              <ScrollView className="max-h-64">
                {options.map((option) => (
                  <Pressable
                    key={option.value}
                    testID={`${testID}-option-${option.value}`}
                    onPress={() => handleSelectOption(option.value)}
                    className={`px-4 py-3 border-b border-gray-50 flex-row items-center justify-between ${
                      value === option.value ? 'bg-primary/10' : ''
                    }`}
                  >
                    <Text
                      className={`text-base ${
                        value === option.value
                          ? 'text-primary font-medium'
                          : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </Text>
                    {value === option.value && (
                      <Ionicons name="checkmark" size={20} color="#10b981" />
                    )}
                  </Pressable>
                ))}
              </ScrollView>
            ) : (
              // Text input
              <View className="p-4">
                <TextInput
                  testID={`${testID}-input`}
                  value={tempValue}
                  onChangeText={setTempValue}
                  placeholder={placeholder}
                  placeholderTextColor="#9CA3AF"
                  keyboardType={inputType === 'number' ? 'numeric' : 'default'}
                  autoFocus
                  className="border border-gray-200 rounded-lg px-4 py-3 text-base text-gray-900"
                  style={{
                    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
                  }}
                />
              </View>
            )}

            {/* Actions (only for text input, not picker) */}
            {!options && (
              <View className="flex-row border-t border-gray-100">
                <Pressable
                  testID={`${testID}-cancel`}
                  onPress={handleCancel}
                  className="flex-1 py-3 items-center border-r border-gray-100"
                >
                  <Text className="text-base text-gray-500">Cancel</Text>
                </Pressable>
                <Pressable
                  testID={`${testID}-save`}
                  onPress={handleSave}
                  className="flex-1 py-3 items-center"
                >
                  <Text className="text-base text-primary font-semibold">
                    Save
                  </Text>
                </Pressable>
              </View>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
