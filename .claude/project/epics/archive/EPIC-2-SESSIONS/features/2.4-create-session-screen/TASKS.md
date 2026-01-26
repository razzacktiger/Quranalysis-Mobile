# Feature 2.4: Create Session Screen

**Status:** ✅ Complete

## Tasks

| ID | Task | Size | Status |
|----|------|------|--------|
| 2.4.1 | Create Session Form Screen | XL | ✅ Complete |
| 2.4.2 | E2E Test - Create Session | M | ✅ Complete |
| 2.4.3 | E2E Test - Create Session with Mistakes | M | ✅ Complete |

---

### Task 2.4.1: Create Session Form Screen

**Size:** XL (~2000 tokens)
**Files:** `app/(tabs)/add.tsx`, `components/sessions/SessionForm.tsx`
**Deps:** 2.1.2, 2.3.3, 2.3.4, 0.3.2

**Acceptance Criteria:**
- [x] Scrollable form with all fields
- [x] Session metadata section (date, duration, type, performance, goal, notes)
- [x] Portions section with "Add Portion" button
- [x] Mistakes section with "Add Mistake" button
- [x] Form validation using Zod schema
- [x] Submit button triggers createSession mutation
- [x] Loading state during submission
- [x] Success: navigate to session detail
- [x] testID attributes throughout

---

### Task 2.4.2: E2E Test - Create Session

**Size:** M (~600 tokens)
**Files:** `tests/e2e/sessions/create.yaml`
**Deps:** 2.4.1, 0.5.1

**Acceptance Criteria:**
- [x] Maestro test for basic session creation
- [x] Test passes

---

### Task 2.4.3: E2E Test - Create Session with Mistakes

**Size:** M (~600 tokens)
**Files:** `tests/e2e/sessions/create-with-mistakes.yaml`
**Deps:** 2.4.1, 0.5.1

**Acceptance Criteria:**
- [x] Maestro test for session with mistakes
- [x] Test passes
