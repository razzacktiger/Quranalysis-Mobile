import React, { useEffect, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import { useVoiceInput } from '@/lib/hooks/useVoiceInput';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface VoiceInputButtonProps {
  /** Called with final transcript when speech recognition completes */
  onTranscript: (text: string) => void;
  /** Disable the button (e.g., during loading) */
  disabled?: boolean;
  /** Test ID for E2E testing */
  testID?: string;
}

/**
 * Voice input button with microphone icon and pulse animation
 *
 * Features:
 * - Hidden when speech recognition not supported (Expo Go)
 * - Pulse animation while listening
 * - Red background when active
 * - Error state with alert icon
 * - Real-time transcript preview (optional)
 */
export function VoiceInputButton({
  onTranscript,
  disabled = false,
  testID = 'voice-input-button',
}: VoiceInputButtonProps) {
  const {
    isListening,
    isSupported,
    transcript,
    error,
    startListening,
    stopListening,
    clearTranscript,
  } = useVoiceInput();

  // Animation scale value
  const scale = useSharedValue(1);

  // Start/stop pulse animation based on listening state
  useEffect(() => {
    if (isListening) {
      // Start pulse animation
      scale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 500 }),
          withTiming(1.0, { duration: 500 })
        ),
        -1, // Infinite repeat
        false
      );
    } else {
      // Stop animation and reset scale
      cancelAnimation(scale);
      scale.value = withTiming(1.0, { duration: 200 });
    }
  }, [isListening, scale]);

  // When recognition ends with a transcript, pass it to parent
  useEffect(() => {
    if (!isListening && transcript.trim()) {
      onTranscript(transcript);
      clearTranscript();
    }
  }, [isListening, transcript, onTranscript, clearTranscript]);

  // Handle button press - toggle listening
  const handlePress = useCallback(() => {
    if (disabled) return;

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [disabled, isListening, startListening, stopListening]);

  // Animated style for pulse effect
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Hide button if speech recognition not supported
  if (!isSupported) {
    return null;
  }

  // Determine icon and colors based on state
  const hasError = !!error;
  const isActive = isListening && !hasError;

  const iconName = hasError ? 'alert-circle' : isActive ? 'mic' : 'mic-outline';
  const iconColor = isActive ? '#FFFFFF' : hasError ? '#ef4444' : '#6B7280';
  const backgroundColor = isActive ? '#ef4444' : '#f3f4f6';
  const opacity = disabled ? 0.5 : 1;

  return (
    <View>
      {/* Transcript preview while listening */}
      {isListening && transcript.trim() && (
        <View
          testID={`${testID}-preview`}
          className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-gray-800 px-3 py-2 rounded-lg max-w-48"
          style={{ transform: [{ translateX: -96 }] }}
        >
          <Text
            className="text-white text-xs"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {transcript}
          </Text>
        </View>
      )}

      {/* Listening indicator */}
      {isListening && (
        <View
          testID="voice-listening-indicator"
          className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
        />
      )}

      {/* Main button */}
      <AnimatedPressable
        testID={testID}
        onPress={handlePress}
        disabled={disabled}
        style={[
          {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor,
            alignItems: 'center',
            justifyContent: 'center',
            opacity,
          },
          animatedStyle,
        ]}
        accessibilityLabel={isListening ? 'Stop voice input' : 'Start voice input'}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
      >
        <Ionicons name={iconName} size={22} color={iconColor} />
      </AnimatedPressable>

      {/* Error message */}
      {hasError && (
        <View
          testID={`${testID}-error`}
          className="absolute top-12 left-1/2 -translate-x-1/2 bg-red-50 border border-red-200 px-2 py-1 rounded"
          style={{ transform: [{ translateX: -60 }], minWidth: 120 }}
        >
          <Text className="text-red-600 text-xs text-center" numberOfLines={2}>
            {error}
          </Text>
        </View>
      )}
    </View>
  );
}
