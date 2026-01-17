import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Input } from '@/components/ui/Input';
import { Select, type SelectOption } from '@/components/ui/Select';
import { SurahPicker } from './SurahPicker';
import {
  SURAHS,
  getSurahByNumber,
  getJuzForAyah,
  calculatePagesRead,
} from '@/constants/quran-data';
import { RECENCY_CATEGORIES, type PortionFormData } from '@/types/session';

export interface PortionFormProps {
  index: number;
  data: PortionFormData;
  onChange: (data: PortionFormData) => void;
  onRemove: () => void;
  errors?: Record<string, string>;
  testID?: string;
}

const recencyOptions: SelectOption[] = RECENCY_CATEGORIES.map((cat) => ({
  label: cat.charAt(0).toUpperCase() + cat.slice(1),
  value: cat,
}));

export function PortionForm({
  index,
  data,
  onChange,
  onRemove,
  errors,
  testID,
}: PortionFormProps) {
  // Find selected surah for validation and calculations
  const selectedSurah = useMemo(() => {
    if (!data.surah_name) return null;
    return SURAHS.find((s) => s.transliteration === data.surah_name) ?? null;
  }, [data.surah_name]);

  // Auto-calculate juz and pages when ayahs change
  const calculatedValues = useMemo(() => {
    if (!selectedSurah || !data.ayah_start || !data.ayah_end) {
      return { juz_number: undefined, pages_read: undefined };
    }

    const juz_number = getJuzForAyah(selectedSurah.number, data.ayah_start);
    const pages_read = calculatePagesRead(
      selectedSurah.number,
      data.ayah_start,
      data.ayah_end
    );

    return { juz_number, pages_read };
  }, [selectedSurah, data.ayah_start, data.ayah_end]);

  const handleSurahChange = (surahName: string) => {
    // Reset ayahs when surah changes
    onChange({
      ...data,
      surah_name: surahName,
      ayah_start: undefined,
      ayah_end: undefined,
      juz_number: undefined,
      pages_read: undefined,
    });
  };

  const handleAyahStartChange = (text: string) => {
    let ayah_start = text ? parseInt(text, 10) : undefined;

    // Validate against surah bounds
    if (selectedSurah && ayah_start !== undefined) {
      if (ayah_start < 1) ayah_start = 1;
      if (ayah_start > selectedSurah.ayah_count) ayah_start = selectedSurah.ayah_count;
    }

    const newData = { ...data, ayah_start };

    // Update calculated values
    if (selectedSurah && ayah_start && data.ayah_end) {
      newData.juz_number = getJuzForAyah(selectedSurah.number, ayah_start);
      newData.pages_read = calculatePagesRead(
        selectedSurah.number,
        ayah_start,
        data.ayah_end
      );
    }

    onChange(newData);
  };

  const handleAyahEndChange = (text: string) => {
    let ayah_end = text ? parseInt(text, 10) : undefined;

    // Validate against surah bounds
    if (selectedSurah && ayah_end !== undefined) {
      if (ayah_end < 1) ayah_end = 1;
      if (ayah_end > selectedSurah.ayah_count) ayah_end = selectedSurah.ayah_count;
    }

    const newData = { ...data, ayah_end };

    // Update calculated values
    if (selectedSurah && data.ayah_start && ayah_end) {
      newData.juz_number = getJuzForAyah(selectedSurah.number, data.ayah_start);
      newData.pages_read = calculatePagesRead(
        selectedSurah.number,
        data.ayah_start,
        ayah_end
      );
    }

    onChange(newData);
  };

  const handleRepetitionChange = (text: string) => {
    const repetition_count = text ? parseInt(text, 10) : 1;
    onChange({ ...data, repetition_count });
  };

  const handleRecencyChange = (value: string) => {
    onChange({
      ...data,
      recency_category: value as PortionFormData['recency_category'],
    });
  };

  return (
    <View
      testID={testID}
      className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200"
    >
      {/* Header with remove button */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-base font-semibold text-gray-800">
          Portion {index + 1}
        </Text>
        <Pressable
          testID={`${testID}-remove`}
          onPress={onRemove}
          className="bg-red-100 rounded-full w-7 h-7 items-center justify-center"
        >
          <Text className="text-red-600 font-bold text-lg">×</Text>
        </Pressable>
      </View>

      {/* Surah Picker */}
      <SurahPicker
        testID={`${testID}-surah`}
        label="Surah"
        value={data.surah_name}
        onValueChange={handleSurahChange}
        error={errors?.surah_name}
      />

      {/* Ayah range inputs */}
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Input
            testID={`${testID}-ayah-start`}
            label="Ayah Start"
            placeholder="1"
            keyboardType="number-pad"
            value={data.ayah_start?.toString() ?? ''}
            onChangeText={handleAyahStartChange}
            error={errors?.ayah_start}
          />
        </View>
        <View className="flex-1">
          <Input
            testID={`${testID}-ayah-end`}
            label="Ayah End"
            placeholder={selectedSurah?.ayah_count.toString() ?? '—'}
            keyboardType="number-pad"
            value={data.ayah_end?.toString() ?? ''}
            onChangeText={handleAyahEndChange}
            error={errors?.ayah_end}
          />
        </View>
      </View>

      {/* Ayah count hint */}
      {selectedSurah && (
        <Text className="text-xs text-gray-500 -mt-2 mb-3">
          {selectedSurah.transliteration} has {selectedSurah.ayah_count} ayahs
        </Text>
      )}

      {/* Repetition count and Recency category */}
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Input
            testID={`${testID}-repetition`}
            label="Repetitions"
            placeholder="1"
            keyboardType="number-pad"
            value={data.repetition_count?.toString() ?? '1'}
            onChangeText={handleRepetitionChange}
            error={errors?.repetition_count}
          />
        </View>
        <View className="flex-1">
          <Select
            testID={`${testID}-recency`}
            label="Recency"
            options={recencyOptions}
            value={data.recency_category}
            onValueChange={handleRecencyChange}
            error={errors?.recency_category}
          />
        </View>
      </View>

      {/* Calculated values display */}
      {(calculatedValues.juz_number || calculatedValues.pages_read) && (
        <View className="flex-row justify-between bg-primary/5 rounded-lg px-3 py-2 mt-2">
          <View className="flex-row items-center">
            <Text className="text-sm text-gray-600">Juz: </Text>
            <Text testID={`${testID}-juz`} className="text-sm font-semibold text-primary">
              {calculatedValues.juz_number ?? '—'}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-sm text-gray-600">Pages: </Text>
            <Text testID={`${testID}-pages`} className="text-sm font-semibold text-primary">
              {calculatedValues.pages_read ?? '—'}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
