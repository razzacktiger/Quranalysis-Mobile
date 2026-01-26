# State Management Standards

## Zustand Store Pattern

```typescript
// stores/sessionStore.ts
import { create } from 'zustand';

interface SessionState {
  // State
  sessions: SessionData[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setSessions: (sessions: SessionData[]) => void;
  addSession: (session: SessionData) => void;
  clearError: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  sessions: [],
  isLoading: false,
  error: null,

  setSessions: (sessions) => set({ sessions }),
  addSession: (session) => set((state) => ({
    sessions: [...state.sessions, session]
  })),
  clearError: () => set({ error: null }),
}));
```

## React Query Patterns

```typescript
// DO: Use query keys consistently
const queryKeys = {
  sessions: ['sessions'] as const,
  session: (id: string) => ['sessions', id] as const,
  userSessions: (userId: string) => ['sessions', 'user', userId] as const,
};

// DO: Separate queries and mutations
export function useSessions() {
  return useQuery({
    queryKey: queryKeys.sessions,
    queryFn: fetchSessions,
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions });
    },
  });
}
```

## Form State (React Hook Form)

```typescript
// DO: Use Zod resolver for validation
const form = useForm<SessionFormData>({
  resolver: zodResolver(sessionSchema),
  defaultValues: {
    session_type: 'reading_practice',
    duration_minutes: 30,
    portions: [],
  },
});

// DO: Use controlled components with Controller
<Controller
  control={form.control}
  name="duration_minutes"
  render={({ field, fieldState }) => (
    <TextInput
      value={String(field.value)}
      onChangeText={(text) => field.onChange(Number(text))}
      error={fieldState.error?.message}
      testID="duration-input"
    />
  )}
/>
```

## State Anti-Patterns

```typescript
// BAD: Storing derived state
const [sessions, setSessions] = useState([]);
const [filteredSessions, setFilteredSessions] = useState([]); // Derive instead!

// GOOD: Derive from source
const filteredSessions = useMemo(
  () => sessions.filter(s => s.type === filter),
  [sessions, filter]
);

// BAD: Mutating state directly
sessions.push(newSession);  // Creates bugs
setSessions([...sessions, newSession]);  // Correct
```

## Async State Patterns

```typescript
// BAD: Unhandled promises
useEffect(() => {
  fetchData();  // No error handling
}, []);

// GOOD: Handle all states
useEffect(() => {
  let cancelled = false;

  async function load() {
    try {
      setLoading(true);
      const data = await fetchData();
      if (!cancelled) setData(data);
    } catch (error) {
      if (!cancelled) setError(error.message);
    } finally {
      if (!cancelled) setLoading(false);
    }
  }

  load();
  return () => { cancelled = true; };
}, []);
```

## Form Focus Effect

```typescript
// Refresh time-sensitive fields on navigation
import { useFocusEffect } from '@react-navigation/native';

useFocusEffect(
  useCallback(() => {
    setValue('session_date', new Date().toISOString());
  }, [setValue])
);
```
