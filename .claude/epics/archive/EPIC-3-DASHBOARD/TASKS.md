# EPIC-3: Dashboard & Analytics

**Goal:** Users see meaningful statistics and progress visualizations.
**Estimate:** 10 tasks, ~5000 tokens total
**Deps:** EPIC-0, EPIC-1, EPIC-2 (at least 2.1 for data fetching)

---

## User Stories

- US-3.1: As a user, I see my practice stats at a glance
- US-3.2: As a user, I see my practice streak
- US-3.3: As a user, I see charts of my progress over time
- US-3.4: As a user, I see my recent sessions

---

## Feature 3.1: Statistics Calculations

### Task 3.1.1: Create Stats Calculation Utils

**Size:** M (~800 tokens)
**Files:** `lib/utils/stats.ts`, `lib/utils/stats.test.ts`
**Deps:** 0.3.1

**⚠️ TDD REQUIRED - Write tests FIRST, then implement:**

**Step 1: Write tests first (stats.test.ts)**
```typescript
describe('calculateTotalSessions', () => {
  it('returns 0 for empty array', () => { /* ... */ });
  it('counts all sessions', () => { /* ... */ });
});

describe('calculateAveragePerformance', () => {
  it('returns 0 for empty array', () => { /* ... */ });
  it('calculates mean correctly', () => { /* ... */ });
  it('handles sessions without performance scores', () => { /* ... */ });
});

describe('calculateCurrentStreak', () => {
  it('returns { current: 0, best: 0 } for empty array', () => { /* ... */ });
  it('counts consecutive days', () => { /* ... */ });
  it('breaks streak on gap day', () => { /* ... */ });
  it('today counts only if session exists', () => { /* ... */ });
  it('tracks best streak separately from current', () => { /* ... */ });
});

describe('calculateMistakesByCategory', () => {
  it('returns empty object for no mistakes', () => { /* ... */ });
  it('groups by category correctly', () => { /* ... */ });
});
```

**Step 2: Run tests (should fail)**
```bash
npm test -- stats.test.ts
# Expected: All tests fail
```

**Step 3: Implement functions to make tests pass**

**Step 4: Run tests again (should pass)**
```bash
npm test -- stats.test.ts
# Expected: All tests pass
```

**Acceptance Criteria:**
- [ ] Tests written BEFORE implementation
- [ ] `calculateTotalSessions(sessions)` - count
- [ ] `calculateAveragePerformance(sessions)` - mean score
- [ ] `calculateTotalMistakes(sessions)` - sum across all
- [ ] `calculateCurrentStreak(sessions)` - consecutive days
- [ ] `calculateMistakesByCategory(sessions)` - grouped counts
- [ ] `calculateSessionsByType(sessions)` - grouped counts
- [ ] `calculateAyahsAndPages(sessions)` - totals
- [ ] All unit tests pass

**Streak Logic:**
- Count consecutive days with ≥1 session
- Today counts only if session exists
- Return { current: number, best: number }

**Promise:** `<promise>3.1.1-DONE</promise>`

---

### Task 3.1.2: Create useStats Hook

**Size:** S (~500 tokens)
**Files:** `lib/hooks/useStats.ts`
**Deps:** 3.1.1, 2.1.2

**Acceptance Criteria:**
- [ ] Derives stats from useSessions data
- [ ] Memoizes calculations (useMemo)
- [ ] Returns typed stats object
- [ ] Handles empty sessions gracefully

**Test:**
```bash
npm run typecheck
```

**Promise:** `<promise>3.1.2-DONE</promise>`

---

## Feature 3.2: Stat Cards

### Task 3.2.1: Create Stat Card Component

**Size:** S (~400 tokens)
**Files:** `components/analytics/StatCard.tsx`
**Deps:** 0.1.3

**Acceptance Criteria:**
- [ ] Displays icon, label, value
- [ ] Optional trend indicator (up/down arrow)
- [ ] Optional subtitle (e.g., "+5 this month")
- [ ] Styled with NativeWind
- [ ] Accepts custom colors
- [ ] testID for E2E

**Test:**
```bash
npx expo start --ios
# Verify StatCard renders with mock data
```

**Promise:** `<promise>3.2.1-DONE</promise>`

---

### Task 3.2.2: Create Stats Grid

**Size:** M (~600 tokens)
**Files:** `components/analytics/StatsGrid.tsx`
**Deps:** 3.2.1, 3.1.2

**Acceptance Criteria:**
- [ ] 2x2 grid layout
- [ ] Card 1: Total Sessions
- [ ] Card 2: Average Performance (with color indicator)
- [ ] Card 3: Total Mistakes (with top category)
- [ ] Card 4: Current Streak (with fire icon)
- [ ] Loading skeleton state
- [ ] testID for E2E

**Test:**
```bash
npx expo start --ios
# Verify grid displays on dashboard
```

**Promise:** `<promise>3.2.2-DONE</promise>`

---

## Feature 3.3: Charts

### Task 3.3.1: Create Activity Heatmap

**Size:** L (~1200 tokens)
**Files:** `components/analytics/ActivityHeatmap.tsx`
**Deps:** 3.1.2

**IMPORTANT - Agent Must Research:**
Verify best chart library for React Native:
- `react-native-chart-kit`
- `victory-native`
- `react-native-svg` (custom implementation)
- Check Expo compatibility

**Acceptance Criteria:**
- [ ] 7 rows (days) x 12 columns (weeks) grid
- [ ] Color intensity = sessions per day (0=gray, 1=light green, 3+=dark green)
- [ ] Shows last 12 weeks
- [ ] Tappable cells show session count
- [ ] Day labels (Mon, Wed, Fri)
- [ ] Week/month labels
- [ ] testID for E2E

**Test:**
```bash
npx expo start --ios
# Verify heatmap renders with session data
```

**Promise:** `<promise>3.3.1-DONE</promise>`

---

### Task 3.3.2: Create Performance Chart

**Size:** M (~800 tokens)
**Files:** `components/analytics/PerformanceChart.tsx`
**Deps:** 3.1.2

**Acceptance Criteria:**
- [ ] Line chart of last 30 sessions
- [ ] Y-axis: 0-10 performance score
- [ ] X-axis: session dates
- [ ] Color zones (red <5, yellow 5-7, green >7)
- [ ] Trend line overlay (optional)
- [ ] Empty state if <3 sessions
- [ ] testID for E2E

**Test:**
```bash
npx expo start --ios
# Verify chart renders with session data
```

**Promise:** `<promise>3.3.2-DONE</promise>`

---

### Task 3.3.3: Create Mistake Analysis Chart

**Size:** M (~700 tokens)
**Files:** `components/analytics/MistakeChart.tsx`
**Deps:** 3.1.2

**Acceptance Criteria:**
- [ ] Bar chart or pie chart
- [ ] Shows mistakes by category
- [ ] Color-coded by category
- [ ] Shows percentage or count
- [ ] Tappable for breakdown (optional)
- [ ] testID for E2E

**Test:**
```bash
npx expo start --ios
# Verify chart renders mistake breakdown
```

**Promise:** `<promise>3.3.3-DONE</promise>`

---

### Task 3.3.4: E2E Test - Charts

**Size:** S (~400 tokens)
**Files:** `tests/e2e/dashboard/charts.yaml`
**Deps:** 3.3.3, 0.5.1

**Maestro Test:**
```yaml
appId: com.quranalysis.mobile
name: Dashboard - Charts Render
---
- launchApp

# Verify dashboard loads
- assertVisible: "Dashboard"

# Verify charts are visible
- assertVisible:
    id: "activity-heatmap"
- assertVisible:
    id: "performance-chart"
- assertVisible:
    id: "mistake-chart"

# Test heatmap interaction
- tapOn:
    id: "heatmap-cell-today"
- assertVisible: "sessions"
```

**Test:**
```bash
maestro test tests/e2e/dashboard/charts.yaml
```

**Promise:** `<promise>3.3.4-DONE</promise>`

---

## 🧑‍💻 Human QA: Feature 3.3 (Charts)

- [ ] Heatmap colors are readable
- [ ] Performance chart is clear
- [ ] Charts resize correctly on different devices
- [ ] All Maestro tests pass

---

## Feature 3.4: Dashboard Screen

### Task 3.4.1: Create Dashboard Screen

**Size:** L (~1000 tokens)
**Files:** `app/(tabs)/index.tsx`
**Deps:** 3.2.2, 3.3.1, 3.3.2, 2.5.1

**Acceptance Criteria:**
- [ ] Welcome header with user name
- [ ] Stats grid (4 cards)
- [ ] Activity heatmap
- [ ] Performance chart (collapsible)
- [ ] Recent sessions list (last 5)
- [ ] "View All" button → sessions tab
- [ ] Pull-to-refresh
- [ ] Loading state
- [ ] Empty state for new users
- [ ] testID attributes

**Test:**
```bash
npx expo start --ios
# Verify dashboard loads with all components
# Pull to refresh
```

**Layout:**
```
[Welcome, {user.name}!]
[Stats Grid - 2x2]
[Activity Heatmap]
[Performance Chart]
[Recent Sessions]
  - Session 1
  - Session 2
  - Session 3
  [View All →]
```

**Promise:** `<promise>3.4.1-DONE</promise>`

---

### Task 3.4.2: E2E Test - Dashboard

**Size:** M (~500 tokens)
**Files:** `tests/e2e/dashboard/main.yaml`
**Deps:** 3.4.1, 0.5.1

**Maestro Test:**
```yaml
appId: com.quranalysis.mobile
name: Dashboard - Main Screen
---
- launchApp

# Verify dashboard is default tab
- assertVisible: "Welcome"

# Verify stats grid
- assertVisible:
    id: "stat-total-sessions"
- assertVisible:
    id: "stat-avg-performance"
- assertVisible:
    id: "stat-total-mistakes"
- assertVisible:
    id: "stat-streak"

# Verify recent sessions
- assertVisible: "Recent Sessions"

# Test View All navigation
- tapOn: "View All"
- assertVisible: "Sessions"

# Go back and test pull to refresh
- tapOn: "Dashboard"
- scroll:
    direction: DOWN
    duration: 500
```

**Test:**
```bash
maestro test tests/e2e/dashboard/main.yaml
```

**Promise:** `<promise>3.4.2-DONE</promise>`

---

## 🧑‍💻 Human QA: Feature 3.4 (Dashboard)

- [ ] Dashboard loads quickly (<2s)
- [ ] Stats are accurate
- [ ] Pull to refresh works
- [ ] Empty state is helpful
- [ ] All Maestro tests pass

---

## 🧑‍💻 Human QA: EPIC-3 Complete

**Final verification:**
- [ ] All stats calculate correctly (verify against raw data)
- [ ] Charts display accurate information
- [ ] Dashboard is responsive on all iPhone sizes
- [ ] All Maestro tests pass: `maestro test tests/e2e/dashboard/`

---

## Dependencies Graph

```
3.1.1 (Stats Utils)
  ↓
3.1.2 (useStats) ← 2.1.2
  ↓
3.2.1 (StatCard) → 3.2.2 (StatsGrid)
3.3.1 (Heatmap)
3.3.2 (Performance Chart)
3.3.3 (Mistake Chart) → 3.3.4 (E2E)
  ↓
3.4.1 (Dashboard) → 3.4.2 (E2E)
```

**Recommended Order:**
1. 3.1.1 → 3.1.2 (Stats layer)
2. 3.2.1 → 3.2.2 (Stat cards)
3. 3.3.1, 3.3.2, 3.3.3 → 3.3.4 (Charts - can parallel) → **Human QA**
4. 3.4.1 → 3.4.2 (Dashboard screen) → **Human QA**
