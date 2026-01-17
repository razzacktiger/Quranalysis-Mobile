# Issue Resolution Patterns

**Purpose:** Document issues encountered and their solutions for future agent sessions.

---

## How to Use This File

When you encounter and resolve an issue:
1. Add it under the appropriate category
2. Include: Symptom, Cause, Fix, Prevention
3. Keep entries concise

When starting a new session:
1. Review relevant sections before starting work
2. Check if current issue matches a known pattern

---

## Setup Issues

### create-expo-app won't overwrite existing files
**Symptom:** "The directory has files that might be overwritten" error
**Cause:** create-expo-app refuses to run in non-empty directories
**Fix:** Create in temp directory and copy files back:
```bash
npx create-expo-app ../temp-dir/app --template tabs
cp -r ../temp-dir/app/* .
rm -rf ../temp-dir
```
**Prevention:** Start with empty directory or use this workaround

<!-- Example:
### Expo CLI not found
**Symptom:** `expo: command not found`
**Cause:** Expo CLI not installed globally
**Fix:** `npm install -g expo-cli` or use `npx expo`
**Prevention:** Use `npx expo` instead of global install
-->

---

## Authentication Issues

### Google OAuth redirect fails in Expo Go
**Symptom:** After Google sign-in, redirects to web app instead of mobile app
**Cause:** Expo Go doesn't support custom URL schemes (quranalysis://), only exp://. Supabase doesn't redirect to exp:// URLs properly.
**Fix:** Use a development build instead of Expo Go:
```bash
npx expo install expo-dev-client
npx expo prebuild --platform ios
npx expo run:ios
```
**Prevention:** Always use development builds for OAuth testing, not Expo Go

### Auth state causes infinite render loop
**Symptom:** App flickers between loading spinner and login screen repeatedly
**Cause:** Using `<Redirect />` component causes AuthProvider to remount, resetting isLoading to true
**Fix:** Use `router.replace()` in a useEffect instead of rendering `<Redirect />`:
```typescript
useEffect(() => {
  if (isLoading) return;
  if (!user && !inAuthGroup) {
    router.replace('/(auth)/login');
  }
}, [user, isLoading]);
```
**Prevention:** Never use `<Redirect />` that could cause parent context to remount

---

## Supabase Issues

_No entries yet_

---

## React Native Issues

_No entries yet_

---

## TypeScript Issues

### Zod inferred types vs custom TypeScript types mismatch
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

---

## Form/Validation Issues

### Zod v4 enum API changed
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

---

## Build Issues

_No entries yet_

---

## Test Issues

### E2E tests require matching UI components
**Symptom:** Maestro tests fail because expected elements don't exist
**Cause:** E2E tests were written for UI that wasn't implemented yet (e.g., logout test expects Profile tab)
**Fix:** Either implement the UI first, or create minimal placeholder UI with correct testIDs:
```typescript
// Minimal component with testID for E2E testing
<Pressable testID="sign-out-button" onPress={signOut}>
  <Text>Sign Out</Text>
</Pressable>
```
**Prevention:** Write E2E tests alongside UI implementation, not before

### Jest tests fail with AsyncStorage/Supabase errors
**Symptom:** "NativeModule: AsyncStorage is null" or "supabaseUrl is required"
**Cause:** Jest tries to load real modules that depend on native code or env vars
**Fix:**
1. Create `jest.setup.js` with AsyncStorage mock:
```javascript
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
```
2. Add to jest.config.js: `setupFilesAfterEnv: ['<rootDir>/jest.setup.js']`
3. Mock API modules BEFORE imports in test files:
```typescript
jest.mock('@/lib/api/sessions', () => ({
  fetchSessions: jest.fn(),
  // ... other functions
}));
```
**Prevention:** Always mock native modules and API layers that depend on env vars

---

## Common Mistakes

_No entries yet_

<!-- Example:
### Forgetting to handle loading state
**Symptom:** UI flashes or shows undefined
**Cause:** Rendering before data is loaded
**Fix:** Check `isLoading` before rendering data
**Prevention:** Always add loading check in query-dependent components
-->
