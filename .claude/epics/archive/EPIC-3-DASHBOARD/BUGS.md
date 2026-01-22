# EPIC-3: Dashboard Bugs

**Epic:** Dashboard
**Last Updated:** 2026-01-22

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

## BUG-3.1: Activity heatmap and streak stats not displaying session data

**Severity:** 2 (High) | **Status:** Open
**Found In:** Manual testing | **Found Date:** 2026-01-22
**Files:** `components/dashboard/ActivityHeatmap.tsx`, `components/dashboard/StatCard.tsx`, `lib/hooks/useStats.ts`

### Description
The Activity heatmap on the Dashboard shows all gray/empty squares despite having 23 sessions logged. The "Current Streak" stat card shows "0 days" when sessions exist from recent dates (Jan 20-21). The data exists and is visible in the Sessions list, but the Dashboard visualizations are not reflecting it.

### Reproduction Steps
1. Open app and navigate to Dashboard
2. Observe Activity heatmap - all squares are gray (no activity color)
3. Observe "Current Streak" card - shows "0 days" with "Best: 2"
4. Navigate to Sessions tab - see 23 sessions listed with dates

### Expected Behavior
- Activity heatmap should show colored squares for days with logged sessions
- Current Streak should calculate consecutive days with sessions
- Both should reflect the actual session data

### Actual Behavior
- Activity heatmap shows all empty/gray squares
- Current Streak shows "0 days"
- Total Sessions (23) and Avg Performance (7.7) appear correct
- Total Mistakes (52) appears correct

### Notes
- Possible date/timezone mismatch between session_date storage and heatmap date calculation
- May be querying wrong date range or using incorrect date comparison
- The streak calculation may have similar date comparison issues
- Some stat cards work (Total Sessions, Avg Performance, Total Mistakes) while date-dependent ones don't (Streak, Heatmap)

---

---

## Fixed Bugs

<!-- Bugs move here after being fixed -->

_No fixed bugs yet._
