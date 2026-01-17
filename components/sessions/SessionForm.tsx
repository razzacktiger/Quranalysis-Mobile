import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { v4 as uuidv4 } from 'uuid';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/Input';
import { Select, type SelectOption } from '@/components/ui/Select';
import { Slider } from '@/components/ui/Slider';
import { DatePicker } from '@/components/ui/DatePicker';
import { PortionForm } from '@/components/forms/PortionForm';
import { MistakeForm } from '@/components/forms/MistakeForm';
import { useCreateSession } from '@/lib/hooks/useSessions';
import { sessionFormSchema, type SessionFormSchemaType } from '@/lib/validation/session';
import {
  SESSION_TYPES,
  type SessionFormData,
  type PortionFormData,
  type MistakeFormData,
} from '@/types/session';

const sessionTypeOptions: SelectOption[] = SESSION_TYPES.map((type) => ({
  label: type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' '),
  value: type,
}));

function createEmptyPortion(): PortionFormData {
  return {
    tempId: uuidv4(),
    surah_name: '',
    repetition_count: 1,
    recency_category: 'new',
  };
}

function createEmptyMistake(portionTempId: string): MistakeFormData {
  return {
    tempId: uuidv4(),
    portionTempId,
    error_category: 'tajweed',
    severity_level: 3,
    ayah_number: 1,
  };
}

// Helper to extract error messages from react-hook-form field errors
function extractErrors(
  fieldErrors: Record<string, unknown> | undefined
): Record<string, string> | undefined {
  if (!fieldErrors) return undefined;
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(fieldErrors)) {
    if (value && typeof value === 'object' && 'message' in value) {
      result[key] = String(value.message ?? '');
    }
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

export interface SessionFormProps {
  testID?: string;
}

export function SessionForm({ testID }: SessionFormProps) {
  const router = useRouter();
  const createSessionMutation = useCreateSession();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SessionFormSchemaType>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: {
      session_date: new Date().toISOString().split('T')[0],
      session_type: 'memorization',
      duration_minutes: 30,
      performance_score: 7,
      portions: [createEmptyPortion()],
      mistakes: [],
    },
  });

  const portions = watch('portions');
  const mistakes = watch('mistakes');

  const handleAddPortion = () => {
    setValue('portions', [...portions, createEmptyPortion()]);
  };

  const handleRemovePortion = (index: number) => {
    const portionToRemove = portions[index];
    // Also remove any mistakes linked to this portion
    const updatedMistakes = mistakes.filter(
      (m) => m.portionTempId !== portionToRemove.tempId
    );
    setValue('mistakes', updatedMistakes);
    setValue(
      'portions',
      portions.filter((_, i) => i !== index)
    );
  };

  const handlePortionChange = (index: number, data: PortionFormData) => {
    const updated = [...portions];
    updated[index] = data;
    setValue('portions', updated);
  };

  const handleAddMistake = () => {
    if (portions.length === 0) {
      Alert.alert('No Portions', 'Please add a portion before adding mistakes.');
      return;
    }
    // Default to the first portion
    setValue('mistakes', [...mistakes, createEmptyMistake(portions[0].tempId)]);
  };

  const handleRemoveMistake = (index: number) => {
    setValue(
      'mistakes',
      mistakes.filter((_, i) => i !== index)
    );
  };

  const handleMistakeChange = (index: number, data: MistakeFormData) => {
    const updated = [...mistakes];
    updated[index] = data;
    setValue('mistakes', updated);
  };

  const onSubmit = async (data: SessionFormSchemaType) => {
    try {
      // Cast to SessionFormData - the types are compatible after Zod validation
      await createSessionMutation.mutateAsync(data as SessionFormData);
      Alert.alert('Success', 'Session created successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to session detail or list
            router.replace('/(tabs)');
          },
        },
      ]);
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to create session'
      );
    }
  };

  return (
    <ScrollView
      testID={testID}
      className="flex-1 bg-white"
      contentContainerClassName="p-4 pb-20"
      keyboardShouldPersistTaps="handled"
    >
      {/* Session Metadata Section */}
      <Text className="text-lg font-bold text-gray-800 mb-4">Session Details</Text>

      {/* Date Picker */}
      <Controller
        control={control}
        name="session_date"
        render={({ field: { value, onChange } }) => (
          <DatePicker
            testID="date-picker"
            label="Session Date"
            value={new Date(value)}
            onChange={(date) => onChange(date.toISOString().split('T')[0])}
            maximumDate={new Date()}
            error={errors.session_date?.message}
          />
        )}
      />

      {/* Session Type */}
      <Controller
        control={control}
        name="session_type"
        render={({ field: { value, onChange } }) => (
          <Select
            testID="session-type-picker"
            label="Session Type"
            options={sessionTypeOptions}
            value={value}
            onValueChange={onChange}
            error={errors.session_type?.message}
          />
        )}
      />

      {/* Duration */}
      <Controller
        control={control}
        name="duration_minutes"
        render={({ field: { value, onChange } }) => (
          <Input
            testID="duration-input"
            label="Duration (minutes)"
            placeholder="30"
            keyboardType="number-pad"
            value={value?.toString() ?? ''}
            onChangeText={(text) => onChange(text ? parseInt(text, 10) : 0)}
            error={errors.duration_minutes?.message}
          />
        )}
      />

      {/* Performance Score */}
      <Controller
        control={control}
        name="performance_score"
        render={({ field: { value, onChange } }) => (
          <Slider
            testID="performance-slider"
            label="Performance Score"
            value={value}
            minimumValue={0}
            maximumValue={10}
            step={1}
            onValueChange={onChange}
            valueFormatter={(v) => `${v}/10`}
          />
        )}
      />

      {/* Session Goal (optional) */}
      <Controller
        control={control}
        name="session_goal"
        render={({ field: { value, onChange } }) => (
          <Input
            testID="session-goal-input"
            label="Session Goal (optional)"
            placeholder="e.g., Memorize Surah Al-Mulk"
            value={value ?? ''}
            onChangeText={(text) => onChange(text || undefined)}
            error={errors.session_goal?.message}
          />
        )}
      />

      {/* Additional Notes (optional) */}
      <Controller
        control={control}
        name="additional_notes"
        render={({ field: { value, onChange } }) => (
          <Input
            testID="notes-input"
            label="Notes (optional)"
            placeholder="Any additional notes..."
            multiline
            numberOfLines={3}
            value={value ?? ''}
            onChangeText={(text) => onChange(text || undefined)}
            error={errors.additional_notes?.message}
          />
        )}
      />

      {/* Portions Section */}
      <View className="mt-6 mb-4">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-bold text-gray-800">Portions</Text>
          <Pressable
            testID="add-portion-btn"
            onPress={handleAddPortion}
            className="bg-primary px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">+ Add Portion</Text>
          </Pressable>
        </View>

        {errors.portions?.message && (
          <Text className="text-sm text-red-500 mb-2">{errors.portions.message}</Text>
        )}

        {portions.map((portion, index) => (
          <PortionForm
            key={portion.tempId}
            testID={`portion-${index}`}
            index={index}
            data={portion}
            onChange={(data) => handlePortionChange(index, data)}
            onRemove={() => handleRemovePortion(index)}
            errors={extractErrors(errors.portions?.[index] as Record<string, unknown> | undefined)}
          />
        ))}
      </View>

      {/* Mistakes Section */}
      <View className="mt-4 mb-4">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-bold text-gray-800">Mistakes (optional)</Text>
          <Pressable
            testID="add-mistake-btn"
            onPress={handleAddMistake}
            className="bg-red-500 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">+ Add Mistake</Text>
          </Pressable>
        </View>

        {mistakes.map((mistake, index) => (
          <MistakeForm
            key={mistake.tempId}
            testID={`mistake-${index}`}
            index={index}
            data={mistake as MistakeFormData}
            portions={portions as PortionFormData[]}
            onChange={(data) => handleMistakeChange(index, data)}
            onRemove={() => handleRemoveMistake(index)}
            errors={extractErrors(errors.mistakes?.[index] as Record<string, unknown> | undefined)}
          />
        ))}

        {mistakes.length === 0 && (
          <Text className="text-gray-400 text-center py-4">
            No mistakes logged yet
          </Text>
        )}
      </View>

      {/* Submit Button */}
      <Pressable
        testID="create-session-btn"
        onPress={handleSubmit(onSubmit)}
        disabled={createSessionMutation.isPending}
        className={`
          py-4 rounded-xl items-center mt-6
          ${createSessionMutation.isPending ? 'bg-gray-400' : 'bg-primary'}
        `}
      >
        {createSessionMutation.isPending ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bold text-lg">Create Session</Text>
        )}
      </Pressable>

      {createSessionMutation.isError && (
        <Text testID="error-message" className="text-red-500 text-center mt-4">
          {createSessionMutation.error?.message ?? 'Failed to create session'}
        </Text>
      )}
    </ScrollView>
  );
}
