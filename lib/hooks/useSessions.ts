// Session hooks using React Query for data fetching and caching

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchSessions,
  fetchSession,
  createSession,
  updateSession,
  deleteSession,
} from '@/lib/api/sessions';
import type { SessionFormData } from '@/types/session';

// Query keys for consistent cache management
export const sessionKeys = {
  all: ['sessions'] as const,
  lists: () => [...sessionKeys.all, 'list'] as const,
  list: (filters: string) => [...sessionKeys.lists(), { filters }] as const,
  details: () => [...sessionKeys.all, 'detail'] as const,
  detail: (id: string) => [...sessionKeys.details(), id] as const,
};

/**
 * Hook to fetch all sessions for the current user
 */
export function useSessions() {
  return useQuery({
    queryKey: sessionKeys.lists(),
    queryFn: fetchSessions,
  });
}

/**
 * Hook to fetch a single session by ID
 */
export function useSession(sessionId: string | undefined) {
  return useQuery({
    queryKey: sessionKeys.detail(sessionId ?? ''),
    queryFn: () => fetchSession(sessionId!),
    enabled: !!sessionId,
  });
}

/**
 * Hook for creating a new session
 * Invalidates the sessions list cache on success
 */
export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SessionFormData) => createSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
  });
}

/**
 * Hook for updating an existing session
 * Invalidates both the list and detail caches on success
 */
export function useUpdateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: string; data: SessionFormData }) =>
      updateSession(sessionId, data),
    onSuccess: (updatedSession) => {
      // Update the specific session in cache
      queryClient.setQueryData(
        sessionKeys.detail(updatedSession.id),
        updatedSession
      );
      // Invalidate the list to ensure it reflects changes
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
  });
}

/**
 * Hook for deleting a session
 * Removes from cache and invalidates the sessions list
 */
export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => deleteSession(sessionId),
    onSuccess: (_, sessionId) => {
      // Remove the session from detail cache
      queryClient.removeQueries({ queryKey: sessionKeys.detail(sessionId) });
      // Invalidate the list
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
  });
}
