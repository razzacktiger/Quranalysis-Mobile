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
