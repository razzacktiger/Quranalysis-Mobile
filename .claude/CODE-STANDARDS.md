# Code Standards & Clean Code Practices

**Project:** Quranalysis Mobile (React Native/Expo)
**Purpose:** Guide AI agents and developers to write consistent, maintainable code.

---

## 1. Project Structure

### Directory Layout

```
app/                    # Expo Router pages (file-based routing)
├── (auth)/            # Auth group (login, etc.)
├── (tabs)/            # Main tab navigation
│   ├── index.tsx      # Dashboard (default tab)
│   ├── sessions.tsx   # Sessions list
│   ├── add.tsx        # Add session
│   └── profile.tsx    # User profile
├── _layout.tsx        # Root layout
└── session/[id].tsx   # Dynamic route

components/             # Reusable components
├── ui/                # Generic UI (Button, Card, Input)
├── forms/             # Form components (SessionForm, etc.)
├── sessions/          # Session-specific components
├── analytics/         # Charts, stats components
├── ai/                # Chat, voice components
└── profile/           # Profile components

lib/                    # Business logic & utilities
├── api/               # API clients (Supabase, Gemini)
├── auth/              # Auth context & hooks
├── hooks/             # Custom React hooks
├── utils/             # Pure utility functions
├── validation/        # Zod schemas
└── voice/             # Speech recognition

types/                  # TypeScript type definitions
constants/              # App constants, enums
tests/                  # Test files
└── e2e/               # Maestro E2E tests
```

### File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `SessionCard.tsx` |
| Hooks | camelCase, use* prefix | `useStats.ts` |
| Utilities | camelCase | `formatDate.ts` |
| Types | PascalCase | `session.ts` (contains `SessionData`) |
| Constants | SCREAMING_SNAKE | `SESSION_TYPES` |
| Test files | *.test.ts | `stats.test.ts` |
| E2E tests | kebab-case.yaml | `create-session.yaml` |

---

## 2. TypeScript Standards

### Type Definitions

```typescript
// DO: Use explicit types
interface SessionCardProps {
  session: SessionData;
  onPress: (id: string) => void;
  isLoading?: boolean;
}

// DON'T: Use `any`
// DON'T: Use implicit any
function processData(data: any) { } // BAD
function processData(data: unknown) { } // BETTER
function processData(data: SessionData) { } // BEST
```

### Type Imports

```typescript
// DO: Use type imports for types only
import type { SessionData, MistakeData } from '@/types/session';
import { SESSION_TYPES } from '@/types/session';

// DON'T: Mix type and value imports unnecessarily
import { SessionData, SESSION_TYPES } from '@/types/session'; // Less clear
```

### Null Handling

```typescript
// DO: Use optional chaining and nullish coalescing
const userName = user?.name ?? 'Guest';
const sessions = data?.sessions ?? [];

// DON'T: Use truthy checks for potentially falsy valid values
const count = data.count || 0; // BAD if count can be 0
const count = data.count ?? 0; // GOOD
```

### Enums vs Union Types

```typescript
// PREFER: Union types for simple cases (better tree-shaking)
type SessionType = 'reading_practice' | 'memorization' | 'audit';

// USE: Const arrays when you need runtime iteration
const SESSION_TYPES = ['reading_practice', 'memorization', 'audit'] as const;
type SessionType = typeof SESSION_TYPES[number];

// AVOID: TypeScript enums (bundle size, complexity)
enum SessionType { } // Generally avoid
```

---

## 3. React Native / Expo Patterns

### Component Structure

```typescript
// Standard component template
import { View, Text, Pressable } from 'react-native';
import type { SessionData } from '@/types/session';

interface SessionCardProps {
  session: SessionData;
  onPress: (id: string) => void;
}

export function SessionCard({ session, onPress }: SessionCardProps) {
  // 1. Hooks first
  const { colors } = useTheme();

  // 2. Derived state
  const formattedDate = formatDate(session.created_at);

  // 3. Handlers
  const handlePress = () => onPress(session.id);

  // 4. Render
  return (
    <Pressable
      onPress={handlePress}
      testID={`session-card-${session.id}`}
      className="bg-white rounded-lg p-4 mb-2"
    >
      <Text className="text-lg font-semibold">{session.session_type}</Text>
      <Text className="text-gray-500">{formattedDate}</Text>
    </Pressable>
  );
}
```

### Hook Rules

```typescript
// DO: Custom hooks start with "use"
export function useSessions() { }
export function useStats() { }

// DO: Keep hooks focused on one concern
function useSessionForm() { }     // Form state only
function useSessionMutation() { } // API calls only

// DON'T: Create hooks that do everything
function useEverything() { } // Too broad
```

### Performance Patterns

```typescript
// DO: Memoize expensive computations
const stats = useMemo(() => calculateStats(sessions), [sessions]);

// DO: Memoize callbacks passed to children
const handlePress = useCallback((id: string) => {
  navigation.navigate('session', { id });
}, [navigation]);

// DO: Use React.memo for pure list items
export const SessionCard = React.memo(function SessionCard(props: Props) {
  // ...
});

// DON'T: Over-optimize simple components
// Only memoize when there's a measurable benefit
```

---

## 4. NativeWind / Styling

### Class Organization

```typescript
// DO: Group related classes logically
<View className="
  flex-1 bg-white           // Layout & background
  p-4 mx-2 my-1             // Spacing
  rounded-lg shadow-sm      // Decoration
">

// DON'T: Random class order
<View className="rounded-lg p-4 flex-1 shadow-sm mx-2 bg-white my-1">
```

### Responsive Patterns

```typescript
// DO: Use responsive prefixes
<Text className="text-sm md:text-base lg:text-lg">

// DO: Use safe area utilities
<View className="flex-1 pt-safe pb-safe">
```

### Color Usage

```typescript
// DO: Use semantic color names from config
<Text className="text-primary">     // Defined in tailwind.config.js
<Text className="text-gray-600">    // Standard gray scale

// DON'T: Use arbitrary colors inline
<Text className="text-[#10B981]">   // Avoid unless necessary
```

### Dark Mode (When Implemented)

```typescript
// DO: Provide both light and dark variants
<View className="bg-white dark:bg-gray-900">
<Text className="text-gray-900 dark:text-white">
```

---

## 5. State Management

### Zustand Store Pattern

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

### React Query Patterns

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

### Form State (React Hook Form)

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

---

## 6. API & Data Patterns

### Supabase Queries

```typescript
// DO: Type your queries
const { data, error } = await supabase
  .from('sessions')
  .select(`
    *,
    portions:session_portions(*),
    mistakes(*)
  `)
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .returns<FullSessionData[]>();

// DO: Handle errors consistently
if (error) {
  console.error('Failed to fetch sessions:', error);
  throw new Error(error.message);
}
```

### Error Handling

```typescript
// DO: Create typed error responses
interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

// DO: Use try-catch with specific handling
try {
  const result = await createSession(data);
  return { success: true, data: result };
} catch (error) {
  if (error instanceof ValidationError) {
    return { success: false, error: 'Invalid data provided' };
  }
  if (error instanceof NetworkError) {
    return { success: false, error: 'Network connection failed' };
  }
  return { success: false, error: 'An unexpected error occurred' };
}
```

### Data Transformation

```typescript
// DO: Transform API data at the boundary
function transformSession(raw: RawSessionData): SessionData {
  return {
    ...raw,
    created_at: new Date(raw.created_at),
    portions: raw.portions?.map(transformPortion) ?? [],
  };
}

// DON'T: Transform data in components
// Keep components focused on presentation
```

---

## 7. Testing Standards

### Testing Pyramid for This Project

```
                    ┌─────────────┐
                    │  Human QA   │  Manual verification
                    │  (Visual)   │  Feel, animations, UX
                    ├─────────────┤
                    │   E2E       │  Maestro tests
                    │  (Flows)    │  Full user journeys
                ┌───┴─────────────┴───┐
                │    Integration      │  Hooks + API together
                │   (Feature-level)   │  (Covered by E2E)
            ┌───┴─────────────────────┴───┐
            │         Unit Tests          │  Jest
            │   (Logic, Utils, Schemas)   │  Pure functions
        ┌───┴─────────────────────────────┴───┐
        │            Type Checking            │  TypeScript
        │         (Every file, always)        │  Compile-time
        └─────────────────────────────────────┘
```

### TDD Required Tasks

The following task types MUST use Test-Driven Development:

| Task Type | Why TDD | Example |
|-----------|---------|---------|
| Validation schemas | Edge cases matter | `sessionSchema` |
| Calculation utils | Math must be correct | `calculateStreak` |
| Data transformers | Shape must match | `transformSession` |
| AI parsing logic | Structured output | `parseAIResponse` |

**TDD Pattern:**
```typescript
// Step 1: Write test FIRST
describe('calculateStreak', () => {
  it('returns 0 for empty sessions', () => {
    expect(calculateStreak([])).toEqual({ current: 0, best: 0 });
  });

  it('counts consecutive days', () => {
    const sessions = [
      { created_at: '2025-01-15' },
      { created_at: '2025-01-14' },
    ];
    expect(calculateStreak(sessions).current).toBe(2);
  });
});

// Step 2: Run test - should FAIL
// Step 3: Implement function
// Step 4: Run test - should PASS
```

### Integration Testing Strategy

**Q: Do we need separate integration tests?**

**A: No - E2E tests (Maestro) serve as our integration tests.**

```
Traditional Integration Test:
  Hook + API + State → Mock responses → Assert state

Our Approach (E2E as Integration):
  Tap button → Real API call → Real DB → Real UI update → Assert visible

Why this works:
- Maestro tests the full stack
- Real Supabase calls (in dev/staging)
- Catches integration bugs
- Less test code to maintain
```

**What E2E Covers (Integration Points):**

| Integration Point | Covered By |
|-------------------|------------|
| Form → API → Database | `create-session.yaml` |
| Auth → Protected Routes | `login.yaml`, `logout.yaml` |
| API → State → UI | `session-list.yaml` |
| Chat → AI API → Extraction | `session-extraction.yaml` |
| Voice → Text → Chat | `voice-input.yaml` (UI only) |

**What E2E Cannot Cover (Need Unit Tests):**

| Logic Type | Test With |
|------------|-----------|
| Calculation correctness | Unit test (`stats.test.ts`) |
| Validation edge cases | Unit test (`session.test.ts`) |
| Date/time logic | Unit test |
| Error message formatting | Unit test |

### When to Add More Tests

**Add unit tests when:**
- [ ] Function has conditional logic (if/else, switch)
- [ ] Function does math or calculations
- [ ] Function transforms data shapes
- [ ] Function has edge cases (empty, null, boundaries)

**Add E2E tests when:**
- [ ] New user flow is added
- [ ] Critical path changes
- [ ] Bug is found in production (regression test)

### Test File Organization

```
lib/
├── utils/
│   ├── stats.ts
│   └── stats.test.ts      # Co-located unit test
├── validation/
│   ├── session.ts
│   └── session.test.ts    # Co-located unit test

tests/
└── e2e/
    ├── auth/
    │   ├── login.yaml
    │   └── logout.yaml
    ├── sessions/
    │   ├── create-basic.yaml
    │   ├── create-with-mistakes.yaml
    │   └── list.yaml
    └── dashboard/
        └── main.yaml
```

### testID Conventions

```typescript
// Pattern: {component}-{element}-{identifier?}
testID="session-card-123"
testID="duration-input"
testID="submit-button"
testID="error-message"
testID="loading-spinner"

// For lists: include index or id
testID={`session-item-${session.id}`}
testID={`portion-row-${index}`}
```

### Unit Test Structure

```typescript
// stats.test.ts
import { calculateStreak, calculateAverage } from './stats';

describe('calculateStreak', () => {
  it('returns 0 for empty sessions', () => {
    expect(calculateStreak([])).toEqual({ current: 0, best: 0 });
  });

  it('counts consecutive days correctly', () => {
    const sessions = [
      { created_at: '2025-01-15' },
      { created_at: '2025-01-14' },
      { created_at: '2025-01-13' },
    ];
    expect(calculateStreak(sessions)).toEqual({ current: 3, best: 3 });
  });

  it('breaks streak on gap', () => {
    const sessions = [
      { created_at: '2025-01-15' },
      { created_at: '2025-01-13' }, // Gap on 14th
    ];
    expect(calculateStreak(sessions)).toEqual({ current: 1, best: 1 });
  });
});
```

### E2E Test Structure (Maestro)

```yaml
# Pattern: One behavior per test file
appId: com.quranalysis.mobile
name: Sessions - Create Basic Session
---
# Setup
- launchApp

# Action
- tapOn: "Add Session"
- inputText:
    id: "duration-input"
    text: "30"
- tapOn: "Create Session"

# Assertion
- assertVisible: "Session created"
```

---

## 8. Code Quality Checklist

### Before Committing

- [ ] TypeScript compiles without errors (`npm run typecheck`)
- [ ] No `any` types (unless absolutely necessary with comment)
- [ ] All components have testID props
- [ ] Hooks follow naming convention (use*)
- [ ] No console.log statements (use proper logging)
- [ ] Error states handled in UI
- [ ] Loading states handled in UI

### Component Checklist

- [ ] Props interface defined
- [ ] Default props provided where sensible
- [ ] testID on interactive elements
- [ ] Accessible labels where needed
- [ ] Memoization for expensive operations
- [ ] Error boundary consideration

### API Integration Checklist

- [ ] Types match database schema
- [ ] Errors handled and displayed
- [ ] Loading states shown
- [ ] Optimistic updates where appropriate
- [ ] Cache invalidation on mutations

---

## 9. Common Anti-Patterns to Avoid

### Component Anti-Patterns

```typescript
// BAD: Prop drilling through many levels
<GrandParent user={user}>
  <Parent user={user}>
    <Child user={user}>  // Use context instead

// BAD: Giant components
function SessionScreen() {
  // 500 lines of code...
}  // Split into smaller components

// BAD: Business logic in components
function SessionCard() {
  const streak = sessions.filter(s => /* complex logic */);  // Move to hook/util
}
```

### State Anti-Patterns

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

### Async Anti-Patterns

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

---

## 10. Agent-Specific Guidelines

### When Implementing Tasks

1. **Read first, edit second** - Always read existing code patterns before writing
2. **Match existing style** - Follow patterns already in the codebase
3. **One concern per file** - Don't create monolithic files
4. **Test after each change** - Run typecheck and tests frequently

### File Modification Rules

```
DO:
✓ Add testID to new interactive elements
✓ Export types from module index files
✓ Update imports when moving files
✓ Add JSDoc for complex functions

DON'T:
✗ Remove existing testIDs
✗ Change export patterns without updating imports
✗ Add console.log for debugging (remove before commit)
✗ Create duplicate type definitions
```

### When Stuck

1. Check LEARNINGS.md for similar issues
2. Check existing code for patterns
3. Use Context7 for library documentation
4. Ask for clarification rather than guessing

### Quality Gates

Before marking task complete:
```bash
# Must pass
npm run typecheck
npm test -- --related

# Should run
npx expo start --ios  # Visual verification
maestro test tests/e2e/relevant-test.yaml  # E2E verification
```
