import React from 'react';
import { View, Text } from 'react-native';
import RNSlider from '@react-native-community/slider';

export interface SliderProps {
  label?: string;
  error?: string;
  value: number;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  onValueChange?: (value: number) => void;
  testID?: string;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
}

export function Slider({
  label,
  error,
  value,
  minimumValue = 0,
  maximumValue = 10,
  step = 1,
  onValueChange,
  testID,
  showValue = true,
  valueFormatter,
}: SliderProps) {
  const displayValue = valueFormatter ? valueFormatter(value) : value.toString();

  return (
    <View className="mb-4">
      {label && (
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm font-medium text-gray-700">{label}</Text>
          {showValue && (
            <Text testID={`${testID}-value`} className="text-sm font-semibold text-primary">
              {displayValue}
            </Text>
          )}
        </View>
      )}
      <View className="flex-row items-center">
        <Text className="text-xs text-gray-400 w-6">{minimumValue}</Text>
        <View className="flex-1 mx-2">
          <RNSlider
            testID={testID}
            value={value}
            minimumValue={minimumValue}
            maximumValue={maximumValue}
            step={step}
            onValueChange={onValueChange}
            minimumTrackTintColor="#6366F1"
            maximumTrackTintColor="#E5E7EB"
            thumbTintColor="#6366F1"
          />
        </View>
        <Text className="text-xs text-gray-400 w-6 text-right">{maximumValue}</Text>
      </View>
      {error && (
        <Text testID={`${testID}-error`} className="text-sm text-red-500 mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}
