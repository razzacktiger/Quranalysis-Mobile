# Testing Issues

## Maestro with Expo Go - Complete Setup Guide

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

## Mobile E2E Testing Framework Comparison

| Framework | iOS Simulator | Physical iOS | Physical Android |
|-----------|---------------|--------------|------------------|
| Maestro   | Yes           | No           | Yes              |
| Detox     | Yes           | No           | Yes              |
| Appium    | Yes           | Yes (complex)| Yes              |

**Recommendation:**
- Use Maestro with Expo Go during development
- Switch to Detox when using development builds
- Physical iOS testing requires paid services (AWS Device Farm, BrowserStack)

## iOS Simulator Network Dropout Issue

**Symptom:** Supabase/API requests fail with "Network request failed", app shows error state
**Cause:** iOS Simulator has a known bug where network connectivity drops randomly
**Fix:** Reset simulator: Device -> Erase All Content and Settings
**Prevention:**
- Use physical device for reliable E2E testing
- Add retry logic to API calls
- Make E2E tests resilient to network failures (conditional flows)

## E2E tests require matching UI components

**Symptom:** Maestro tests fail because expected elements don't exist
**Cause:** E2E tests were written for UI that wasn't implemented yet
**Fix:** Either implement the UI first, or create minimal placeholder UI with correct testIDs
**Prevention:** Write E2E tests alongside UI implementation, not before

## Jest tests fail with AsyncStorage/Supabase errors

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
}));
```
**Prevention:** Always mock native modules and API layers that depend on env vars
