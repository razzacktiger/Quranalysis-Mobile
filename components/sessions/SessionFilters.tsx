import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Modal, FlatList } from 'react-native';
import { SESSION_TYPES, RECENCY_CATEGORIES, type SessionType, type RecencyCategory } from '@/types/session';
import { SURAHS } from '@/constants/quran-data';
import { DatePicker } from '@/components/ui/DatePicker';

export type MistakeFilter = 'all' | 'with' | 'without';

export interface SessionFilters {
  searchQuery: string;
  sessionType: SessionType | null;
  surahName: string | null;
  dateFrom: Date | null;
  dateTo: Date | null;
  performanceMin: number | null;
  performanceMax: number | null;
  mistakeFilter: MistakeFilter;
  recencyCategory: RecencyCategory | null;
}

export interface SessionFiltersProps {
  filters: SessionFilters;
  onFiltersChange: (filters: SessionFilters) => void;
  availableSurahs?: string[];
  testID?: string;
}

const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  reading_practice: 'Reading',
  memorization: 'Memorization',
  audit: 'Audit',
  mistake_session: 'Mistake Review',
  practice_test: 'Practice Test',
  study_session: 'Study',
};

const RECENCY_LABELS: Record<RecencyCategory, string> = {
  new: 'New',
  recent: 'Recent',
  reviewing: 'Reviewing',
  maintenance: 'Maintenance',
};

const MISTAKE_FILTER_LABELS: Record<MistakeFilter, string> = {
  all: 'All Sessions',
  with: 'With Mistakes',
  without: 'Without Mistakes',
};

const PERFORMANCE_RANGES = [
  { label: 'All Scores', min: null, max: null },
  { label: 'Excellent (9-10)', min: 9, max: 10 },
  { label: 'Good (7-8)', min: 7, max: 8 },
  { label: 'Average (5-6)', min: 5, max: 6 },
  { label: 'Needs Work (1-4)', min: 1, max: 4 },
];

export function SessionFiltersComponent({
  filters,
  onFiltersChange,
  availableSurahs,
  testID,
}: SessionFiltersProps) {
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showSurahModal, setShowSurahModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [showMistakeModal, setShowMistakeModal] = useState(false);
  const [showRecencyModal, setShowRecencyModal] = useState(false);
  const [surahSearch, setSurahSearch] = useState('');

  const updateFilter = <K extends keyof SessionFilters>(
    key: K,
    value: SessionFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const updateFilters = (updates: Partial<SessionFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const clearFilters = () => {
    onFiltersChange(createEmptyFilters());
  };

  const hasActiveFilters =
    filters.searchQuery ||
    filters.sessionType ||
    filters.surahName ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.performanceMin !== null ||
    filters.performanceMax !== null ||
    filters.mistakeFilter !== 'all' ||
    filters.recencyCategory;

  // Filter surahs based on search and availability
  const filteredSurahs = useMemo(() => {
    let surahs = SURAHS;
    if (availableSurahs && availableSurahs.length > 0) {
      surahs = SURAHS.filter(s => availableSurahs.includes(s.transliteration));
    }
    if (surahSearch) {
      const query = surahSearch.toLowerCase();
      surahs = surahs.filter(
        s =>
          s.transliteration.toLowerCase().includes(query) ||
          s.name.includes(surahSearch) ||
          s.number.toString() === surahSearch
      );
    }
    return surahs;
  }, [surahSearch, availableSurahs]);

  // Count active filters (excluding search)
  const activeFilterCount = [
    filters.sessionType,
    filters.surahName,
    filters.dateFrom || filters.dateTo,
    filters.performanceMin !== null || filters.performanceMax !== null,
    filters.mistakeFilter !== 'all',
    filters.recencyCategory,
  ].filter(Boolean).length;

  // Get current performance label
  const getPerformanceLabel = () => {
    if (filters.performanceMin === null && filters.performanceMax === null) {
      return 'Score';
    }
    const range = PERFORMANCE_RANGES.find(
      r => r.min === filters.performanceMin && r.max === filters.performanceMax
    );
    return range?.label.split(' ')[0] || `${filters.performanceMin}-${filters.performanceMax}`;
  };

  // Get date range label
  const getDateLabel = () => {
    if (!filters.dateFrom && !filters.dateTo) return 'Date';
    if (filters.dateFrom && filters.dateTo) {
      return `${filters.dateFrom.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${filters.dateTo.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    if (filters.dateFrom) return `From ${filters.dateFrom.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    return `Until ${filters.dateTo!.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  return (
    <View testID={testID} className="mb-3">
      {/* Search Input */}
      <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-3 h-12 mb-3">
        <Text className="text-gray-400 mr-2">🔍</Text>
        <TextInput
          testID={`${testID}-search`}
          className="flex-1 text-base text-gray-900 dark:text-gray-100 h-full py-0"
          placeholder="Search surah, type, date..."
          placeholderTextColor="#9CA3AF"
          value={filters.searchQuery}
          onChangeText={(text) => updateFilter('searchQuery', text)}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {filters.searchQuery ? (
          <Pressable
            testID={`${testID}-clear-search`}
            onPress={() => updateFilter('searchQuery', '')}
            className="p-1"
          >
            <Text className="text-gray-400 text-xl">×</Text>
          </Pressable>
        ) : null}
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingRight: 16 }}
      >
        {/* Session Type Filter */}
        <Pressable
          testID={`${testID}-type-filter`}
          onPress={() => setShowTypeModal(true)}
          className={`px-3 py-1.5 rounded-full border ${
            filters.sessionType ? 'bg-primary border-primary' : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }`}
        >
          <Text className={`text-sm font-medium ${filters.sessionType ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>
            {filters.sessionType ? SESSION_TYPE_LABELS[filters.sessionType] : 'Type'}
          </Text>
        </Pressable>

        {/* Surah Filter */}
        <Pressable
          testID={`${testID}-surah-filter`}
          onPress={() => setShowSurahModal(true)}
          className={`px-3 py-1.5 rounded-full border ${
            filters.surahName ? 'bg-primary border-primary' : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }`}
        >
          <Text className={`text-sm font-medium ${filters.surahName ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>
            {filters.surahName || 'Surah'}
          </Text>
        </Pressable>

        {/* Date Range Filter */}
        <Pressable
          testID={`${testID}-date-filter`}
          onPress={() => setShowDateModal(true)}
          className={`px-3 py-1.5 rounded-full border ${
            filters.dateFrom || filters.dateTo ? 'bg-primary border-primary' : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }`}
        >
          <Text className={`text-sm font-medium ${filters.dateFrom || filters.dateTo ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>
            {getDateLabel()}
          </Text>
        </Pressable>

        {/* Performance Score Filter */}
        <Pressable
          testID={`${testID}-performance-filter`}
          onPress={() => setShowPerformanceModal(true)}
          className={`px-3 py-1.5 rounded-full border ${
            filters.performanceMin !== null ? 'bg-primary border-primary' : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }`}
        >
          <Text className={`text-sm font-medium ${filters.performanceMin !== null ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>
            {getPerformanceLabel()}
          </Text>
        </Pressable>

        {/* Mistakes Filter */}
        <Pressable
          testID={`${testID}-mistakes-filter`}
          onPress={() => setShowMistakeModal(true)}
          className={`px-3 py-1.5 rounded-full border ${
            filters.mistakeFilter !== 'all' ? 'bg-primary border-primary' : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }`}
        >
          <Text className={`text-sm font-medium ${filters.mistakeFilter !== 'all' ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>
            {filters.mistakeFilter === 'all' ? 'Mistakes' : MISTAKE_FILTER_LABELS[filters.mistakeFilter]}
          </Text>
        </Pressable>

        {/* Recency Category Filter */}
        <Pressable
          testID={`${testID}-recency-filter`}
          onPress={() => setShowRecencyModal(true)}
          className={`px-3 py-1.5 rounded-full border ${
            filters.recencyCategory ? 'bg-primary border-primary' : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }`}
        >
          <Text className={`text-sm font-medium ${filters.recencyCategory ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>
            {filters.recencyCategory ? RECENCY_LABELS[filters.recencyCategory] : 'Recency'}
          </Text>
        </Pressable>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Pressable
            testID={`${testID}-clear-all`}
            onPress={clearFilters}
            className="px-3 py-1.5 rounded-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
          >
            <Text className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Clear{activeFilterCount > 0 ? ` (${activeFilterCount})` : ' All'}
            </Text>
          </Pressable>
        )}
      </ScrollView>

      {/* Session Type Modal */}
      <Modal visible={showTypeModal} transparent animationType="slide" onRequestClose={() => setShowTypeModal(false)}>
        <Pressable className="flex-1 bg-black/50 justify-end" onPress={() => setShowTypeModal(false)}>
          <Pressable onPress={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-t-2xl">
            <View className="p-4 border-b border-gray-100 dark:border-gray-700">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">Session Type</Text>
                <Pressable onPress={() => setShowTypeModal(false)}>
                  <Text className="text-primary font-medium">Done</Text>
                </Pressable>
              </View>
            </View>
            <View className="p-4">
              <Pressable
                onPress={() => { updateFilter('sessionType', null); setShowTypeModal(false); }}
                className={`p-3 rounded-lg mb-2 ${!filters.sessionType ? 'bg-primary/10' : 'bg-gray-50 dark:bg-gray-700'}`}
              >
                <Text className={`text-base ${!filters.sessionType ? 'text-primary font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                  All Types
                </Text>
              </Pressable>
              {SESSION_TYPES.map((type) => (
                <Pressable
                  key={type}
                  onPress={() => { updateFilter('sessionType', type); setShowTypeModal(false); }}
                  className={`p-3 rounded-lg mb-2 ${filters.sessionType === type ? 'bg-primary/10' : 'bg-gray-50 dark:bg-gray-700'}`}
                >
                  <Text className={`text-base ${filters.sessionType === type ? 'text-primary font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                    {SESSION_TYPE_LABELS[type]}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View className="h-8" />
          </Pressable>
        </Pressable>
      </Modal>

      {/* Surah Filter Modal */}
      <Modal visible={showSurahModal} transparent animationType="slide" onRequestClose={() => { setShowSurahModal(false); setSurahSearch(''); }}>
        <Pressable className="flex-1 bg-black/50 justify-end" onPress={() => { setShowSurahModal(false); setSurahSearch(''); }}>
          <Pressable onPress={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-t-2xl max-h-[70%]">
            <View className="p-4 border-b border-gray-100 dark:border-gray-700">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filter by Surah</Text>
                <Pressable onPress={() => { setShowSurahModal(false); setSurahSearch(''); }}>
                  <Text className="text-primary font-medium">Done</Text>
                </Pressable>
              </View>
              <View className="flex-row items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 h-10">
                <Text className="text-gray-400 mr-2">🔍</Text>
                <TextInput
                  className="flex-1 text-base text-gray-900 dark:text-gray-100"
                  placeholder="Search surah..."
                  placeholderTextColor="#9CA3AF"
                  value={surahSearch}
                  onChangeText={setSurahSearch}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>
            <FlatList
              data={[{ transliteration: null, name: '', number: 0 }, ...filteredSurahs]}
              keyExtractor={(item) => item.transliteration ?? 'all'}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => { updateFilter('surahName', item.transliteration); setShowSurahModal(false); setSurahSearch(''); }}
                  className={`p-3 mx-4 rounded-lg mb-1 ${filters.surahName === item.transliteration ? 'bg-primary/10' : 'bg-gray-50 dark:bg-gray-700'}`}
                >
                  <Text className={`text-base ${filters.surahName === item.transliteration ? 'text-primary font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                    {item.transliteration ? `${item.number}. ${item.transliteration}` : 'All Surahs'}
                  </Text>
                </Pressable>
              )}
              ListFooterComponent={<View className="h-8" />}
            />
          </Pressable>
        </Pressable>
      </Modal>

      {/* Date Range Modal */}
      <Modal visible={showDateModal} transparent animationType="slide" onRequestClose={() => setShowDateModal(false)}>
        <Pressable className="flex-1 bg-black/50 justify-end" onPress={() => setShowDateModal(false)}>
          <Pressable onPress={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-t-2xl">
            <View className="p-4 border-b border-gray-100 dark:border-gray-700">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">Date Range</Text>
                <Pressable onPress={() => setShowDateModal(false)}>
                  <Text className="text-primary font-medium">Done</Text>
                </Pressable>
              </View>
            </View>
            <View className="p-4">
              <DatePicker
                label="From Date"
                value={filters.dateFrom ?? new Date()}
                onChange={(date) => updateFilter('dateFrom', date)}
                maximumDate={filters.dateTo ?? new Date()}
              />
              <DatePicker
                label="To Date"
                value={filters.dateTo ?? new Date()}
                onChange={(date) => updateFilter('dateTo', date)}
                minimumDate={filters.dateFrom ?? undefined}
                maximumDate={new Date()}
              />
              <Pressable
                onPress={() => { updateFilters({ dateFrom: null, dateTo: null }); }}
                className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 mt-2"
              >
                <Text className="text-base text-center text-gray-700 dark:text-gray-300">Clear Date Filter</Text>
              </Pressable>
            </View>
            <View className="h-8" />
          </Pressable>
        </Pressable>
      </Modal>

      {/* Performance Score Modal */}
      <Modal visible={showPerformanceModal} transparent animationType="slide" onRequestClose={() => setShowPerformanceModal(false)}>
        <Pressable className="flex-1 bg-black/50 justify-end" onPress={() => setShowPerformanceModal(false)}>
          <Pressable onPress={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-t-2xl">
            <View className="p-4 border-b border-gray-100 dark:border-gray-700">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">Performance Score</Text>
                <Pressable onPress={() => setShowPerformanceModal(false)}>
                  <Text className="text-primary font-medium">Done</Text>
                </Pressable>
              </View>
            </View>
            <View className="p-4">
              {PERFORMANCE_RANGES.map((range) => (
                <Pressable
                  key={range.label}
                  onPress={() => {
                    updateFilters({ performanceMin: range.min, performanceMax: range.max });
                    setShowPerformanceModal(false);
                  }}
                  className={`p-3 rounded-lg mb-2 ${
                    filters.performanceMin === range.min && filters.performanceMax === range.max
                      ? 'bg-primary/10'
                      : 'bg-gray-50 dark:bg-gray-700'
                  }`}
                >
                  <Text className={`text-base ${
                    filters.performanceMin === range.min && filters.performanceMax === range.max
                      ? 'text-primary font-medium'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {range.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View className="h-8" />
          </Pressable>
        </Pressable>
      </Modal>

      {/* Mistakes Filter Modal */}
      <Modal visible={showMistakeModal} transparent animationType="slide" onRequestClose={() => setShowMistakeModal(false)}>
        <Pressable className="flex-1 bg-black/50 justify-end" onPress={() => setShowMistakeModal(false)}>
          <Pressable onPress={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-t-2xl">
            <View className="p-4 border-b border-gray-100 dark:border-gray-700">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filter by Mistakes</Text>
                <Pressable onPress={() => setShowMistakeModal(false)}>
                  <Text className="text-primary font-medium">Done</Text>
                </Pressable>
              </View>
            </View>
            <View className="p-4">
              {(['all', 'with', 'without'] as MistakeFilter[]).map((option) => (
                <Pressable
                  key={option}
                  onPress={() => { updateFilter('mistakeFilter', option); setShowMistakeModal(false); }}
                  className={`p-3 rounded-lg mb-2 ${filters.mistakeFilter === option ? 'bg-primary/10' : 'bg-gray-50 dark:bg-gray-700'}`}
                >
                  <Text className={`text-base ${filters.mistakeFilter === option ? 'text-primary font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                    {MISTAKE_FILTER_LABELS[option]}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View className="h-8" />
          </Pressable>
        </Pressable>
      </Modal>

      {/* Recency Category Modal */}
      <Modal visible={showRecencyModal} transparent animationType="slide" onRequestClose={() => setShowRecencyModal(false)}>
        <Pressable className="flex-1 bg-black/50 justify-end" onPress={() => setShowRecencyModal(false)}>
          <Pressable onPress={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-t-2xl">
            <View className="p-4 border-b border-gray-100 dark:border-gray-700">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recency Category</Text>
                <Pressable onPress={() => setShowRecencyModal(false)}>
                  <Text className="text-primary font-medium">Done</Text>
                </Pressable>
              </View>
            </View>
            <View className="p-4">
              <Pressable
                onPress={() => { updateFilter('recencyCategory', null); setShowRecencyModal(false); }}
                className={`p-3 rounded-lg mb-2 ${!filters.recencyCategory ? 'bg-primary/10' : 'bg-gray-50 dark:bg-gray-700'}`}
              >
                <Text className={`text-base ${!filters.recencyCategory ? 'text-primary font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                  All Categories
                </Text>
              </Pressable>
              {RECENCY_CATEGORIES.map((cat) => (
                <Pressable
                  key={cat}
                  onPress={() => { updateFilter('recencyCategory', cat); setShowRecencyModal(false); }}
                  className={`p-3 rounded-lg mb-2 ${filters.recencyCategory === cat ? 'bg-primary/10' : 'bg-gray-50 dark:bg-gray-700'}`}
                >
                  <Text className={`text-base ${filters.recencyCategory === cat ? 'text-primary font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                    {RECENCY_LABELS[cat]}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View className="h-8" />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

// Month name mappings for search
const MONTH_NAMES = [
  ['jan', 'january'], ['feb', 'february'], ['mar', 'march'], ['apr', 'april'],
  ['may'], ['jun', 'june'], ['jul', 'july'], ['aug', 'august'],
  ['sep', 'sept', 'september'], ['oct', 'october'], ['nov', 'november'], ['dec', 'december'],
];

function dateMatchesQuery(dateStr: string, query: string): boolean {
  const date = new Date(dateStr);
  const monthIndex = date.getMonth();
  const monthNames = MONTH_NAMES[monthIndex];
  if (monthNames?.some(name => name.startsWith(query))) return true;
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  }).toLowerCase();
  if (formattedDate.includes(query)) return true;
  const dayOfMonth = date.getDate().toString();
  if (dayOfMonth === query || dayOfMonth.startsWith(query)) return true;
  return false;
}

function typeMatchesQuery(type: SessionType, query: string): boolean {
  const label = SESSION_TYPE_LABELS[type].toLowerCase();
  const typeKey = type.toLowerCase().replace(/_/g, ' ');
  return label.includes(query) || typeKey.includes(query);
}

/**
 * Filter sessions based on the current filters (AND logic)
 */
export function filterSessions<
  T extends {
    session_type: SessionType;
    session_date: string;
    performance_score: number;
    session_portions: Array<{ surah_name: string; recency_category: RecencyCategory }>;
    mistakes?: Array<unknown> | null;
  }
>(sessions: T[], filters: SessionFilters): T[] {
  return sessions.filter((session) => {
    // Filter by session type
    if (filters.sessionType && session.session_type !== filters.sessionType) {
      return false;
    }

    // Filter by surah
    if (filters.surahName) {
      const hasSurah = session.session_portions.some(p => p.surah_name === filters.surahName);
      if (!hasSurah) return false;
    }

    // Filter by date range
    if (filters.dateFrom) {
      const sessionDate = new Date(session.session_date);
      const fromDate = new Date(filters.dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      if (sessionDate < fromDate) return false;
    }
    if (filters.dateTo) {
      const sessionDate = new Date(session.session_date);
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      if (sessionDate > toDate) return false;
    }

    // Filter by performance score
    if (filters.performanceMin !== null && session.performance_score < filters.performanceMin) {
      return false;
    }
    if (filters.performanceMax !== null && session.performance_score > filters.performanceMax) {
      return false;
    }

    // Filter by mistakes
    const mistakeCount = session.mistakes?.length ?? 0;
    if (filters.mistakeFilter === 'with' && mistakeCount === 0) return false;
    if (filters.mistakeFilter === 'without' && mistakeCount > 0) return false;

    // Filter by recency category
    if (filters.recencyCategory) {
      const hasRecency = session.session_portions.some(p => p.recency_category === filters.recencyCategory);
      if (!hasRecency) return false;
    }

    // Search query - match against multiple fields
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase().trim();
      const matchesSurah = session.session_portions.some(p => p.surah_name.toLowerCase().includes(query));
      const matchesDate = dateMatchesQuery(session.session_date, query);
      const matchesType = typeMatchesQuery(session.session_type, query);
      if (!matchesSurah && !matchesDate && !matchesType) return false;
    }

    return true;
  });
}

/**
 * Extract unique surah names from sessions
 */
export function getUniqueSurahs<
  T extends { session_portions: Array<{ surah_name: string }> }
>(sessions: T[]): string[] {
  const surahSet = new Set<string>();
  sessions.forEach((session) => {
    session.session_portions.forEach((portion) => {
      surahSet.add(portion.surah_name);
    });
  });
  return Array.from(surahSet).sort();
}

/**
 * Create empty filters object
 */
export function createEmptyFilters(): SessionFilters {
  return {
    searchQuery: '',
    sessionType: null,
    surahName: null,
    dateFrom: null,
    dateTo: null,
    performanceMin: null,
    performanceMax: null,
    mistakeFilter: 'all',
    recencyCategory: null,
  };
}
