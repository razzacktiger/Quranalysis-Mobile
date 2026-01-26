# TypeScript Standards

## Type Definitions

```typescript
// DO: Use explicit types
interface SessionCardProps {
  session: SessionData;
  onPress: (id: string) => void;
  isLoading?: boolean;
}

// DON'T: Use `any`
function processData(data: any) { } // BAD
function processData(data: unknown) { } // BETTER
function processData(data: SessionData) { } // BEST
```

## Type Imports

```typescript
// DO: Use type imports for types only
import type { SessionData, MistakeData } from '@/types/session';
import { SESSION_TYPES } from '@/types/session';

// DON'T: Mix type and value imports unnecessarily
import { SessionData, SESSION_TYPES } from '@/types/session'; // Less clear
```

## Null Handling

```typescript
// DO: Use optional chaining and nullish coalescing
const userName = user?.name ?? 'Guest';
const sessions = data?.sessions ?? [];

// DON'T: Use truthy checks for potentially falsy valid values
const count = data.count || 0; // BAD if count can be 0
const count = data.count ?? 0; // GOOD
```

## Enums vs Union Types

```typescript
// PREFER: Union types for simple cases (better tree-shaking)
type SessionType = 'reading_practice' | 'memorization' | 'audit';

// USE: Const arrays when you need runtime iteration
const SESSION_TYPES = ['reading_practice', 'memorization', 'audit'] as const;
type SessionType = typeof SESSION_TYPES[number];

// AVOID: TypeScript enums (bundle size, complexity)
enum SessionType { } // Generally avoid
```

## Zod + TypeScript Integration

```typescript
// Use Zod-inferred types for forms
import { type SessionFormSchemaType } from '@/lib/validation/session';

// Zod infers `number`, not literal unions
// Cast when passing to components expecting specific types
useForm<SessionFormSchemaType>({ resolver: zodResolver(schema) })

// Cast at boundaries when needed
data={mistake as MistakeFormData}
await mutation.mutateAsync(data as SessionFormData)
```
