import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, Modal, FlatList, TextInput } from 'react-native';
import { SURAHS, searchSurahs, type Surah } from '@/constants/quran-data';

export interface SurahPickerProps {
  label?: string;
  error?: string;
  placeholder?: string;
  value?: string; // surah transliteration name
  onValueChange?: (surahName: string) => void;
  testID?: string;
}

export function SurahPicker({
  label,
  error,
  placeholder = 'Select Surah...',
  value,
  onValueChange,
  testID,
}: SurahPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedSurah = useMemo(() => {
    if (!value) return null;
    return SURAHS.find((s) => s.transliteration === value) ?? null;
  }, [value]);

  const filteredSurahs = useMemo(() => {
    return searchSurahs(searchQuery);
  }, [searchQuery]);

  const handleSelect = (surah: Surah) => {
    onValueChange?.(surah.transliteration);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleOpen = () => {
    setSearchQuery('');
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-1">{label}</Text>
      )}
      <Pressable
        testID={testID}
        onPress={handleOpen}
        className={`
          border rounded-lg px-4 py-3 flex-row justify-between items-center
          ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}
        `}
      >
        <Text
          className={selectedSurah ? 'text-base text-gray-900' : 'text-base text-gray-400'}
        >
          {selectedSurah
            ? `${selectedSurah.number}. ${selectedSurah.transliteration}`
            : placeholder}
        </Text>
        <Text className="text-gray-400">▼</Text>
      </Pressable>
      {error && (
        <Text testID={`${testID}-error`} className="text-sm text-red-500 mt-1">
          {error}
        </Text>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-end"
          onPress={handleClose}
        >
          <Pressable
            className="bg-white rounded-t-2xl max-h-[70%]"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
              <Text className="text-lg font-semibold">{label ?? 'Select Surah'}</Text>
              <Pressable onPress={handleClose}>
                <Text className="text-primary text-base font-medium">Done</Text>
              </Pressable>
            </View>

            <View className="px-4 py-2 border-b border-gray-100">
              <TextInput
                testID={`${testID}-search`}
                className="border border-gray-300 rounded-lg px-3 py-2 text-base bg-gray-50"
                placeholder="Search by name or number..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
            </View>

            <FlatList
              data={filteredSurahs}
              keyExtractor={(item) => item.number.toString()}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable
                  testID={`${testID}-option-${item.number}`}
                  onPress={() => handleSelect(item)}
                  className={`
                    px-4 py-3 border-b border-gray-100 flex-row items-center
                    ${item.transliteration === value ? 'bg-primary/10' : ''}
                  `}
                >
                  <Text className="text-gray-500 w-8 text-right mr-3">
                    {item.number}
                  </Text>
                  <View className="flex-1">
                    <Text
                      className={`
                        text-base
                        ${item.transliteration === value ? 'text-primary font-medium' : 'text-gray-900'}
                      `}
                    >
                      {item.transliteration}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {item.name} • {item.ayah_count} ayahs
                    </Text>
                  </View>
                </Pressable>
              )}
              ListEmptyComponent={
                <View className="px-4 py-8 items-center">
                  <Text className="text-gray-400 text-base">No surahs found</Text>
                </View>
              }
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
