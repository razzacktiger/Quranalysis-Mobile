# EPIC-2: Session Management

**Goal:** Users can create, view, edit, and delete practice sessions with portions and mistakes.
**Estimate:** 19 tasks, ~10000 tokens total (largest epic - work by feature)
**Deps:** EPIC-0, EPIC-1 complete

---

## User Stories

- US-2.1: As a user, I can create a session with multiple portions
- US-2.2: As a user, I can log mistakes for each portion
- US-2.3: As a user, I can view my session list
- US-2.4: As a user, I can view session details
- US-2.5: As a user, I can edit existing sessions
- US-2.6: As a user, I can delete sessions

---

## Feature 2.1: Session API Layer

> **Note:** Complete this feature as a unit. All tasks are interdependent.

### Task 2.1.1: Create Session API Functions

**Size:** L (~1500 tokens)
**Files:** `lib/api/sessions.ts`
**Deps:** 0.2.1, 0.3.1

**Acceptance Criteria:**
- [ ] `fetchSessions()` - get all user sessions with portions/mistakes
- [ ] `fetchSession(id)` - get single session with relations
- [ ] `createSession(data)` - create session + portions + mistakes
- [ ] `updateSession(id, data)` - update with upsert logic
- [ ] `deleteSession(id)` - delete session (cascade)
- [ ] All functions handle errors properly
- [ ] TypeScript types match request/response types
- [ ] `npm run typecheck` passes

**Test:**
```bash
npm run typecheck
```

**Reference:** See `reference/API-PATTERNS.md` for Supabase query patterns.

**Critical Logic:**
- Create: Insert session → get ID → insert portions → map tempId to real IDs → insert mistakes
- Update: Use databaseId for existing, insert for new, delete removed

**Promise:** `<promise>2.1.1-DONE</promise>`

---

### Task 2.1.2: Create Session Hooks

**Size:** M (~1000 tokens)
**Files:** `lib/hooks/useSessions.ts`, `lib/hooks/useSessions.test.ts`
**Deps:** 2.1.1

**Acceptance Criteria:**
- [ ] `useSessions()` - fetch all sessions with React Query
- [ ] `useSession(id)` - fetch single session
- [ ] `useCreateSession()` - mutation with cache invalidation
- [ ] `useUpdateSession()` - mutation with cache invalidation
- [ ] `useDeleteSession()` - mutation with cache invalidation
- [ ] Loading, error, success states handled
- [ ] Unit tests pass

**Test:**
```bash
npm test -- useSessions.test.ts
```

**Promise:** `<promise>2.1.2-DONE</promise>`

---

## Feature 2.2: Quran Data

### Task 2.2.1: Create Surah Data File

**Size:** M (~800 tokens)
**Files:** `constants/quran-data.ts`
**Deps:** None

**Acceptance Criteria:**
- [ ] All 114 surahs with: number, name, transliteration, ayah_count, juz_start, page_start, page_end
- [ ] Helper functions: `getSurahByName()`, `getSurahByNumber()`, `getJuzForAyah()`
- [ ] `calculatePagesRead(surah, ayahStart, ayahEnd)` function
- [ ] TypeScript types for surah data
- [ ] `npm run typecheck` passes

**Test:**
```bash
npm run typecheck
# Also: manual check that Al-Fatiha has 7 ayahs, Al-Baqarah has 286, etc.
```

**Data Source:** Extract from web app's `src/data/surahs-complete.ts`

**Promise:** `<promise>2.2.1-DONE</promise>`

---

## Feature 2.3: Form Components

> **Note:** This feature has high complexity. Consider splitting tasks if blocked.

### Task 2.3.1: Create Base Form Components

**Size:** M (~800 tokens)
**Files:** `components/ui/Input.tsx`, `components/ui/Select.tsx`, `components/ui/Slider.tsx`, `components/ui/DatePicker.tsx`
**Deps:** 0.1.3 (NativeWind)

**Acceptance Criteria:**
- [ ] Input: text input with label, error state, testID
- [ ] Select: picker/dropdown with options, testID
- [ ] Slider: range slider with value display, testID
- [ ] DatePicker: date/time selection, testID
- [ ] All styled with NativeWind
- [ ] All accept React Hook Form register
- [ ] `npm run typecheck` passes

**Test:**
```bash
npm run typecheck
npx expo start --ios
# Render each component and verify styling
```

**Promise:** `<promise>2.3.1-DONE</promise>`

---

### Task 2.3.2: Create Surah Picker Component

**Size:** M (~700 tokens)
**Files:** `components/forms/SurahPicker.tsx`
**Deps:** 2.2.1, 2.3.1

**Acceptance Criteria:**
- [ ] Searchable dropdown of 114 surahs
- [ ] Shows surah name and number
- [ ] Search by name or transliteration
- [ ] Returns surah_name string on selection
- [ ] Styled consistently with other form components
- [ ] testID for E2E testing

**Test:**
```bash
npx expo start --ios
# Search "baqarah", verify Al-Baqarah appears
```

**Promise:** `<promise>2.3.2-DONE</promise>`

---

### Task 2.3.3: Create Portion Form Component

**Size:** L (~1200 tokens)
**Files:** `components/forms/PortionForm.tsx`
**Deps:** 2.3.1, 2.3.2, 0.3.1

**Acceptance Criteria:**
- [ ] Surah picker
- [ ] Ayah start/end inputs (validated against surah length)
- [ ] Repetition count input
- [ ] Recency category picker
- [ ] Auto-calculates juz_number and pages_read
- [ ] Displays calculated values
- [ ] Removable (X button)
- [ ] Uses tempId for identification
- [ ] Integrates with React Hook Form field array
- [ ] testID attributes for E2E

**Test:**
```bash
npx expo start --ios
# Add portion, select Al-Fatiha, set ayah 1-7, verify juz=1 displayed
```

**Validation:**
- ayah_end >= ayah_start
- ayah_end <= surah.ayah_count
- repetition_count > 0

**Promise:** `<promise>2.3.3-DONE</promise>`

---

### Task 2.3.4: Create Mistake Form Component

**Size:** L (~1000 tokens)
**Files:** `components/forms/MistakeForm.tsx`
**Deps:** 2.3.1, 0.3.1

**Acceptance Criteria:**
- [ ] Portion selector (dropdown of current portions by surah name)
- [ ] Error category picker
- [ ] Error subcategory picker (filtered by category)
- [ ] Severity slider (1-5)
- [ ] Ayah number input
- [ ] Optional notes textarea
- [ ] Removable (X button)
- [ ] Uses tempId and portionTempId
- [ ] testID attributes for E2E

**Test:**
```bash
npx expo start --ios
# Add mistake, select tajweed category, verify subcategories show tajweed options only
```

**Promise:** `<promise>2.3.4-DONE</promise>`

---

### Task 2.3.5: E2E Test - Form Components

**Size:** S (~400 tokens)
**Files:** `tests/e2e/forms/components.yaml`
**Deps:** 2.3.4, 0.5.1

**Maestro Test (tests/e2e/forms/components.yaml):**
```yaml
appId: com.quranalysis.mobile
name: Forms - Component Interactions
---
- launchApp
- tapOn: "Add Session"

# Test Surah Picker
- tapOn:
    id: "surah-picker"
- inputText:
    id: "surah-search"
    text: "Fatiha"
- assertVisible: "Al-Fatihah"
- tapOn: "Al-Fatihah"

# Test Slider
- assertVisible:
    id: "performance-slider"

# Test Date Picker
- tapOn:
    id: "date-picker"
- assertVisible: "Done" # Or date picker modal
```

**Test:**
```bash
maestro test tests/e2e/forms/components.yaml
```

**Promise:** `<promise>2.3.5-DONE</promise>`

---

## 🧑‍💻 Human QA: Feature 2.3 (Form Components)

- [ ] Form inputs look correct
- [ ] Surah picker search works smoothly
- [ ] Slider feels responsive
- [ ] Date picker is native-feeling

---

## Feature 2.4: Create Session Screen

### Task 2.4.1: Create Session Form Screen

**Size:** XL (~2000 tokens) - **Work incrementally**
**Files:** `app/(tabs)/add.tsx`, `components/sessions/SessionForm.tsx`
**Deps:** 2.1.2, 2.3.3, 2.3.4, 0.3.2

**Acceptance Criteria:**
- [ ] Scrollable form with all fields
- [ ] Session metadata section (date, duration, type, performance, goal, notes)
- [ ] Portions section with "Add Portion" button
- [ ] Mistakes section with "Add Mistake" button
- [ ] Form validation using Zod schema
- [ ] Submit button triggers createSession mutation
- [ ] Loading state during submission
- [ ] Success: navigate to session detail
- [ ] Error: display error message
- [ ] testID attributes throughout

**Test:**
```bash
npx expo start --ios
# Create session with 1 portion, 0 mistakes, verify saves to DB
```

**Form Structure:**
```
[Date Picker]
[Duration Input]
[Type Picker]
[Performance Slider 0-10]
[Goal Input (optional)]
[Notes Input (optional)]

--- Portions ---
[+ Add Portion]
[Portion 1 Form]
[Portion 2 Form]
...

--- Mistakes (optional) ---
[+ Add Mistake]
[Mistake 1 Form]
...

[Create Session Button]
```

**Promise:** `<promise>2.4.1-DONE</promise>`

**On Failure:**
- Check form state structure matches SessionFormData
- Verify tempId generation (use uuid)
- Check portions array not empty on submit

---

### Task 2.4.2: E2E Test - Create Session

**Size:** M (~600 tokens)
**Files:** `tests/e2e/sessions/create.yaml`
**Deps:** 2.4.1, 0.5.1

**Maestro Test (tests/e2e/sessions/create.yaml):**
```yaml
appId: com.quranalysis.mobile
name: Sessions - Create Basic Session
---
- launchApp
- tapOn: "Add Session"

# Fill session metadata
- tapOn:
    id: "session-type-picker"
- tapOn: "Memorization"

- clearText:
    id: "duration-input"
- inputText:
    id: "duration-input"
    text: "30"

# Add a portion
- tapOn: "Add Portion"
- tapOn:
    id: "surah-picker-0"
- inputText:
    id: "surah-search"
    text: "Fatiha"
- tapOn: "Al-Fatihah"
- inputText:
    id: "ayah-start-0"
    text: "1"
- inputText:
    id: "ayah-end-0"
    text: "7"

# Submit
- tapOn: "Create Session"

# Verify success
- assertVisible: "Session created"
```

**Test:**
```bash
maestro test tests/e2e/sessions/create.yaml
```

**Promise:** `<promise>2.4.2-DONE</promise>`

---

### Task 2.4.3: E2E Test - Create Session with Mistakes

**Size:** M (~600 tokens)
**Files:** `tests/e2e/sessions/create-with-mistakes.yaml`
**Deps:** 2.4.1, 0.5.1

**Maestro Test:**
```yaml
appId: com.quranalysis.mobile
name: Sessions - Create Session with Mistakes
---
- launchApp
- tapOn: "Add Session"

# Fill basic info
- tapOn:
    id: "session-type-picker"
- tapOn: "Memorization"
- inputText:
    id: "duration-input"
    text: "30"

# Add portion
- tapOn: "Add Portion"
- tapOn:
    id: "surah-picker-0"
- tapOn: "Al-Fatihah"
- inputText:
    id: "ayah-start-0"
    text: "1"
- inputText:
    id: "ayah-end-0"
    text: "7"

# Add mistake
- tapOn: "Add Mistake"
- tapOn:
    id: "mistake-portion-0"
- tapOn: "Al-Fatihah"
- tapOn:
    id: "mistake-category-0"
- tapOn: "Tajweed"
- tapOn:
    id: "mistake-subcategory-0"
- tapOn: "Ghunna"
- inputText:
    id: "mistake-ayah-0"
    text: "3"

# Submit
- tapOn: "Create Session"
- assertVisible: "Session created"
```

**Test:**
```bash
maestro test tests/e2e/sessions/create-with-mistakes.yaml
```

**Promise:** `<promise>2.4.3-DONE</promise>`

---

## 🧑‍💻 Human QA: Feature 2.4 (Create Session)

- [ ] Form scrolls smoothly
- [ ] Adding/removing portions feels intuitive
- [ ] Validation errors are clear
- [ ] Success feedback is visible
- [ ] All Maestro tests pass

---

## Feature 2.5: Session List Screen

### Task 2.5.1: Create Session Card Component

**Size:** M (~600 tokens)
**Files:** `components/sessions/SessionCard.tsx`
**Deps:** 0.3.1

**Acceptance Criteria:**
- [ ] Displays date, duration, session type
- [ ] Shows surahs practiced (comma-separated)
- [ ] Performance score with visual indicator
- [ ] Mistake count badge
- [ ] Tappable (navigates to detail)
- [ ] Swipe actions: Edit, Delete
- [ ] testID for E2E

**Test:**
```bash
npm run typecheck
npx expo start --ios
```

**Promise:** `<promise>2.5.1-DONE</promise>`

---

### Task 2.5.2: Create Session List Screen

**Size:** M (~800 tokens)
**Files:** `app/(tabs)/sessions.tsx`
**Deps:** 2.1.2, 2.5.1

**Acceptance Criteria:**
- [ ] Fetches sessions using useSessions hook
- [ ] Renders SessionCard for each session
- [ ] Pull-to-refresh functionality
- [ ] Loading skeleton while fetching
- [ ] Empty state for no sessions
- [ ] Infinite scroll or pagination (if >20 sessions)
- [ ] testID attributes

**Test:**
```bash
npx expo start --ios
# Verify sessions list loads
# Pull to refresh
```

**Promise:** `<promise>2.5.2-DONE</promise>`

---

### Task 2.5.3: Add Filters and Search

**Size:** M (~700 tokens)
**Files:** `app/(tabs)/sessions.tsx` (update), `components/sessions/SessionFilters.tsx`
**Deps:** 2.5.2

**Acceptance Criteria:**
- [ ] Filter by date range
- [ ] Filter by session type
- [ ] Filter by surah
- [ ] Search by surah name
- [ ] Filters apply without full reload
- [ ] Clear filters button
- [ ] testID attributes

**Test:**
```bash
npx expo start --ios
# Filter by type, verify list updates
# Search "fatiha", verify only matching sessions show
```

**Promise:** `<promise>2.5.3-DONE</promise>`

---

### Task 2.5.4: E2E Test - Session List

**Size:** M (~500 tokens)
**Files:** `tests/e2e/sessions/list.yaml`
**Deps:** 2.5.3, 0.5.1

**Maestro Test:**
```yaml
appId: com.quranalysis.mobile
name: Sessions - List and Filter
---
- launchApp
- tapOn: "Sessions"

# Verify list loads
- assertVisible:
    id: "session-list"

# Test search
- tapOn:
    id: "search-input"
- inputText: "Fatiha"
- assertVisible: "Al-Fatihah"

# Test filter
- tapOn: "Filters"
- tapOn: "Memorization"
- tapOn: "Apply"

# Verify pull to refresh works
- scroll:
    direction: DOWN
    duration: 500
```

**Test:**
```bash
maestro test tests/e2e/sessions/list.yaml
```

**Promise:** `<promise>2.5.4-DONE</promise>`

---

## 🧑‍💻 Human QA: Feature 2.5 (Session List)

- [ ] List scrolls smoothly with many sessions
- [ ] Cards look correct
- [ ] Swipe actions feel native
- [ ] Filters are intuitive
- [ ] All Maestro tests pass

---

## Feature 2.6: Session Detail Screen

### Task 2.6.1: Create Session Detail Screen

**Size:** L (~1000 tokens)
**Files:** `app/session/[id].tsx`
**Deps:** 2.1.2

**Acceptance Criteria:**
- [ ] Fetches session by ID from URL param
- [ ] Displays all session metadata
- [ ] Portions list (expandable)
- [ ] Mistakes grouped by portion
- [ ] Edit button (navigates to edit screen)
- [ ] Delete button (with confirmation)
- [ ] Loading state
- [ ] Error state (session not found)
- [ ] testID attributes

**Test:**
```bash
npx expo start --ios
# Navigate to session detail, verify all data displays
```

**Promise:** `<promise>2.6.1-DONE</promise>`

---

### Task 2.6.2: E2E Test - Session Detail

**Size:** S (~400 tokens)
**Files:** `tests/e2e/sessions/detail.yaml`
**Deps:** 2.6.1, 0.5.1

**Maestro Test:**
```yaml
appId: com.quranalysis.mobile
name: Sessions - View Detail
---
- launchApp
- tapOn: "Sessions"

# Tap first session
- tapOn:
    id: "session-card-0"

# Verify detail screen
- assertVisible: "Session Details"
- assertVisible: "Portions"
- assertVisible: "Edit"
- assertVisible: "Delete"
```

**Test:**
```bash
maestro test tests/e2e/sessions/detail.yaml
```

**Promise:** `<promise>2.6.2-DONE</promise>`

---

## 🧑‍💻 Human QA: Feature 2.6 (Session Detail)

- [ ] All session data displays correctly
- [ ] Portions expand/collapse smoothly
- [ ] Mistakes are readable
- [ ] All Maestro tests pass

---

## Feature 2.7: Edit Session

### Task 2.7.1: Create Edit Session Screen

**Size:** L (~1200 tokens)
**Files:** `app/session/edit/[id].tsx`
**Deps:** 2.4.1, 2.1.2

**Acceptance Criteria:**
- [ ] Pre-populates form with existing session data
- [ ] Maps database IDs to databaseId field
- [ ] Generates tempId for existing portions/mistakes
- [ ] Allows adding/removing portions and mistakes
- [ ] Submit triggers updateSession mutation
- [ ] Handles deleted portions/mistakes
- [ ] Success: navigate back to detail
- [ ] Shows unsaved changes warning on back
- [ ] testID attributes

**Test:**
```bash
npx expo start --ios
# Edit session, change duration, save, verify change persists
```

**Critical Logic:**
- Load session → convert to SessionFormData format
- Set databaseId for existing items
- On save: items with databaseId get updated, new items inserted, removed items deleted

**Promise:** `<promise>2.7.1-DONE</promise>`

---

### Task 2.7.2: E2E Test - Edit Session

**Size:** M (~500 tokens)
**Files:** `tests/e2e/sessions/edit.yaml`
**Deps:** 2.7.1, 0.5.1

**Maestro Test:**
```yaml
appId: com.quranalysis.mobile
name: Sessions - Edit Session
---
- launchApp
- tapOn: "Sessions"
- tapOn:
    id: "session-card-0"
- tapOn: "Edit"

# Verify form is pre-filled
- assertVisible:
    id: "duration-input"

# Make a change
- clearText:
    id: "duration-input"
- inputText:
    id: "duration-input"
    text: "45"

# Save
- tapOn: "Save Changes"
- assertVisible: "Session updated"

# Verify change persisted
- assertVisible: "45 min"
```

**Test:**
```bash
maestro test tests/e2e/sessions/edit.yaml
```

**Promise:** `<promise>2.7.2-DONE</promise>`

---

## 🧑‍💻 Human QA: Feature 2.7 (Edit Session)

- [ ] Edit pre-fills correctly
- [ ] Changes save properly
- [ ] Adding/removing portions works
- [ ] All Maestro tests pass

---

## Feature 2.8: Delete Session

### Task 2.8.1: Implement Delete Confirmation

**Size:** S (~400 tokens)
**Files:** `components/ui/ConfirmDialog.tsx`, `app/session/[id].tsx` (update)
**Deps:** 2.6.1, 2.1.2

**Acceptance Criteria:**
- [ ] Reusable confirmation dialog component
- [ ] Delete button shows "Are you sure?" dialog
- [ ] Confirm triggers deleteSession mutation
- [ ] Success: navigate to session list
- [ ] Cancel: dismiss dialog
- [ ] testID attributes

**Test:**
```bash
npx expo start --ios
# Delete session, confirm, verify removed from list
```

**Promise:** `<promise>2.8.1-DONE</promise>`

---

### Task 2.8.2: E2E Test - Delete Session

**Size:** S (~400 tokens)
**Files:** `tests/e2e/sessions/delete.yaml`
**Deps:** 2.8.1, 0.5.1

**Maestro Test:**
```yaml
appId: com.quranalysis.mobile
name: Sessions - Delete Session
---
- launchApp
- tapOn: "Sessions"

# Note session count
- tapOn:
    id: "session-card-0"
- tapOn: "Delete"

# Confirm dialog
- assertVisible: "Are you sure"
- tapOn: "Confirm"

# Verify deleted
- assertVisible: "Session deleted"
- assertVisible: "Sessions" # Back on list
```

**Test:**
```bash
maestro test tests/e2e/sessions/delete.yaml
```

**Promise:** `<promise>2.8.2-DONE</promise>`

---

## 🧑‍💻 Human QA: Feature 2.8 (Delete Session)

- [ ] Delete confirmation is clear
- [ ] Deletion is immediate
- [ ] All Maestro tests pass

---

## 🧑‍💻 Human QA: EPIC-2 Complete

**Final verification:**
- [ ] Full CRUD workflow works end-to-end
- [ ] Data consistency between create/edit/delete
- [ ] Performance acceptable with many sessions
- [ ] All Maestro tests pass: `maestro test tests/e2e/sessions/`

---

## Dependencies Graph

```
Feature 2.1 (API):
  2.1.1 → 2.1.2

Feature 2.2 (Data):
  2.2.1 (independent)

Feature 2.3 (Forms):
  2.3.1 → 2.3.2 → 2.3.3 → 2.3.4 → 2.3.5 (E2E)

Feature 2.4 (Create):
  2.4.1 → 2.4.2 (E2E) → 2.4.3 (E2E)

Feature 2.5 (List):
  2.5.1 → 2.5.2 → 2.5.3 → 2.5.4 (E2E)

Feature 2.6 (Detail):
  2.6.1 → 2.6.2 (E2E)

Feature 2.7 (Edit):
  2.7.1 → 2.7.2 (E2E)

Feature 2.8 (Delete):
  2.8.1 → 2.8.2 (E2E)
```

**Recommended Order:**
1. 2.2.1 (Quran data - no deps)
2. 2.1.1 → 2.1.2 (API layer)
3. 2.3.1 → 2.3.2 → 2.3.3 → 2.3.4 → 2.3.5 (Forms) → **Human QA**
4. 2.4.1 → 2.4.2 → 2.4.3 (Create) → **Human QA**
5. 2.5.1 → 2.5.2 → 2.5.3 → 2.5.4 (List) → **Human QA**
6. 2.6.1 → 2.6.2 (Detail) → **Human QA**
7. 2.7.1 → 2.7.2 (Edit) → **Human QA**
8. 2.8.1 → 2.8.2 (Delete) → **Human QA**
