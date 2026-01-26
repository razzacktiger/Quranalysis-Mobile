# Form/Validation Issues

## Zod v4 enum API changed

**Symptom:** TypeScript error "errorMap does not exist in type"
**Cause:** Zod v4 changed the enum options API
**Fix:** Use `message` instead of `errorMap`:
```typescript
// OLD (Zod v3)
z.enum(VALUES, { errorMap: () => ({ message: 'Invalid' }) })

// NEW (Zod v4)
z.enum(VALUES, { message: 'Invalid' })
```
**Prevention:** Check Zod version and use Context7 for current docs

## Zod optional fields require undefined, not null

**Symptom:** Form validation fails on optional fields that should be empty
**Cause:** Database returns `null` for empty fields, but Zod's `.optional()` expects `undefined`
**Fix:** Convert null to undefined when loading data into forms:
```typescript
session_goal: session.session_goal ?? undefined,
additional_notes: session.additional_notes ?? undefined,
```
**Prevention:** When loading database data into Zod-validated forms, always use `?? undefined` for optional fields

## Form default date loses time portion

**Symptom:** DateTime picker shows midnight instead of current time
**Cause:** Using `new Date().toISOString().split('T')[0]` only keeps the date, loses time
**Fix:** Store full ISO string: `new Date().toISOString()`
**Prevention:** When storing datetime values, always use full ISO string unless you explicitly only need the date

## Form values don't refresh on tab navigation

**Symptom:** Navigating back to a form shows stale data (e.g., old timestamp)
**Cause:** React Hook Form `defaultValues` only set on initial mount, not on re-focus
**Fix:** Use `useFocusEffect` to update values when screen gains focus:
```typescript
import { useFocusEffect } from '@react-navigation/native';

useFocusEffect(
  useCallback(() => {
    setValue('session_date', new Date().toISOString());
  }, [setValue])
);
```
**Prevention:** For time-sensitive fields, always add focus effect to refresh on navigation
