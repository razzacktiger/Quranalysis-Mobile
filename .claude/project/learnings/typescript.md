# TypeScript Issues

## Zod inferred types vs custom TypeScript types mismatch

**Symptom:** Type error when using `useForm<CustomType>` with `zodResolver(schema)` - Zod infers `number` but custom type expects union like `1 | 2 | 3 | 4 | 5`
**Cause:** Zod's `z.number().min(1).max(5)` infers to `number`, not a literal union type
**Fix:** Use Zod's inferred type for the form, then cast when passing to components or mutations:
```typescript
import { type SessionFormSchemaType } from '@/lib/validation/session';

// Use Zod-inferred type for form
useForm<SessionFormSchemaType>({ resolver: zodResolver(schema) })

// Cast when needed
data={mistake as MistakeFormData}
await mutation.mutateAsync(data as SessionFormData)
```
**Prevention:** When forms use Zod validation, use Zod-inferred types for the form state and cast at boundaries
