import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Input } from '@/components/ui/Input';
import { Select, type SelectOption } from '@/components/ui/Select';
import { Slider } from '@/components/ui/Slider';
import {
  ERROR_CATEGORIES,
  type ErrorCategory,
  type ErrorSubcategory,
  type MistakeFormData,
  type PortionFormData,
  type SeverityLevel,
} from '@/types/session';

// Map error categories to their subcategories
const SUBCATEGORY_MAP: Record<ErrorCategory, ErrorSubcategory[]> = {
  pronunciation: ['makhraj', 'sifat'],
  tajweed: ['ghunna', 'qalqalah', 'madd', 'idgham', 'ikhfa', 'iqlab'],
  memorization: [
    'word_order',
    'verse_skip',
    'word_substitution',
    'mutashabih',
    'forgotten_word',
    'forgotten_verse_start',
    'forgotten_verse_end',
    'forgotten_verse_middle',
    'forgotten_verse_all',
    'forgotten_verse_middle_end',
    'forgotten_verse_start_middle',
    'verse_slipping',
  ],
  translation: [],
  fluency: ['hesitation', 'repetition', 'rhythm'],
  waqf: ['wrong_stop', 'missed_stop', 'disencouraged_stop', 'disencouraged_continue'],
  other: [],
};

// Format subcategory for display
function formatSubcategory(sub: ErrorSubcategory): string {
  return sub
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export interface MistakeFormProps {
  index: number;
  data: MistakeFormData;
  portions: PortionFormData[];
  onChange: (data: MistakeFormData) => void;
  onRemove: () => void;
  errors?: Record<string, string>;
  testID?: string;
}

const categoryOptions: SelectOption[] = ERROR_CATEGORIES.map((cat) => ({
  label: cat.charAt(0).toUpperCase() + cat.slice(1),
  value: cat,
}));

const severityLabels: Record<SeverityLevel, string> = {
  1: 'Minor',
  2: 'Low',
  3: 'Medium',
  4: 'High',
  5: 'Critical',
};

export function MistakeForm({
  index,
  data,
  portions,
  onChange,
  onRemove,
  errors,
  testID,
}: MistakeFormProps) {
  // Build portion options from current portions
  const portionOptions: SelectOption[] = useMemo(() => {
    return portions.map((p, idx) => ({
      label: p.surah_name || `Portion ${idx + 1}`,
      value: p.tempId,
    }));
  }, [portions]);

  // Build subcategory options based on selected category
  const subcategoryOptions: SelectOption[] = useMemo(() => {
    if (!data.error_category) return [];
    const subcats = SUBCATEGORY_MAP[data.error_category] ?? [];
    return subcats.map((sub) => ({
      label: formatSubcategory(sub),
      value: sub,
    }));
  }, [data.error_category]);

  const handlePortionChange = (portionTempId: string) => {
    onChange({ ...data, portionTempId });
  };

  const handleCategoryChange = (value: string) => {
    // Reset subcategory when category changes
    onChange({
      ...data,
      error_category: value as ErrorCategory,
      error_subcategory: undefined,
    });
  };

  const handleSubcategoryChange = (value: string) => {
    onChange({
      ...data,
      error_subcategory: value as ErrorSubcategory,
    });
  };

  const handleSeverityChange = (value: number) => {
    onChange({
      ...data,
      severity_level: value as SeverityLevel,
    });
  };

  const handleAyahChange = (text: string) => {
    const ayah_number = text ? parseInt(text, 10) : 1;
    onChange({ ...data, ayah_number });
  };

  const handleNotesChange = (text: string) => {
    onChange({
      ...data,
      additional_notes: text || undefined,
    });
  };

  return (
    <View
      testID={testID}
      className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-4 border border-red-200 dark:border-red-800"
    >
      {/* Header with remove button */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-base font-semibold text-gray-800 dark:text-gray-100">
          Mistake {index + 1}
        </Text>
        <Pressable
          testID={`${testID}-remove`}
          onPress={onRemove}
          className="bg-red-100 rounded-full w-7 h-7 items-center justify-center"
        >
          <Text className="text-red-600 font-bold text-lg">×</Text>
        </Pressable>
      </View>

      {/* Portion selector */}
      <Select
        testID={`${testID}-portion`}
        label="Portion"
        placeholder="Select portion..."
        options={portionOptions}
        value={data.portionTempId}
        onValueChange={handlePortionChange}
        error={errors?.portionTempId}
      />

      {/* Category and Subcategory */}
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Select
            testID={`${testID}-category`}
            label="Category"
            placeholder="Select..."
            options={categoryOptions}
            value={data.error_category}
            onValueChange={handleCategoryChange}
            error={errors?.error_category}
          />
        </View>
        <View className="flex-1">
          <Select
            testID={`${testID}-subcategory`}
            label="Subcategory"
            placeholder={subcategoryOptions.length ? 'Select...' : 'N/A'}
            options={subcategoryOptions}
            value={data.error_subcategory}
            onValueChange={handleSubcategoryChange}
            error={errors?.error_subcategory}
          />
        </View>
      </View>

      {/* Severity slider */}
      <Slider
        testID={`${testID}-severity`}
        label="Severity"
        value={data.severity_level}
        minimumValue={1}
        maximumValue={5}
        step={1}
        onValueChange={handleSeverityChange}
        valueFormatter={(v) => severityLabels[v as SeverityLevel] ?? v.toString()}
      />

      {/* Ayah number */}
      <Input
        testID={`${testID}-ayah`}
        label="Ayah Number"
        placeholder="1"
        keyboardType="number-pad"
        value={data.ayah_number?.toString() ?? ''}
        onChangeText={handleAyahChange}
        error={errors?.ayah_number}
      />

      {/* Optional notes */}
      <Input
        testID={`${testID}-notes`}
        label="Notes (optional)"
        placeholder="Additional details..."
        multiline
        numberOfLines={2}
        value={data.additional_notes ?? ''}
        onChangeText={handleNotesChange}
        error={errors?.additional_notes}
      />
    </View>
  );
}
