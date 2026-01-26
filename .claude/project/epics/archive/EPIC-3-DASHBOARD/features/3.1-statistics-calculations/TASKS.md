# Feature 3.1: Statistics Calculations

**Status:** ✅ Complete

## Tasks

| ID | Task | Size | Status |
|----|------|------|--------|
| 3.1.1 | Create Stats Calculation Utils | M | ✅ Complete |
| 3.1.2 | Create useStats Hook | S | ✅ Complete |

---

### Task 3.1.1: Create Stats Calculation Utils

**Size:** M (~800 tokens)
**Files:** `lib/utils/stats.ts`, `lib/utils/stats.test.ts`
**Deps:** 0.3.1

**⚠️ TDD REQUIRED**

**Acceptance Criteria:**
- [x] Tests written BEFORE implementation
- [x] `calculateTotalSessions(sessions)` - count
- [x] `calculateAveragePerformance(sessions)` - mean score
- [x] `calculateTotalMistakes(sessions)` - sum across all
- [x] `calculateCurrentStreak(sessions)` - consecutive days
- [x] `calculateMistakesByCategory(sessions)` - grouped counts
- [x] `calculateSessionsByType(sessions)` - grouped counts
- [x] `calculateAyahsAndPages(sessions)` - totals
- [x] All unit tests pass

**Streak Logic:**
- Count consecutive days with ≥1 session
- Today counts only if session exists
- Return { current: number, best: number }

---

### Task 3.1.2: Create useStats Hook

**Size:** S (~500 tokens)
**Files:** `lib/hooks/useStats.ts`
**Deps:** 3.1.1, 2.1.2

**Acceptance Criteria:**
- [x] Derives stats from useSessions data
- [x] Memoizes calculations (useMemo)
- [x] Returns typed stats object
- [x] Handles empty sessions gracefully
