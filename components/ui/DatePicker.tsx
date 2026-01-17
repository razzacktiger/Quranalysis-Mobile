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
  // For datetime mode, track which step we're on
  const [pickerStep, setPickerStep] = useState<'date' | 'time'>('date');

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
      if (event.type === 'set' && selectedDate) {
        if (mode === 'datetime' && pickerStep === 'date') {
          // Date selected, now show time picker
          setTempDate(selectedDate);
          setPickerStep('time');
          setShow(true);
        } else if (mode === 'datetime' && pickerStep === 'time') {
          // Time selected, combine with date and finish
          const finalDate = new Date(tempDate);
          finalDate.setHours(selectedDate.getHours());
          finalDate.setMinutes(selectedDate.getMinutes());
          onChange?.(finalDate);
          setPickerStep('date');
        } else {
          // Simple date or time mode
          onChange?.(selectedDate);
        }
      } else {
        // Cancelled - reset step
        setPickerStep('date');
      }
    } else {
      // iOS - update temp date while picker is open
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const handleDone = () => {
    if (mode === 'datetime' && pickerStep === 'date') {
      // Move to time picker
      setPickerStep('time');
    } else {
      // Finish selection
      setShow(false);
      onChange?.(tempDate);
      setPickerStep('date');
    }
  };

  const handleCancel = () => {
    setShow(false);
    setTempDate(value);
    setPickerStep('date');
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

  const getCurrentPickerMode = (): 'date' | 'time' => {
    if (mode === 'datetime') {
      return pickerStep;
    }
    return mode === 'time' ? 'time' : 'date';
  };

  const getPickerTitle = (): string => {
    if (mode === 'datetime') {
      return pickerStep === 'date' ? 'Select Date' : 'Select Time';
    }
    return mode === 'time' ? 'Select Time' : 'Select Date';
  };

  const getDoneButtonText = (): string => {
    if (mode === 'datetime' && pickerStep === 'date') {
      return 'Next';
    }
    return 'Done';
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
          setPickerStep('date');
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
          <View className="flex-row justify-between items-center px-4 py-2 border-b border-gray-200">
            <Pressable onPress={handleCancel}>
              <Text className="text-gray-500 font-medium">Cancel</Text>
            </Pressable>
            <Text className="text-gray-700 font-medium">{getPickerTitle()}</Text>
            <Pressable onPress={handleDone}>
              <Text className="text-primary font-medium">{getDoneButtonText()}</Text>
            </Pressable>
          </View>
          <DateTimePicker
            testID={`${testID}-picker`}
            value={tempDate}
            mode={getCurrentPickerMode()}
            display="spinner"
            onChange={handleChange}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
            textColor="#111827"
            themeVariant="light"
          />
        </View>
      )}

      {show && Platform.OS === 'android' && (
        <DateTimePicker
          testID={`${testID}-picker`}
          value={pickerStep === 'time' ? tempDate : value}
          mode={getCurrentPickerMode()}
          display="default"
          onChange={handleChange}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
        />
      )}
    </View>
  );
}
