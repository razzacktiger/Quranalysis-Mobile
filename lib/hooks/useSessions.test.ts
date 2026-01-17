// Unit tests for session hooks

// Mock the API module BEFORE imports
jest.mock('@/lib/api/sessions', () => ({
  fetchSessions: jest.fn(),
  fetchSession: jest.fn(),
  createSession: jest.fn(),
  updateSession: jest.fn(),
  deleteSession: jest.fn(),
}));

import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
  useSessions,
  useSession,
  useCreateSession,
  useUpdateSession,
  useDeleteSession,
  sessionKeys,
} from './useSessions';
import * as sessionsApi from '@/lib/api/sessions';
import type { SessionFormData } from '@/types/session';

const mockSessionsApi = sessionsApi as jest.Mocked<typeof sessionsApi>;

// Mock session data
const mockSession: sessionsApi.SessionWithRelations = {
  id: 'session-1',
  user_id: 'user-1',
  session_date: '2025-01-15T00:00:00Z',
  session_type: 'memorization',
  duration_minutes: 30,
  performance_score: 8,
  session_goal: 'Review Al-Fatiha',
  additional_notes: undefined,
  created_at: '2025-01-15T10:00:00Z',
  updated_at: '2025-01-15T10:00:00Z',
  session_portions: [
    {
      id: 'portion-1',
      session_id: 'session-1',
      surah_name: 'Al-Fatihah',
      ayah_start: 1,
      ayah_end: 7,
      juz_number: 1,
      pages_read: 1,
      repetition_count: 5,
      recency_category: 'maintenance',
      created_at: '2025-01-15T10:00:00Z',
    },
  ],
  mistakes: [],
};

// Helper to create a wrapper with QueryClientProvider
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };
}

describe('sessionKeys', () => {
  it('generates correct query keys', () => {
    expect(sessionKeys.all).toEqual(['sessions']);
    expect(sessionKeys.lists()).toEqual(['sessions', 'list']);
    expect(sessionKeys.detail('123')).toEqual(['sessions', 'detail', '123']);
  });
});

describe('useSessions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches sessions successfully', async () => {
    mockSessionsApi.fetchSessions.mockResolvedValueOnce([mockSession]);

    const { result } = renderHook(() => useSessions(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual([mockSession]);
    expect(mockSessionsApi.fetchSessions).toHaveBeenCalledTimes(1);
  });

  it('handles fetch error', async () => {
    mockSessionsApi.fetchSessions.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useSessions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe('Network error');
  });
});

describe('useSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches single session by ID', async () => {
    mockSessionsApi.fetchSession.mockResolvedValueOnce(mockSession);

    const { result } = renderHook(() => useSession('session-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockSession);
    expect(mockSessionsApi.fetchSession).toHaveBeenCalledWith('session-1');
  });

  it('does not fetch when sessionId is undefined', () => {
    renderHook(() => useSession(undefined), {
      wrapper: createWrapper(),
    });

    expect(mockSessionsApi.fetchSession).not.toHaveBeenCalled();
  });
});

describe('useCreateSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates session successfully', async () => {
    mockSessionsApi.createSession.mockResolvedValueOnce(mockSession);

    const { result } = renderHook(() => useCreateSession(), {
      wrapper: createWrapper(),
    });

    const formData: SessionFormData = {
      session_date: '2025-01-15T00:00:00Z',
      session_type: 'memorization',
      duration_minutes: 30,
      performance_score: 8,
      session_goal: 'Review Al-Fatiha',
      portions: [
        {
          tempId: 'temp-1',
          surah_name: 'Al-Fatihah',
          ayah_start: 1,
          ayah_end: 7,
          repetition_count: 5,
          recency_category: 'maintenance',
        },
      ],
      mistakes: [],
    };

    result.current.mutate(formData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockSessionsApi.createSession).toHaveBeenCalledWith(formData);
  });
});

describe('useUpdateSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('updates session successfully', async () => {
    const updatedSession = { ...mockSession, duration_minutes: 45 };
    mockSessionsApi.updateSession.mockResolvedValueOnce(updatedSession);

    const { result } = renderHook(() => useUpdateSession(), {
      wrapper: createWrapper(),
    });

    const formData: SessionFormData = {
      session_date: '2025-01-15T00:00:00Z',
      session_type: 'memorization',
      duration_minutes: 45,
      performance_score: 8,
      portions: [
        {
          tempId: 'temp-1',
          databaseId: 'portion-1',
          surah_name: 'Al-Fatihah',
          ayah_start: 1,
          ayah_end: 7,
          repetition_count: 5,
          recency_category: 'maintenance',
        },
      ],
      mistakes: [],
    };

    result.current.mutate({ sessionId: 'session-1', data: formData });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockSessionsApi.updateSession).toHaveBeenCalledWith('session-1', formData);
  });
});

describe('useDeleteSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deletes session successfully', async () => {
    mockSessionsApi.deleteSession.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useDeleteSession(), {
      wrapper: createWrapper(),
    });

    result.current.mutate('session-1');

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockSessionsApi.deleteSession).toHaveBeenCalledWith('session-1');
  });
});
