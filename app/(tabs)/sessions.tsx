import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useSessions } from '@/lib/hooks/useSessions';
import { SessionCard } from '@/components/sessions/SessionCard';
import type { SessionWithRelations } from '@/lib/api/sessions';

function LoadingSkeleton() {
  return (
    <View className="p-4">
      {[1, 2, 3].map((i) => (
        <View
          key={i}
          className="bg-gray-100 rounded-xl p-4 mb-3 animate-pulse"
        >
          <View className="flex-row justify-between mb-3">
            <View>
              <View className="bg-gray-200 h-5 w-32 rounded mb-2" />
              <View className="bg-gray-200 h-4 w-24 rounded" />
            </View>
            <View className="bg-gray-200 h-8 w-16 rounded-full" />
          </View>
          <View className="bg-gray-200 h-4 w-48 rounded mb-3" />
          <View className="flex-row justify-between pt-2 border-t border-gray-200">
            <View className="bg-gray-200 h-4 w-20 rounded" />
            <View className="bg-gray-200 h-4 w-16 rounded" />
          </View>
        </View>
      ))}
    </View>
  );
}

function EmptyState() {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <Text className="text-6xl mb-4">📖</Text>
      <Text className="text-xl font-semibold text-gray-800 mb-2">
        No Sessions Yet
      </Text>
      <Text className="text-gray-500 text-center">
        Start tracking your Quran practice by creating your first session.
      </Text>
    </View>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <Text className="text-6xl mb-4">⚠️</Text>
      <Text className="text-xl font-semibold text-gray-800 mb-2">
        Something went wrong
      </Text>
      <Text className="text-gray-500 text-center mb-4">{message}</Text>
      <Text
        className="text-primary font-medium"
        onPress={onRetry}
      >
        Tap to retry
      </Text>
    </View>
  );
}

export default function SessionsScreen() {
  const router = useRouter();
  const { data: sessions, isLoading, isError, error, refetch, isRefetching } = useSessions();

  const handleEdit = useCallback((sessionId: string) => {
    router.push(`/session/edit/${sessionId}` as Href);
  }, [router]);

  const handleDelete = useCallback((sessionId: string) => {
    // Will be handled by delete confirmation in a future task
    console.log('Delete session:', sessionId);
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: SessionWithRelations; index: number }) => (
      <SessionCard
        testID={`session-card-${index}`}
        session={item}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    ),
    [handleEdit, handleDelete]
  );

  const keyExtractor = useCallback(
    (item: SessionWithRelations) => item.id,
    []
  );

  if (isLoading) {
    return (
      <View testID="sessions-loading" className="flex-1 bg-gray-50">
        <LoadingSkeleton />
      </View>
    );
  }

  if (isError) {
    return (
      <View testID="sessions-error" className="flex-1 bg-gray-50">
        <ErrorState
          message={error?.message ?? 'Failed to load sessions'}
          onRetry={refetch}
        />
      </View>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <View testID="sessions-empty" className="flex-1 bg-gray-50">
        <EmptyState />
      </View>
    );
  }

  return (
    <View testID="session-list" className="flex-1 bg-gray-50">
      <FlatList
        data={sessions}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerClassName="p-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#6366F1"
          />
        }
        ListHeaderComponent={
          <Text className="text-sm text-gray-500 mb-3">
            {sessions.length} session{sessions.length !== 1 ? 's' : ''}
          </Text>
        }
      />
    </View>
  );
}
