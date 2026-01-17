import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';

export interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmStyle?: 'default' | 'destructive';
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  testID?: string;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmStyle = 'default',
  onConfirm,
  onCancel,
  isLoading = false,
  testID = 'confirm-dialog',
}: ConfirmDialogProps) {
  const confirmButtonClass =
    confirmStyle === 'destructive'
      ? 'bg-red-500 active:bg-red-600'
      : 'bg-emerald-500 active:bg-emerald-600';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View
        testID={testID}
        className="flex-1 bg-black/50 items-center justify-center p-4"
      >
        <View
          testID={`${testID}-content`}
          className="bg-white rounded-2xl w-full max-w-sm overflow-hidden"
        >
          {/* Header */}
          <View className="p-6 pb-4">
            <Text
              testID={`${testID}-title`}
              className="text-xl font-bold text-gray-900 text-center"
            >
              {title}
            </Text>
            <Text
              testID={`${testID}-message`}
              className="text-gray-600 text-center mt-2"
            >
              {message}
            </Text>
          </View>

          {/* Actions */}
          <View className="flex-row border-t border-gray-200">
            <Pressable
              testID={`${testID}-cancel`}
              onPress={onCancel}
              disabled={isLoading}
              className="flex-1 py-4 border-r border-gray-200 active:bg-gray-100"
            >
              <Text className="text-center text-gray-600 font-semibold">
                {cancelText}
              </Text>
            </Pressable>
            <Pressable
              testID={`${testID}-confirm`}
              onPress={onConfirm}
              disabled={isLoading}
              className={`flex-1 py-4 ${confirmButtonClass}`}
            >
              <Text className="text-center text-white font-semibold">
                {isLoading ? 'Loading...' : confirmText}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
