import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface FloatingChatButtonProps {
  onPress: () => void;
  testID?: string;
}

/**
 * Floating action button to open the AI chat modal
 * Positioned above the tab bar with bounce animation on press
 */
export function FloatingChatButton({
  onPress,
  testID,
}: FloatingChatButtonProps) {
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSequence(
      withSpring(0.9, { damping: 10, stiffness: 400 }),
      withSpring(1, { damping: 10, stiffness: 400 })
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Position above tab bar (tab bar is ~50px + bottom inset)
  const bottomOffset = insets.bottom + 70;

  return (
    <AnimatedPressable
      testID={testID}
      onPress={onPress}
      onPressIn={handlePressIn}
      style={[
        styles.button,
        animatedStyle,
        { bottom: bottomOffset },
      ]}
      accessibilityLabel="Open AI chat assistant"
      accessibilityRole="button"
    >
      <Ionicons name="chatbubble-ellipses" size={28} color="#FFFFFF" />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 8,
  },
});
