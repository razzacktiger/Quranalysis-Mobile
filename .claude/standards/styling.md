# NativeWind / Styling Standards

## Class Organization

```typescript
// DO: Group related classes logically
<View className="
  flex-1 bg-white           // Layout & background
  p-4 mx-2 my-1             // Spacing
  rounded-lg shadow-sm      // Decoration
">

// DON'T: Random class order
<View className="rounded-lg p-4 flex-1 shadow-sm mx-2 bg-white my-1">
```

## Responsive Patterns

```typescript
// DO: Use responsive prefixes
<Text className="text-sm md:text-base lg:text-lg">

// DO: Use safe area utilities
<View className="flex-1 pt-safe pb-safe">
```

## Color Usage

```typescript
// DO: Use semantic color names from config
<Text className="text-primary">     // Defined in tailwind.config.js
<Text className="text-gray-600">    // Standard gray scale

// DON'T: Use arbitrary colors inline
<Text className="text-[#10B981]">   // Avoid unless necessary
```

## Dark Mode (When Implemented)

```typescript
// DO: Provide both light and dark variants
<View className="bg-white dark:bg-gray-900">
<Text className="text-gray-900 dark:text-white">
```

## Layout Stability

```typescript
// BAD - vulnerable to collapse during relayout
<View className="flex-1 rounded-xl p-4">

// GOOD - stable height
<View className="rounded-xl p-4" style={{ minHeight: 110 }}>

// For components with multiple states, ensure consistent height:
const CHART_HEIGHT = 180;
const TOTAL_HEIGHT = CHART_HEIGHT + LEGEND_HEIGHT;

{showEmpty && <View style={{ height: TOTAL_HEIGHT }} />}
{showChart && <Svg height={CHART_HEIGHT} />}
```

## Grid Layouts

```typescript
// BAD - flex-wrap causes overlap in React Native
<View className="flex-row flex-wrap gap-3">
  <View className="flex-1 min-w-[45%]">...</View>
</View>

// GOOD - explicit rows
<View>
  <View className="flex-row gap-3 mb-3">
    <View className="flex-1">...</View>
    <View className="flex-1">...</View>
  </View>
  <View className="flex-row gap-3">
    <View className="flex-1">...</View>
    <View className="flex-1">...</View>
  </View>
</View>
```
