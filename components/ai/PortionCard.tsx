import React, { useState } from 'react';
import { View, Text, Pressable, Modal, Alert, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RECENCY_CATEGORIES, type RecencyCategory } from '@/types/session';

export interface PortionCardData {
  tempId: string;
  surah_name: string | null;
  ayah_start: number | null;
  ayah_end: number | null;
  recency_category: RecencyCategory | null;
  repetition_count: number | null;
}

export interface PortionCardProps {
  portion: PortionCardData;
  onEdit: (portion: PortionCardData) => void;
  onRemove: (tempId: string) => void;
  testID?: string;
}

// Recency category display labels and colors
const RECENCY_STYLES: Record<RecencyCategory, { label: string; className: string }> = {
  new: { label: 'New', className: 'bg-green-100 text-green-700' },
  recent: { label: 'Recent', className: 'bg-blue-100 text-blue-700' },
  reviewing: { label: 'Reviewing', className: 'bg-yellow-100 text-yellow-700' },
  maintenance: { label: 'Maintenance', className: 'bg-gray-100 text-gray-600' },
};

/**
 * Card displaying a portion (section of Quran) with edit/remove actions
 * Shows surah name, ayah range, and recency category
 */
export function PortionCard({
  portion,
  onEdit,
  onRemove,
  testID,
}: PortionCardProps) {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedPortion, setEditedPortion] = useState(portion);

  const handleRemove = () => {
    Alert.alert(
      'Remove Portion',
      `Remove ${portion.surah_name || 'this portion'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => onRemove(portion.tempId),
        },
      ]
    );
  };

  const handleEditSave = () => {
    onEdit(editedPortion);
    setEditModalVisible(false);
  };

  const handleEditCancel = () => {
    setEditedPortion(portion);
    setEditModalVisible(false);
  };

  const recencyStyle = portion.recency_category
    ? RECENCY_STYLES[portion.recency_category]
    : null;

  // Format ayah range display
  const ayahDisplay =
    portion.ayah_start && portion.ayah_end
      ? portion.ayah_start === portion.ayah_end
        ? `Ayah ${portion.ayah_start}`
        : `Ayahs ${portion.ayah_start}-${portion.ayah_end}`
      : portion.ayah_start
        ? `From ayah ${portion.ayah_start}`
        : null;

  return (
    <>
      <View
        testID={testID}
        className="bg-white border border-gray-200 rounded-xl p-4 mb-3"
      >
        {/* Header row: Surah name and actions */}
        <View className="flex-row items-start justify-between mb-2">
          <View className="flex-1 mr-2">
            <Text
              testID={`${testID}-surah`}
              className="text-base font-semibold text-gray-900"
              numberOfLines={1}
            >
              {portion.surah_name || 'Unknown Surah'}
            </Text>
            {ayahDisplay && (
              <Text className="text-sm text-gray-500 mt-0.5">{ayahDisplay}</Text>
            )}
          </View>

          {/* Action buttons */}
          <View className="flex-row gap-2">
            <Pressable
              testID={`${testID}-edit`}
              onPress={() => setEditModalVisible(true)}
              className="w-8 h-8 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
              accessibilityLabel="Edit portion"
              accessibilityRole="button"
            >
              <Ionicons name="pencil" size={16} color="#6B7280" />
            </Pressable>
            <Pressable
              testID={`${testID}-remove`}
              onPress={handleRemove}
              className="w-8 h-8 items-center justify-center rounded-full bg-red-50 active:bg-red-100"
              accessibilityLabel="Remove portion"
              accessibilityRole="button"
            >
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
            </Pressable>
          </View>
        </View>

        {/* Details row: Recency badge and repetitions */}
        <View className="flex-row items-center gap-2 mt-1">
          {recencyStyle && (
            <View
              className={`px-2 py-1 rounded-full ${recencyStyle.className.split(' ')[0]}`}
            >
              <Text
                className={`text-xs font-medium ${recencyStyle.className.split(' ')[1]}`}
              >
                {recencyStyle.label}
              </Text>
            </View>
          )}
          {portion.repetition_count !== null && portion.repetition_count > 0 && (
            <Text className="text-xs text-gray-500">
              {portion.repetition_count}x repetitions
            </Text>
          )}
        </View>
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
            className="bg-white rounded-t-3xl"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
              <Pressable testID={`${testID}-modal-cancel`} onPress={handleEditCancel}>
                <Text className="text-base text-gray-500">Cancel</Text>
              </Pressable>
              <Text className="text-lg font-semibold text-gray-900">
                Edit Portion
              </Text>
              <Pressable testID={`${testID}-modal-save`} onPress={handleEditSave}>
                <Text className="text-base text-primary font-semibold">Save</Text>
              </Pressable>
            </View>

            {/* Edit fields */}
            <ScrollView className="px-4 py-4">
              {/* Surah Name */}
              <View className="mb-4">
                <Text className="text-sm text-gray-500 mb-1">Surah Name</Text>
                <View className="border border-gray-200 rounded-lg px-3 py-3 bg-gray-50">
                  <Text className="text-base text-gray-900">
                    {editedPortion.surah_name || 'Not specified'}
                  </Text>
                </View>
              </View>

              {/* Ayah Range - Editable */}
              <View className="flex-row gap-3 mb-4">
                <View className="flex-1">
                  <Text className="text-sm text-gray-500 mb-1">Start Ayah</Text>
                  <TextInput
                    testID={`${testID}-modal-ayah-start`}
                    value={editedPortion.ayah_start?.toString() ?? ''}
                    onChangeText={(text) => {
                      const num = parseInt(text, 10);
                      setEditedPortion({
                        ...editedPortion,
                        ayah_start: isNaN(num) ? null : num,
                      });
                    }}
                    placeholder="1"
                    keyboardType="numeric"
                    className="border border-gray-200 rounded-lg px-3 py-3 text-base text-gray-900"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm text-gray-500 mb-1">End Ayah</Text>
                  <TextInput
                    testID={`${testID}-modal-ayah-end`}
                    value={editedPortion.ayah_end?.toString() ?? ''}
                    onChangeText={(text) => {
                      const num = parseInt(text, 10);
                      setEditedPortion({
                        ...editedPortion,
                        ayah_end: isNaN(num) ? null : num,
                      });
                    }}
                    placeholder="7"
                    keyboardType="numeric"
                    className="border border-gray-200 rounded-lg px-3 py-3 text-base text-gray-900"
                  />
                </View>
              </View>

              {/* Repetition Count - Editable */}
              <View className="mb-4">
                <Text className="text-sm text-gray-500 mb-1">Repetitions</Text>
                <TextInput
                  testID={`${testID}-modal-repetitions`}
                  value={editedPortion.repetition_count?.toString() ?? ''}
                  onChangeText={(text) => {
                    const num = parseInt(text, 10);
                    setEditedPortion({
                      ...editedPortion,
                      repetition_count: isNaN(num) ? null : num,
                    });
                  }}
                  placeholder="1"
                  keyboardType="numeric"
                  className="border border-gray-200 rounded-lg px-3 py-3 text-base text-gray-900"
                />
              </View>

              {/* Recency Category */}
              <View className="mb-4">
                <Text className="text-sm text-gray-500 mb-2">Recency</Text>
                <View testID={`${testID}-modal-recency`} className="flex-row flex-wrap gap-2">
                  {RECENCY_CATEGORIES.map((category) => {
                    const isSelected = editedPortion.recency_category === category;
                    const style = RECENCY_STYLES[category];
                    return (
                      <Pressable
                        key={category}
                        testID={`${testID}-modal-recency-${category}`}
                        onPress={() =>
                          setEditedPortion({ ...editedPortion, recency_category: category })
                        }
                        className={`px-3 py-2 rounded-full border-2 ${
                          isSelected
                            ? 'border-primary bg-primary/10'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <Text
                          className={`text-sm font-medium ${
                            isSelected ? 'text-primary' : 'text-gray-600'
                          }`}
                        >
                          {style.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Bottom padding */}
              <View className="h-4" />
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
