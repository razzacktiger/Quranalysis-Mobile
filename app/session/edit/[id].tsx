import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { v4 as uuidv4 } from 'uuid';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/Input';
import { Select, type SelectOption } from '@/components/ui/Select';
import { Slider } from '@/components/ui/Slider';
import { DatePicker } from '@/components/ui/DatePicker';
import { PortionForm } from '@/components/forms/PortionForm';
import { MistakeForm } from '@/components/forms/MistakeForm';
import { useSession, useUpdateSession } from '@/lib/hooks/useSessions';
import { sessionFormSchema, type SessionFormSchemaType } from '@/lib/validation/session';
import {
  SESSION_TYPES,
  type SessionFormData,
  type PortionFormData,
  type MistakeFormData,
} from '@/types/session';
import type { SessionWithRelations } from '@/lib/api/sessions';

const sessionTypeOptions: SelectOption[] = SESSION_TYPES.map((type) => ({
  label: type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' '),
  value: type,
}));

// Convert database session to form data format
function sessionToFormData(session: SessionWithRelations): SessionFormSchemaType {
  // Create a map of database portion IDs to temp IDs for linking mistakes
  const portionIdMap = new Map<string, string>();

  const portions: PortionFormData[] = session.session_portions.map((portion) => {
    const tempId = uuidv4();
    portionIdMap.set(portion.id, tempId);
    return {
      tempId,
      databaseId: portion.id,
      surah_name: portion.surah_name,
      ayah_start: portion.ayah_start,
      ayah_end: portion.ayah_end,
      repetition_count: portion.repetition_count,
      recency_category: portion.recency_category,
      juz_number: portion.juz_number,
      pages_read: portion.pages_read,
    };
  });

  const mistakes: MistakeFormData[] = session.mistakes.map((mistake) => ({
    tempId: uuidv4(),
    databaseId: mistake.id,
    portionTempId: portionIdMap.get(mistake.session_portion_id) || portions[0]?.tempId || '',
    error_category: mistake.error_category,
    error_subcategory: mistake.error_subcategory ?? undefined,
    severity_level: mistake.severity_level,
    ayah_number: mistake.ayah_number,
    additional_notes: mistake.additional_notes ?? undefined,
  }));

  return {
    session_date: session.session_date,
    session_type: session.session_type,
    duration_minutes: session.duration_minutes,
    performance_score: session.performance_score,
    session_goal: session.session_goal ?? undefined,
    additional_notes: session.additional_notes ?? undefined,
    portions,
    mistakes,
  };
}

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

// Loading skeleton
function LoadingSkeleton() {
  return (
    <View testID="edit-session-loading" className="flex-1 bg-white p-4">
      <View className="bg-gray-200 h-12 rounded-lg mb-4 animate-pulse" />
      <View className="bg-gray-200 h-12 rounded-lg mb-4 animate-pulse" />
      <View className="bg-gray-200 h-12 rounded-lg mb-4 animate-pulse" />
      <View className="bg-gray-200 h-24 rounded-lg mb-4 animate-pulse" />
    </View>
  );
}

// Error state
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View testID="edit-session-error" className="flex-1 bg-white items-center justify-center p-4">
      <Text className="text-lg font-semibold text-gray-900 mb-2">Error Loading Session</Text>
      <Text className="text-gray-500 text-center mb-4">{message}</Text>
      <Pressable
        testID="retry-button"
        onPress={onRetry}
        className="bg-emerald-500 px-6 py-3 rounded-lg"
      >
        <Text className="text-white font-medium">Try Again</Text>
      </Pressable>
    </View>
  );
}

export default function EditSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: session, isLoading, isError, error, refetch } = useSession(id);
  const updateSessionMutation = useUpdateSession();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<SessionFormSchemaType>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: {
      session_date: new Date().toISOString(),
      session_type: 'memorization',
      duration_minutes: 30,
      performance_score: 7,
      portions: [createEmptyPortion()],
      mistakes: [],
    },
  });

  // Initialize form with session data when loaded
  useEffect(() => {
    if (session && !isFormInitialized) {
      const formData = sessionToFormData(session);
      reset(formData);
      setIsFormInitialized(true);
    }
  }, [session, isFormInitialized, reset]);

  // Track unsaved changes
  useEffect(() => {
    if (isFormInitialized) {
      setHasUnsavedChanges(isDirty);
    }
  }, [isDirty, isFormInitialized]);

  // Handle back button with unsaved changes warning
  useEffect(() => {
    const handleBackPress = () => {
      if (hasUnsavedChanges) {
        Alert.alert(
          'Unsaved Changes',
          'You have unsaved changes. Are you sure you want to leave?',
          [
            { text: 'Stay', style: 'cancel' },
            { text: 'Leave', style: 'destructive', onPress: () => router.back() },
          ]
        );
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => subscription.remove();
  }, [hasUnsavedChanges, router]);

  const portions = watch('portions');
  const mistakes = watch('mistakes');

  const handleAddPortion = () => {
    setValue('portions', [...portions, createEmptyPortion()], { shouldDirty: true });
  };

  const handleRemovePortion = (index: number) => {
    const portionToRemove = portions[index];
    // Also remove any mistakes linked to this portion
    const updatedMistakes = mistakes.filter(
      (m) => m.portionTempId !== portionToRemove.tempId
    );
    setValue('mistakes', updatedMistakes, { shouldDirty: true });
    setValue(
      'portions',
      portions.filter((_, i) => i !== index),
      { shouldDirty: true }
    );
  };

  const handlePortionChange = (index: number, data: PortionFormData) => {
    const updated = [...portions];
    updated[index] = data;
    setValue('portions', updated, { shouldDirty: true });
  };

  const handleAddMistake = () => {
    if (portions.length === 0) {
      Alert.alert('No Portions', 'Please add a portion before adding mistakes.');
      return;
    }
    setValue('mistakes', [...mistakes, createEmptyMistake(portions[0].tempId)], { shouldDirty: true });
  };

  const handleRemoveMistake = (index: number) => {
    setValue(
      'mistakes',
      mistakes.filter((_, i) => i !== index),
      { shouldDirty: true }
    );
  };

  const handleMistakeChange = (index: number, data: MistakeFormData) => {
    const updated = [...mistakes];
    updated[index] = data;
    setValue('mistakes', updated, { shouldDirty: true });
  };

  const onSubmit = async (data: SessionFormSchemaType) => {
    try {
      await updateSessionMutation.mutateAsync({
        sessionId: id!,
        data: data as SessionFormData,
      });
      setHasUnsavedChanges(false);
      Alert.alert('Success', 'Session updated successfully!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (err) {
      Alert.alert(
        'Error',
        err instanceof Error ? err.message : 'Failed to update session'
      );
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to cancel?',
        [
          { text: 'Stay', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  if (isLoading || !isFormInitialized) {
    return (
      <>
        <Stack.Screen options={{ title: 'Edit Session' }} />
        <LoadingSkeleton />
      </>
    );
  }

  if (isError || !session) {
    return (
      <>
        <Stack.Screen options={{ title: 'Error' }} />
        <ErrorState
          message={error?.message || 'Unable to load session'}
          onRetry={() => refetch()}
        />
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Edit Session',
          headerLeft: () => (
            <Pressable testID="cancel-button" onPress={handleCancel}>
              <Text className="text-emerald-500 font-medium">Cancel</Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView
        testID="edit-session-screen"
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
              label="Session Date & Time"
              mode="datetime"
              value={new Date(value)}
              onChange={(date) => onChange(date.toISOString())}
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
          testID="save-session-btn"
          onPress={handleSubmit(onSubmit)}
          disabled={updateSessionMutation.isPending}
          className={`
            py-4 rounded-xl items-center mt-6
            ${updateSessionMutation.isPending ? 'bg-gray-400' : 'bg-primary'}
          `}
        >
          {updateSessionMutation.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Save Changes</Text>
          )}
        </Pressable>

        {updateSessionMutation.isError && (
          <Text testID="error-message" className="text-red-500 text-center mt-4">
            {updateSessionMutation.error?.message ?? 'Failed to update session'}
          </Text>
        )}
      </ScrollView>
    </>
  );
}
