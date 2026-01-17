import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useSession, useDeleteSession } from '@/lib/hooks/useSessions';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import type { SessionPortion, MistakeData } from '@/types/session';

// Helper to format session type for display
function formatSessionType(type: string): string {
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Helper to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Helper to format recency category
function formatRecency(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

// Helper to get severity color
function getSeverityColor(level: number): string {
  const colors: Record<number, string> = {
    1: '#22C55E', // green
    2: '#84CC16', // lime
    3: '#EAB308', // yellow
    4: '#F97316', // orange
    5: '#EF4444', // red
  };
  return colors[level] || '#6B7280';
}

// Helper to get score color
function getScoreColor(score: number): string {
  if (score >= 9) return '#22C55E';
  if (score >= 7) return '#84CC16';
  if (score >= 5) return '#EAB308';
  if (score >= 3) return '#F97316';
  return '#EF4444';
}

// Expandable Portion Card Component
function PortionCard({
  portion,
  mistakes,
  index,
}: {
  portion: SessionPortion;
  mistakes: MistakeData[];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const portionMistakes = mistakes.filter(
    (m) => m.session_portion_id === portion.id
  );

  return (
    <View
      testID={`portion-card-${index}`}
      className="bg-white rounded-xl mb-3 overflow-hidden border border-gray-100"
    >
      <Pressable
        testID={`portion-toggle-${index}`}
        onPress={() => setExpanded(!expanded)}
        className="p-4"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900">
              {portion.surah_name}
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              Ayahs {portion.ayah_start} - {portion.ayah_end} • Juz{' '}
              {portion.juz_number}
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            {portionMistakes.length > 0 && (
              <View className="bg-red-100 px-2 py-1 rounded-full">
                <Text className="text-red-700 text-xs font-medium">
                  {portionMistakes.length} mistake
                  {portionMistakes.length !== 1 ? 's' : ''}
                </Text>
              </View>
            )}
            <FontAwesome
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={14}
              color="#6B7280"
            />
          </View>
        </View>

        <View className="flex-row flex-wrap gap-2 mt-3">
          <View className="bg-gray-100 px-2 py-1 rounded">
            <Text className="text-xs text-gray-600">
              {formatRecency(portion.recency_category)}
            </Text>
          </View>
          <View className="bg-gray-100 px-2 py-1 rounded">
            <Text className="text-xs text-gray-600">
              {portion.repetition_count}x repetitions
            </Text>
          </View>
          {portion.pages_read > 0 && (
            <View className="bg-gray-100 px-2 py-1 rounded">
              <Text className="text-xs text-gray-600">
                {portion.pages_read} pages
              </Text>
            </View>
          )}
        </View>
      </Pressable>

      {expanded && portionMistakes.length > 0 && (
        <View
          testID={`portion-mistakes-${index}`}
          className="border-t border-gray-100 bg-gray-50 p-4"
        >
          <Text className="text-sm font-medium text-gray-700 mb-3">
            Mistakes
          </Text>
          {portionMistakes.map((mistake, mIndex) => (
            <View
              key={mistake.id}
              testID={`mistake-${index}-${mIndex}`}
              className="bg-white rounded-lg p-3 mb-2 border border-gray-100"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <View
                    style={{ backgroundColor: getSeverityColor(mistake.severity_level) }}
                    className="w-2 h-2 rounded-full"
                  />
                  <Text className="font-medium text-gray-900 capitalize">
                    {mistake.error_category.replace('_', ' ')}
                  </Text>
                </View>
                <Text className="text-xs text-gray-500">
                  Ayah {mistake.ayah_number}
                </Text>
              </View>
              {mistake.error_subcategory && (
                <Text className="text-sm text-gray-600 mt-1 capitalize">
                  {mistake.error_subcategory.replace('_', ' ')}
                </Text>
              )}
              {mistake.additional_notes && (
                <Text className="text-sm text-gray-500 mt-2 italic">
                  {mistake.additional_notes}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// Loading Skeleton
function LoadingSkeleton() {
  return (
    <View testID="session-detail-loading" className="flex-1 bg-gray-50 p-4">
      <View className="bg-gray-200 h-8 w-3/4 rounded mb-4 animate-pulse" />
      <View className="bg-gray-200 h-4 w-1/2 rounded mb-6 animate-pulse" />
      <View className="bg-white rounded-xl p-4 mb-4">
        <View className="bg-gray-200 h-6 w-full rounded mb-3 animate-pulse" />
        <View className="bg-gray-200 h-4 w-2/3 rounded animate-pulse" />
      </View>
      <View className="bg-white rounded-xl p-4 mb-4">
        <View className="bg-gray-200 h-6 w-full rounded mb-3 animate-pulse" />
        <View className="bg-gray-200 h-4 w-2/3 rounded animate-pulse" />
      </View>
    </View>
  );
}

// Error State
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View testID="session-detail-error" className="flex-1 bg-gray-50 items-center justify-center p-4">
      <FontAwesome name="exclamation-circle" size={48} color="#EF4444" />
      <Text className="text-lg font-semibold text-gray-900 mt-4">
        Session Not Found
      </Text>
      <Text className="text-gray-500 text-center mt-2">{message}</Text>
      <Pressable
        testID="retry-button"
        onPress={onRetry}
        className="mt-6 bg-emerald-500 px-6 py-3 rounded-lg"
      >
        <Text className="text-white font-medium">Try Again</Text>
      </Pressable>
    </View>
  );
}

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: session, isLoading, isError, error, refetch } = useSession(id);
  const deleteSessionMutation = useDeleteSession();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEdit = () => {
    router.push(`/session/edit/${id}` as any);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteSessionMutation.mutateAsync(id!);
      setShowDeleteDialog(false);
      router.back();
    } catch (err) {
      setShowDeleteDialog(false);
      Alert.alert('Error', 'Failed to delete session. Please try again.');
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
  };

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ title: 'Loading...' }} />
        <LoadingSkeleton />
      </>
    );
  }

  if (isError || !session) {
    return (
      <>
        <Stack.Screen options={{ title: 'Error' }} />
        <ErrorState
          message={error?.message || 'Unable to load session details'}
          onRetry={() => refetch()}
        />
      </>
    );
  }

  const totalMistakes = session.mistakes.length;
  const totalAyahs = session.session_portions.reduce(
    (sum, p) => sum + (p.ayah_end - p.ayah_start + 1),
    0
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Session Details',
          headerRight: () => (
            <View className="flex-row gap-4">
              <Pressable testID="edit-button" onPress={handleEdit}>
                <FontAwesome name="edit" size={20} color="#10B981" />
              </Pressable>
              <Pressable testID="delete-button" onPress={handleDelete}>
                <FontAwesome name="trash" size={20} color="#EF4444" />
              </Pressable>
            </View>
          ),
        }}
      />
      <ScrollView
        testID="session-detail-screen"
        className="flex-1 bg-gray-50"
        contentContainerClassName="p-4 pb-8"
      >
        {/* Header Section */}
        <View testID="session-header" className="mb-6">
          <Text className="text-2xl font-bold text-gray-900">
            {formatSessionType(session.session_type)}
          </Text>
          <Text className="text-gray-500 mt-1">
            {formatDate(session.session_date)}
          </Text>
        </View>

        {/* Stats Row */}
        <View testID="session-stats" className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-white rounded-xl p-4 items-center border border-gray-100">
            <Text
              style={{ color: getScoreColor(session.performance_score) }}
              className="text-3xl font-bold"
            >
              {session.performance_score}
            </Text>
            <Text className="text-xs text-gray-500 mt-1">Score</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl p-4 items-center border border-gray-100">
            <Text className="text-3xl font-bold text-gray-900">
              {session.duration_minutes}
            </Text>
            <Text className="text-xs text-gray-500 mt-1">Minutes</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl p-4 items-center border border-gray-100">
            <Text className="text-3xl font-bold text-gray-900">{totalAyahs}</Text>
            <Text className="text-xs text-gray-500 mt-1">Ayahs</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl p-4 items-center border border-gray-100">
            <Text
              className={`text-3xl font-bold ${
                totalMistakes > 0 ? 'text-red-500' : 'text-emerald-500'
              }`}
            >
              {totalMistakes}
            </Text>
            <Text className="text-xs text-gray-500 mt-1">Mistakes</Text>
          </View>
        </View>

        {/* Session Goal */}
        {session.session_goal && (
          <View testID="session-goal" className="bg-white rounded-xl p-4 mb-6 border border-gray-100">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Session Goal
            </Text>
            <Text className="text-gray-900">{session.session_goal}</Text>
          </View>
        )}

        {/* Portions Section */}
        <View testID="portions-section" className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Portions ({session.session_portions.length})
          </Text>
          {session.session_portions.map((portion, index) => (
            <PortionCard
              key={portion.id}
              portion={portion}
              mistakes={session.mistakes}
              index={index}
            />
          ))}
        </View>

        {/* Notes Section */}
        {session.additional_notes && (
          <View testID="session-notes" className="bg-white rounded-xl p-4 mb-6 border border-gray-100">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </Text>
            <Text className="text-gray-900">{session.additional_notes}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View testID="action-buttons" className="flex-row gap-3 mt-4">
          <Pressable
            testID="edit-session-btn"
            onPress={handleEdit}
            className="flex-1 bg-emerald-500 py-4 rounded-xl items-center flex-row justify-center gap-2"
          >
            <FontAwesome name="edit" size={16} color="white" />
            <Text className="text-white font-semibold">Edit</Text>
          </Pressable>
          <Pressable
            testID="delete-session-btn"
            onPress={handleDelete}
            className="flex-1 bg-red-500 py-4 rounded-xl items-center flex-row justify-center gap-2"
          >
            <FontAwesome name="trash" size={16} color="white" />
            <Text className="text-white font-semibold">Delete</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        testID="delete-confirm-dialog"
        visible={showDeleteDialog}
        title="Delete Session"
        message="Are you sure you want to delete this session? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmStyle="destructive"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteSessionMutation.isPending}
      />
    </>
  );
}
