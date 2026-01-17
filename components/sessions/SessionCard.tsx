import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { format } from 'date-fns';
import type { SessionWithRelations } from '@/lib/api/sessions';

export interface SessionCardProps {
  session: SessionWithRelations;
  onEdit?: (sessionId: string) => void;
  onDelete?: (sessionId: string) => void;
  testID?: string;
}

// Format session type for display
function formatSessionType(type: string): string {
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Get performance score color
function getPerformanceColor(score: number): string {
  if (score >= 8) return 'bg-green-500';
  if (score >= 6) return 'bg-yellow-500';
  if (score >= 4) return 'bg-orange-500';
  return 'bg-red-500';
}

export function SessionCard({
  session,
  onEdit,
  onDelete,
  testID,
}: SessionCardProps) {
  const router = useRouter();

  // Extract unique surah names from portions
  const surahNames = session.session_portions
    .map((p) => p.surah_name)
    .filter((name, index, self) => self.indexOf(name) === index);

  const mistakeCount = session.mistakes?.length ?? 0;

  const handlePress = () => {
    router.push(`/session/${session.id}` as Href);
  };

  const handleLongPress = () => {
    // Show action menu on long press
    // For now, this could trigger edit/delete options
  };

  return (
    <Pressable
      testID={testID}
      onPress={handlePress}
      onLongPress={handleLongPress}
      className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
    >
      {/* Header row: Date and Session Type */}
      <View className="flex-row justify-between items-start mb-2">
        <View>
          <Text className="text-base font-semibold text-gray-900">
            {format(new Date(session.session_date), 'EEEE, MMM d')}
          </Text>
          <Text className="text-sm text-gray-500">
            {formatSessionType(session.session_type)}
          </Text>
        </View>

        {/* Performance score badge */}
        <View className="items-end">
          <View
            className={`px-3 py-1 rounded-full ${getPerformanceColor(session.performance_score)}`}
          >
            <Text testID={`${testID}-score`} className="text-white font-bold text-sm">
              {session.performance_score}/10
            </Text>
          </View>
        </View>
      </View>

      {/* Surahs practiced */}
      <View className="mb-2">
        <Text
          testID={`${testID}-surahs`}
          className="text-sm text-gray-700"
          numberOfLines={1}
        >
          {surahNames.length > 0 ? surahNames.join(', ') : 'No portions'}
        </Text>
      </View>

      {/* Footer row: Duration and Mistake count */}
      <View className="flex-row justify-between items-center pt-2 border-t border-gray-100">
        <View className="flex-row items-center">
          <Text className="text-sm text-gray-500">
            {session.duration_minutes} min
          </Text>
          <Text className="text-gray-300 mx-2">•</Text>
          <Text className="text-sm text-gray-500">
            {session.session_portions.length} portion{session.session_portions.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Mistake count badge */}
        {mistakeCount > 0 && (
          <View
            testID={`${testID}-mistakes`}
            className="bg-red-100 px-2 py-1 rounded-full"
          >
            <Text className="text-red-600 text-xs font-medium">
              {mistakeCount} mistake{mistakeCount !== 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>

      {/* Action buttons (visible on interaction or could be swipe actions) */}
      {(onEdit || onDelete) && (
        <View className="flex-row justify-end gap-2 mt-3 pt-2 border-t border-gray-100">
          {onEdit && (
            <Pressable
              testID={`${testID}-edit`}
              onPress={() => onEdit(session.id)}
              className="bg-primary/10 px-3 py-1.5 rounded-lg"
            >
              <Text className="text-primary text-sm font-medium">Edit</Text>
            </Pressable>
          )}
          {onDelete && (
            <Pressable
              testID={`${testID}-delete`}
              onPress={() => onDelete(session.id)}
              className="bg-red-100 px-3 py-1.5 rounded-lg"
            >
              <Text className="text-red-600 text-sm font-medium">Delete</Text>
            </Pressable>
          )}
        </View>
      )}
    </Pressable>
  );
}
