# API & Data Patterns

## Supabase Queries

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

## Error Handling

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

## Data Transformation

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

## API Integration Checklist

- [ ] Types match database schema
- [ ] Errors handled and displayed
- [ ] Loading states shown
- [ ] Optimistic updates where appropriate
- [ ] Cache invalidation on mutations

## Null/Undefined Handling

```typescript
// Database returns null, Zod expects undefined for optional
// Convert when loading into forms:
session_goal: session.session_goal ?? undefined,
additional_notes: session.additional_notes ?? undefined,
```
