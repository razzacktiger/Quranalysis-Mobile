import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Pressable,
  Platform,
  type NativeSyntheticEvent,
  type TextInputContentSizeChangeEventData,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  testID?: string;
  /** Optional voice input button component - passed as child */
  voiceButton?: React.ReactNode;
}

/**
 * Chat input with multiline text field, send button, and optional voice input
 * Automatically adjusts height based on content (up to 4 lines)
 */
export function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Describe your session...',
  testID,
  voiceButton,
}: ChatInputProps) {
  const [text, setText] = useState('');
  const [inputHeight, setInputHeight] = useState(44);
  const inputRef = useRef<TextInput>(null);

  const handleSend = () => {
    const trimmedText = text.trim();
    if (trimmedText && !disabled) {
      onSend(trimmedText);
      setText('');
      setInputHeight(44);
    }
  };

  const handleContentSizeChange = (
    event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
  ) => {
    // Clamp height between 44 (single line) and 120 (about 4 lines)
    const newHeight = Math.min(
      Math.max(44, event.nativeEvent.contentSize.height),
      120
    );
    setInputHeight(newHeight);
  };

  const canSend = text.trim().length > 0 && !disabled;

  return (
    <View
      testID={testID}
      className="flex-row items-end px-4 py-3 bg-white border-t border-gray-100"
    >
      {/* Voice input button placeholder */}
      {voiceButton && (
        <View className="mr-2 mb-1">
          {voiceButton}
        </View>
      )}

      {/* Text input container */}
      <View
        className={`
          flex-1 flex-row items-end rounded-2xl border px-4 py-2
          ${disabled ? 'bg-gray-50 border-gray-200' : 'bg-gray-50 border-gray-200'}
        `}
        style={{ minHeight: 44 }}
      >
        <TextInput
          ref={inputRef}
          testID={`${testID}-input`}
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          editable={!disabled}
          multiline
          maxLength={1000}
          onContentSizeChange={handleContentSizeChange}
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
          returnKeyType="default"
          className={`
            flex-1 text-base leading-6
            ${disabled ? 'text-gray-400' : 'text-gray-900'}
          `}
          style={{
            height: inputHeight,
            maxHeight: 120,
            paddingTop: Platform.OS === 'ios' ? 8 : 4,
            paddingBottom: Platform.OS === 'ios' ? 8 : 4,
          }}
          accessibilityLabel="Message input"
          accessibilityHint="Type your message and press send"
        />
      </View>

      {/* Send button */}
      <Pressable
        testID={`${testID}-send`}
        onPress={handleSend}
        disabled={!canSend}
        className={`
          ml-2 w-11 h-11 rounded-full items-center justify-center
          ${canSend ? 'bg-primary active:bg-primary/80' : 'bg-gray-200'}
        `}
        accessibilityLabel="Send message"
        accessibilityRole="button"
        accessibilityState={{ disabled: !canSend }}
      >
        <Ionicons
          name="send"
          size={20}
          color={canSend ? '#FFFFFF' : '#9CA3AF'}
          style={{ marginLeft: 2 }}
        />
      </Pressable>
    </View>
  );
}
