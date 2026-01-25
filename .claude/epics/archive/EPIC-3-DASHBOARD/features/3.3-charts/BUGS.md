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

_No open bugs._

---

## Fixed Bugs

## BUG-3.1: Activity heatmap and streak stats not displaying session data

**Severity:** 2 (High) | **Status:** Fixed
**Found In:** Manual testing | **Found Date:** 2026-01-22
**Fixed Date:** 2026-01-22 | **Fixed In:** c030d87
**Files:** `components/analytics/ActivityHeatmap.tsx`, `lib/utils/stats.ts`

### Description
The Activity heatmap on the Dashboard shows all gray/empty squares despite having 23 sessions logged. The "Current Streak" stat card shows "0 days" when sessions exist from recent dates (Jan 20-21). The data exists and is visible in the Sessions list, but the Dashboard visualizations are not reflecting it.

### Root Cause
Date format mismatch - sessions were stored with full ISO timestamps (`2025-01-21T00:00:00Z`) but the heatmap and streak calculations compared against date-only strings (`2025-01-21`). String comparison failed, so all dates showed 0 activity.

### Fix
Normalized `session_date` to `YYYY-MM-DD` format using `.split('T')[0]` in:
- `ActivityHeatmap.tsx` - sessionCountByDate calculation
- `stats.ts` - calculateCurrentStreak unique dates extraction

Added regression test for ISO timestamp format handling.

---
