# Common Mistakes

## Numeric inputs without bounds validation

**Symptom:** User enters value outside valid range (e.g., ayah 999 in a 7-ayah surah), database rejects
**Cause:** Relied on database validation instead of frontend validation
**Fix:** Add bounds checking in change handlers:
```typescript
if (value > maxValue) value = maxValue;
if (value < minValue) value = minValue;
```
**Prevention:** Always validate numeric inputs against known bounds at input time, not just form submission

## DatePicker datetime mode only captures date

**Symptom:** DateTime picker shows date only, time portion is midnight
**Cause:** React Native DateTimePicker doesn't support true datetime mode - need two-step (date then time)
**Fix:** Implement two-step picker flow:
1. Show date picker first
2. On date confirm, show time picker
3. Combine date + time for final value
**Prevention:** When using datetime, always implement as two-step flow on mobile

## uuid library fails in React Native

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

## Missing QueryClientProvider

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

## Custom Views can replace chart libraries for simple visualizations

**Symptom:** Need a heatmap/contribution graph but chart libraries are heavy
**Cause:** Libraries like victory-native or react-native-chart-kit add significant bundle size
**Fix:** Build simple visualizations (heatmaps, progress bars, grids) using just View components with NativeWind colors:
```typescript
function getIntensityColor(count: number): string {
  if (count === 0) return 'bg-gray-100';
  if (count === 1) return 'bg-green-200';
  if (count === 2) return 'bg-green-400';
  return 'bg-green-600';
}
// Then use: <View className={`w-2.5 h-2.5 rounded-sm ${getIntensityColor(count)}`} />
```
**Prevention:** Before adding a chart library, consider if the visualization can be built with styled Views

## Firebase AI SDK fails with AbortSignal.any error

**Symptom:** `AbortSignal.any is not a function (it is undefined)` error when calling Firebase AI/Gemini
**Cause:** React Native doesn't include the AbortSignal.any Web API (added in newer browsers)
**Fix:** Create a polyfill and import it at app entry point:
```typescript
// lib/polyfills.ts
if (typeof AbortSignal !== 'undefined' && !AbortSignal.any) {
  AbortSignal.any = function (signals: AbortSignal[]): AbortSignal {
    const controller = new AbortController();
    for (const signal of signals) {
      if (signal.aborted) {
        controller.abort(signal.reason);
        return controller.signal;
      }
      signal.addEventListener('abort', () => controller.abort(signal.reason), { once: true });
    }
    return controller.signal;
  };
}

// At very top of app/_layout.tsx (before any Firebase imports)
import '@/lib/polyfills';
```
**Prevention:** When using Firebase AI SDK in React Native, always add the AbortSignal.any polyfill

## Workflow: Skipping /complete-task after implementation

**Symptom:** Metrics not tracked, code review skipped, commits inconsistent
**Cause:** After implementing a task and getting user approval, jumping directly to `/next-task` instead of running `/complete-task`
**Fix:** Follow the proper workflow sequence:
1. Implement task
2. Present results for user approval
3. **Prompt user:** "Shall I commit this? Run `/complete-task` when ready."
4. User runs `/complete-task` (code review, commit, metrics, status updates)
5. Then user runs `/next-task`
**Prevention:** After presenting implementation results, ALWAYS end with prompting the user to run `/complete-task`. Never suggest `/next-task` until `/complete-task` has been executed

## Task ordering: Triggers before content

**Symptom:** User can't verify UI components because there's no way to see them in the app
**Cause:** Task order has the trigger (button, navigation link) coming AFTER the content it triggers (modal, screen)
**Fix:** When planning features, order tasks so entry points come first:
1. Create trigger/shell first (button, nav link, route)
2. Then fill in the triggered content (modal body, screen content)
3. This allows visual verification at every step
**Prevention:** When creating TASKS.md, ask "Can the user see this component after implementation?" If not, reorder so the trigger comes first or together with the component
