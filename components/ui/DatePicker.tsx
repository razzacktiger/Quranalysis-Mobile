import React, { useState } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';

export interface DatePickerProps {
  label?: string;
  error?: string;
  value: Date;
  onChange?: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
  testID?: string;
  maximumDate?: Date;
  minimumDate?: Date;
}

export function DatePicker({
  label,
  error,
  value,
  onChange,
  mode = 'date',
  testID,
  maximumDate,
  minimumDate,
}: DatePickerProps) {
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState(value);

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
      if (event.type === 'set' && selectedDate) {
        onChange?.(selectedDate);
      }
    } else {
      // iOS - update temp date while picker is open
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const handleDone = () => {
    setShow(false);
    onChange?.(tempDate);
  };

  const handleCancel = () => {
    setShow(false);
    setTempDate(value);
  };

  const formatDate = (date: Date) => {
    if (mode === 'time') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (mode === 'datetime') {
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString();
  };

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-1">{label}</Text>
      )}
      <Pressable
        testID={testID}
        onPress={() => {
          setTempDate(value);
          setShow(true);
        }}
        className={`
          border rounded-lg px-4 py-3 flex-row justify-between items-center
          ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}
        `}
      >
        <Text className="text-base text-gray-900">{formatDate(value)}</Text>
        <Text className="text-gray-400">📅</Text>
      </Pressable>
      {error && (
        <Text testID={`${testID}-error`} className="text-sm text-red-500 mt-1">
          {error}
        </Text>
      )}

      {show && Platform.OS === 'ios' && (
        <View className="bg-white border border-gray-200 rounded-lg mt-2">
          <View className="flex-row justify-between px-4 py-2 border-b border-gray-200">
            <Pressable onPress={handleCancel}>
              <Text className="text-gray-500 font-medium">Cancel</Text>
            </Pressable>
            <Pressable onPress={handleDone}>
              <Text className="text-primary font-medium">Done</Text>
            </Pressable>
          </View>
          <DateTimePicker
            testID={`${testID}-picker`}
            value={tempDate}
            mode={mode === 'datetime' ? 'date' : mode}
            display="spinner"
            onChange={handleChange}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
          />
        </View>
      )}

      {show && Platform.OS === 'android' && (
        <DateTimePicker
          testID={`${testID}-picker`}
          value={value}
          mode={mode === 'datetime' ? 'date' : mode}
          display="default"
          onChange={handleChange}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
        />
      )}
    </View>
  );
}
