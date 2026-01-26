# Feature 5.1: Bugs

**Feature:** Profile Screen
**Last Updated:** 2026-01-24

---

## Bug Severity Guide

| Level | Name | Description | Blocks Completion |
|-------|------|-------------|-------------------|
| 1 | Critical | Crashes, data loss, security issues | Yes |
| 2 | High | Feature broken, blocks user flow | Yes |
| 3 | Medium | Feature degraded but usable | No |
| 4 | Low | Cosmetic, minor UX issues | No |

---

## Open Bugs

_No open bugs._

---

## Fixed Bugs

## BUG-5.1.1: Most Practiced Surah stat was misleading

**Severity:** 3 | **Status:** Fixed
**Found In:** Human QA | **Found Date:** 2026-01-24
**Fixed Date:** 2026-01-24
**Files:** `app/(tabs)/two.tsx`

### Description
The "Most Practiced" stat showed Al-Fatiha, but user expected the stat to factor in repetition counts.

### Root Cause
The calculation counted portion occurrences (1 per entry) instead of weighting by `repetition_count`.

### Fix
Changed calculation to sum `repetition_count` instead of counting entries:
```typescript
// Before: counts each portion entry
surahCounts[surah] = (surahCounts[surah] ?? 0) + 1;

// After: weights by repetition count
const reps = portion.repetition_count ?? 1;
surahCounts[surah] = (surahCounts[surah] ?? 0) + reps;
```

### Result
- Before: Al-Fatiha (12 entries)
- After: At-Tawbah (19 total repetitions)

---
