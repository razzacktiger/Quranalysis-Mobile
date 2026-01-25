import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, Modal, Alert, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  ERROR_CATEGORIES,
  type ErrorCategory,
  type ErrorSubcategory,
  type SeverityLevel,
} from '@/types/session';

// Map categories to their valid subcategories
const SUBCATEGORIES_BY_CATEGORY: Record<ErrorCategory, ErrorSubcategory[]> = {
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
  fluency: ['hesitation', 'repetition', 'rhythm'],
  waqf: ['wrong_stop', 'missed_stop', 'disencouraged_stop', 'disencouraged_continue'],
  translation: [], // No subcategories - use additional_notes
  other: [], // No subcategories - use additional_notes
};

export interface MistakeCardData {
  tempId: string;
  portionTempId: string;
  portion_surah: string;
  error_category: ErrorCategory;
  error_subcategory: ErrorSubcategory | null;
  severity_level: SeverityLevel;
  ayah_number: number | null;
  additional_notes: string | null;
}

export interface MistakeCardProps {
  mistake: MistakeCardData;
  onEdit: (mistake: MistakeCardData) => void;
  onRemove: (tempId: string) => void;
  /** Available surahs from portions - allows linking mistake to correct surah */
  availableSurahs?: string[];
  testID?: string;
}

// Severity level colors
const SEVERITY_COLORS: Record<SeverityLevel, { bg: string; text: string }> = {
  1: { bg: 'bg-green-100', text: 'text-green-700' },
  2: { bg: 'bg-lime-100', text: 'text-lime-700' },
  3: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  4: { bg: 'bg-orange-100', text: 'text-orange-700' },
  5: { bg: 'bg-red-100', text: 'text-red-700' },
};

// Format category for display
function formatCategory(category: string): string {
  return category
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Card displaying a mistake with edit/remove actions
 * Shows surah, category, subcategory, ayah, and severity
 */
export function MistakeCard({
  mistake,
  onEdit,
  onRemove,
  availableSurahs = [],
  testID,
}: MistakeCardProps) {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedMistake, setEditedMistake] = useState(mistake);

  const handleRemove = () => {
    Alert.alert('Remove Mistake', 'Remove this mistake?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => onRemove(mistake.tempId),
      },
    ]);
  };

  const handleEditSave = () => {
    onEdit(editedMistake);
    setEditModalVisible(false);
  };

  const handleEditCancel = () => {
    setEditedMistake(mistake);
    setEditModalVisible(false);
  };

  const severityStyle = SEVERITY_COLORS[mistake.severity_level];

  return (
    <>
      <View
        testID={testID}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-3"
      >
        {/* Header row: Surah and category */}
        <View className="flex-row items-start justify-between mb-2">
          <View className="flex-1 mr-2">
            <Text
              testID={`${testID}-surah`}
              className="text-base font-semibold text-gray-900 dark:text-gray-100"
              numberOfLines={1}
            >
              {mistake.portion_surah} - {formatCategory(mistake.error_category)}
            </Text>
            {mistake.error_subcategory && (
              <Text className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {formatCategory(mistake.error_subcategory)}
              </Text>
            )}
          </View>

          {/* Action buttons */}
          <View className="flex-row gap-2">
            <Pressable
              testID={`${testID}-edit`}
              onPress={() => setEditModalVisible(true)}
              className="w-8 h-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600"
              accessibilityLabel="Edit mistake"
              accessibilityRole="button"
            >
              <Ionicons name="pencil" size={16} color="#6B7280" />
            </Pressable>
            <Pressable
              testID={`${testID}-remove`}
              onPress={handleRemove}
              className="w-8 h-8 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/30 active:bg-red-100 dark:active:bg-red-900/50"
              accessibilityLabel="Remove mistake"
              accessibilityRole="button"
            >
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
            </Pressable>
          </View>
        </View>

        {/* Details row: Ayah number and severity badge */}
        <View className="flex-row items-center gap-3 mt-1">
          {mistake.ayah_number && (
            <Text className="text-sm text-gray-500 dark:text-gray-400">Ayah {mistake.ayah_number}</Text>
          )}
          <View className={`px-2 py-1 rounded-full ${severityStyle.bg}`}>
            <Text className={`text-xs font-medium ${severityStyle.text}`}>
              Severity: {mistake.severity_level}
            </Text>
          </View>
        </View>

        {/* Additional notes */}
        {mistake.additional_notes && (
          <Text className="text-sm text-gray-600 dark:text-gray-300 mt-2 italic" numberOfLines={2}>
            {mistake.additional_notes}
          </Text>
        )}
      </View>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleEditCancel}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-end"
          onPress={handleEditCancel}
        >
          <Pressable
            className="bg-white dark:bg-gray-800 rounded-t-3xl max-h-[80%]"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-gray-700">
              <Pressable testID={`${testID}-modal-cancel`} onPress={handleEditCancel}>
                <Text className="text-base text-gray-500">Cancel</Text>
              </Pressable>
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Edit Mistake
              </Text>
              <Pressable testID={`${testID}-modal-save`} onPress={handleEditSave}>
                <Text className="text-base text-primary font-semibold">Save</Text>
              </Pressable>
            </View>

            <ScrollView className="px-4 py-4">
              {/* Surah - editable if availableSurahs provided */}
              <View className="mb-4">
                <Text className="text-sm text-gray-500 dark:text-gray-400 mb-2">Portion (Surah)</Text>
                {availableSurahs.length > 0 ? (
                  <View className="flex-row flex-wrap gap-2">
                    {availableSurahs.map((surah) => {
                      const isSelected = editedMistake.portion_surah === surah;
                      return (
                        <Pressable
                          key={surah}
                          onPress={() =>
                            setEditedMistake({
                              ...editedMistake,
                              portion_surah: surah,
                            })
                          }
                          className={`px-3 py-2 rounded-full border-2 ${
                            isSelected
                              ? 'border-primary bg-primary/10'
                              : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700'
                          }`}
                        >
                          <Text
                            className={`text-sm font-medium ${
                              isSelected ? 'text-primary' : 'text-gray-600 dark:text-gray-300'
                            }`}
                          >
                            {surah}
                          </Text>
                        </Pressable>
                      );
                    })}
                    {/* Show "Unknown" option if current value is Unknown */}
                    {editedMistake.portion_surah === 'Unknown' && !availableSurahs.includes('Unknown') && (
                      <View className="px-3 py-2 rounded-full border-2 border-orange-300 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/30">
                        <Text className="text-sm font-medium text-orange-600 dark:text-orange-400">
                          Unknown (select a surah above)
                        </Text>
                      </View>
                    )}
                  </View>
                ) : (
                  <View className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-3 bg-gray-50 dark:bg-gray-700">
                    <Text className="text-base text-gray-900 dark:text-gray-100">
                      {editedMistake.portion_surah}
                    </Text>
                  </View>
                )}
              </View>

              {/* Error Category */}
              <View className="mb-4">
                <Text className="text-sm text-gray-500 dark:text-gray-400 mb-2">Category</Text>
                <View testID={`${testID}-modal-category`} className="flex-row flex-wrap gap-2">
                  {ERROR_CATEGORIES.map((category) => {
                    const isSelected = editedMistake.error_category === category;
                    return (
                      <Pressable
                        key={category}
                        testID={`${testID}-modal-category-${category}`}
                        onPress={() =>
                          setEditedMistake({
                            ...editedMistake,
                            error_category: category,
                            error_subcategory: null, // Reset subcategory when category changes
                          })
                        }
                        className={`px-3 py-2 rounded-full border-2 ${
                          isSelected
                            ? 'border-primary bg-primary/10'
                            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700'
                        }`}
                      >
                        <Text
                          className={`text-sm font-medium ${
                            isSelected ? 'text-primary' : 'text-gray-600 dark:text-gray-300'
                          }`}
                        >
                          {formatCategory(category)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Error Subcategory - filtered by selected category */}
              <View className="mb-4">
                <Text className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Subcategory (optional)
                </Text>
                {SUBCATEGORIES_BY_CATEGORY[editedMistake.error_category].length > 0 ? (
                  <View className="flex-row flex-wrap gap-2">
                    {SUBCATEGORIES_BY_CATEGORY[editedMistake.error_category].map((subcategory) => {
                      const isSelected =
                        editedMistake.error_subcategory === subcategory;
                      return (
                        <Pressable
                          key={subcategory}
                          onPress={() =>
                            setEditedMistake({
                              ...editedMistake,
                              error_subcategory: isSelected ? null : subcategory,
                            })
                          }
                          className={`px-3 py-2 rounded-full border ${
                            isSelected
                              ? 'border-primary bg-primary/10'
                              : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700'
                          }`}
                        >
                          <Text
                            className={`text-xs ${
                              isSelected ? 'text-primary font-medium' : 'text-gray-600 dark:text-gray-300'
                            }`}
                          >
                            {formatCategory(subcategory)}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                ) : (
                  <Text className="text-sm text-gray-400 dark:text-gray-500 italic">
                    No subcategories for this category. Use notes below for details.
                  </Text>
                )}
              </View>

              {/* Severity Level */}
              <View className="mb-4">
                <Text className="text-sm text-gray-500 dark:text-gray-400 mb-2">Severity Level</Text>
                <View testID={`${testID}-modal-severity`} className="flex-row gap-2">
                  {([1, 2, 3, 4, 5] as SeverityLevel[]).map((level) => {
                    const isSelected = editedMistake.severity_level === level;
                    const style = SEVERITY_COLORS[level];
                    return (
                      <Pressable
                        key={level}
                        testID={`${testID}-modal-severity-${level}`}
                        onPress={() =>
                          setEditedMistake({ ...editedMistake, severity_level: level })
                        }
                        className={`flex-1 py-3 items-center rounded-lg border-2 ${
                          isSelected ? 'border-primary' : 'border-transparent'
                        } ${style.bg}`}
                      >
                        <Text className={`text-lg font-bold ${style.text}`}>
                          {level}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Ayah Number - Editable */}
              <View className="mb-4">
                <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">Ayah Number (optional)</Text>
                <TextInput
                  testID={`${testID}-modal-ayah`}
                  value={editedMistake.ayah_number?.toString() ?? ''}
                  onChangeText={(text) => {
                    const num = parseInt(text, 10);
                    setEditedMistake({
                      ...editedMistake,
                      ayah_number: isNaN(num) ? null : num,
                    });
                  }}
                  placeholder="e.g., 5"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-3 text-base text-gray-900 dark:text-gray-100 dark:bg-gray-700"
                />
              </View>

              {/* Additional Notes - Editable */}
              <View className="mb-4">
                <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">Notes (optional)</Text>
                <TextInput
                  testID={`${testID}-modal-notes`}
                  value={editedMistake.additional_notes ?? ''}
                  onChangeText={(text) =>
                    setEditedMistake({
                      ...editedMistake,
                      additional_notes: text || null,
                    })
                  }
                  placeholder="Add details about the mistake..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-3 text-base text-gray-900 dark:text-gray-100 dark:bg-gray-700"
                  style={{ minHeight: 80, textAlignVertical: 'top' }}
                />
              </View>

              {/* Bottom padding */}
              <View className="h-8" />
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
