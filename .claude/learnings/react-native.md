# React Native Issues

## Layout thrashing when sibling component heights change

**Symptom:** Sibling components appear blank or displaced when another component changes height (e.g., stats cards go blank when chart filter changes)
**Cause:** Components using `flex-1` without minimum height collapse during ScrollView relayout when sibling heights change
**Fix:**
1. Remove `flex-1` from cards and use explicit `minHeight`:
```typescript
// BAD - vulnerable to collapse
<View className="flex-1 rounded-xl p-4">

// GOOD - stable height
<View className="rounded-xl p-4" style={{ minHeight: 110 }}>
```
2. Ensure components with multiple states (loading/empty/content) have consistent total height:
```typescript
const CHART_HEIGHT = 180;
const LEGEND_HEIGHT = 32;
const TOTAL_CONTENT_HEIGHT = CHART_HEIGHT + LEGEND_HEIGHT;

// Use TOTAL_CONTENT_HEIGHT for ALL states
{showEmpty && <View style={{ height: TOTAL_CONTENT_HEIGHT }} />}
{showChart && <Svg height={CHART_HEIGHT} /> /* + legend adds ~32px */}
```
**Prevention:** When building dashboard layouts with multiple independent sections, ensure each section maintains consistent height across all states and use explicit minHeight instead of flex-based sizing

## NativeWind flex-wrap doesn't constrain height properly

**Symptom:** Grid items using `flex-wrap` overflow and overlap with content below
**Cause:** `flex-row flex-wrap` with `flex-1 min-w-[45%]` doesn't create proper row breaks in React Native
**Fix:** Use explicit row containers instead of flex-wrap:
```typescript
// BAD - causes overlap
<View className="flex-row flex-wrap gap-3">
  <View className="flex-1 min-w-[45%]">...</View>
</View>

// GOOD - explicit rows
<View>
  <View className="flex-row gap-3 mb-3">
    <View className="flex-1">...</View>
    <View className="flex-1">...</View>
  </View>
</View>
```
**Prevention:** For 2x2 or grid layouts in React Native, use explicit row containers rather than flex-wrap

## Grid/heatmap with fixed cell sizes doesn't fill container

**Symptom:** Heatmap/grid has wasted space on the right, or month labels overlap because cells are too small
**Cause:** Using fixed `CELL_SIZE` constant doesn't adapt to available container width
**Fix:** Calculate cell size dynamically based on container width using `onLayout`:
```typescript
const [containerWidth, setContainerWidth] = useState(0);

const cellSize = useMemo(() => {
  if (containerWidth === 0) return 14; // Default fallback
  const availableWidth = containerWidth - padding - labelWidth;
  const totalGaps = (numColumns - 1) * gapSize;
  const calculatedSize = Math.floor((availableWidth - totalGaps) / numColumns);
  return Math.max(12, Math.min(28, calculatedSize)); // Clamp to reasonable range
}, [containerWidth]);

<View onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
```
**Prevention:** For grids/heatmaps that should fill available space, use dynamic sizing based on container width rather than fixed cell sizes
