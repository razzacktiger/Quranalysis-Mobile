# React Native / Expo Component Standards

## Component Structure

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

## Hook Rules

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

## Performance Patterns

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

## testID Conventions

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

## Component Checklist

- [ ] Props interface defined
- [ ] Default props provided where sensible
- [ ] testID on interactive elements
- [ ] Accessible labels where needed
- [ ] Memoization for expensive operations
- [ ] Error boundary consideration
