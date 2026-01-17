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

### Expo Router rejects dynamic routes that don't exist yet
**Symptom:** TypeScript error "Argument of type '`/session/${string}`' is not assignable to parameter of type..."
**Cause:** Expo Router generates strict types based on existing route files - if the route file doesn't exist yet, the path is rejected
**Fix:** Cast the path to `Href` type:
```typescript
import { type Href } from 'expo-router';
router.push(`/session/${id}` as Href);
```
**Prevention:** When building components that reference future routes, cast paths to `Href` until the route file is created

---

## Test Issues

### Maestro with Expo Go - Complete Setup Guide

**Context:** Maestro E2E testing requires specific configuration for Expo Go vs development builds.

**Key Findings:**

1. **Bundle ID Difference:**
   - Development build: `com.quranalysis.mobile`
   - Expo Go: `host.exp.Exponent`

2. **Expo Go launches to home screen, not your app:**
   ```yaml
   # Must tap on project name to load app
   - launchApp:
       clearState: false
   - runFlow:
       when:
         visible: "Quranalysis"
       commands:
         - tapOn: "Quranalysis"
   ```

3. **Tab bar text not accessible via Maestro:**
   - React Navigation tab labels aren't exposed in accessibility tree
   - Use coordinate-based tapping instead:
   ```yaml
   # 4 tabs evenly spaced: Home(12.5%), Sessions(37.5%), Add(62.5%), Profile(87.5%)
   - tapOn:
       point: "37%,96%"  # Sessions tab
   ```

4. **Use conditional flows for network-dependent tests:**
   ```yaml
   - runFlow:
       when:
         visible:
           id: "session-filters"
       commands:
         - tapOn:
             id: "session-filters-search"
   ```

5. **Handle multiple app states:**
   ```yaml
   # Accept loading, error, empty, or success states
   - extendedWaitUntil:
       visible:
         id: "session-list|sessions-loading|sessions-error|sessions-empty"
       timeout: 10000
   ```

**Maestro Command Syntax Notes:**
- `assertVisible` does NOT support `timeout` or `optional` properties
- Use `extendedWaitUntil` for timeouts
- `scroll` command is just `- scroll` (no direction param)
- Use `swipe` for directional scrolling: `swipe: { direction: DOWN, duration: 500 }`

---

### Mobile E2E Testing Framework Comparison

**Physical iOS device testing is restricted by Apple's security model.**

| Framework | iOS Simulator | Physical iOS | Physical Android | Notes |
|-----------|---------------|--------------|------------------|-------|
| Maestro   | ✅            | ❌           | ✅               | Easy setup, works with Expo Go |
| Detox     | ✅            | ❌           | ✅               | React Native focused, needs dev build |
| Appium    | ✅            | ✅ (complex) | ✅               | Requires Apple Developer + provisioning |

**Recommendation:**
- Use Maestro with Expo Go during development
- Switch to Detox when using development builds for more comprehensive testing
- Physical iOS testing requires paid services (AWS Device Farm, BrowserStack) or complex Appium setup

---

### Maestro Physical Device Support

**Important:** Maestro does NOT support physical iOS devices.

**Supported platforms:**
- ✅ iOS Simulators
- ✅ Physical Android devices (USB)
- ✅ Android emulators
- ❌ Physical iOS devices

**Workarounds for iOS Simulator network issues:**
1. Flush DNS cache: `sudo dscacheutil -flushcache && sudo killall -HUP mDNSResponder`
2. Disable VPN if using one
3. Reset simulator: Device → Erase All Content and Settings
4. Make tests resilient with conditional flows

---

### iOS Simulator Network Dropout Issue

**Symptom:** Supabase/API requests fail with "Network request failed", app shows error state
**Cause:** iOS Simulator has a known bug where network connectivity drops randomly
**Fix:** Reset simulator: Device → Erase All Content and Settings
**Prevention:**
- Use physical device for reliable E2E testing
- Add retry logic to API calls
- Make E2E tests resilient to network failures (conditional flows)

---

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

### Numeric inputs without bounds validation
**Symptom:** User enters value outside valid range (e.g., ayah 999 in a 7-ayah surah), database rejects
**Cause:** Relied on database validation instead of frontend validation
**Fix:** Add bounds checking in change handlers:
```typescript
if (value > maxValue) value = maxValue;
if (value < minValue) value = minValue;
```
**Prevention:** Always validate numeric inputs against known bounds at input time, not just form submission

### DatePicker datetime mode only captures date
**Symptom:** DateTime picker shows date only, time portion is midnight
**Cause:** React Native DateTimePicker doesn't support true datetime mode - need two-step (date then time)
**Fix:** Implement two-step picker flow:
1. Show date picker first
2. On date confirm, show time picker
3. Combine date + time for final value
**Prevention:** When using datetime, always implement as two-step flow on mobile

### uuid library fails in React Native
**Symptom:** `crypto.getRandomValues is not a function` error
**Cause:** React Native doesn't include Web Crypto API polyfill
**Fix:** Install and import polyfill at app entry point:
```bash
npx expo install react-native-get-random-values
```
```typescript
// At top of app/_layout.tsx (before any uuid imports)
import 'react-native-get-random-values';
```
**Prevention:** Check library requirements for React Native compatibility before using

### Missing QueryClientProvider
**Symptom:** "No QueryClient set, use QueryClientProvider to set one" error
**Cause:** React Query hooks used without provider wrapper in app root
**Fix:** Wrap app in QueryClientProvider in root layout:
```typescript
const queryClient = new QueryClient();
<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```
**Prevention:** Add QueryClientProvider when installing @tanstack/react-query

<!-- Example:
### Forgetting to handle loading state
**Symptom:** UI flashes or shows undefined
**Cause:** Rendering before data is loaded
**Fix:** Check `isLoading` before rendering data
**Prevention:** Always add loading check in query-dependent components
-->
