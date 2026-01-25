# Feature 2.7: Edit Session

**Status:** ✅ Complete

## Tasks

| ID | Task | Size | Status |
|----|------|------|--------|
| 2.7.1 | Create Edit Session Screen | L | ✅ Complete |
| 2.7.2 | E2E Test - Edit Session | M | ✅ Complete |

---

### Task 2.7.1: Create Edit Session Screen

**Size:** L (~1200 tokens)
**Files:** `app/session/edit/[id].tsx`
**Deps:** 2.4.1, 2.1.2

**Acceptance Criteria:**
- [x] Pre-populates form with existing session data
- [x] Maps database IDs to databaseId field
- [x] Generates tempId for existing portions/mistakes
- [x] Allows adding/removing portions and mistakes
- [x] Submit triggers updateSession mutation
- [x] Handles deleted portions/mistakes
- [x] Success: navigate back to detail
- [x] Shows unsaved changes warning on back
- [x] testID attributes

**Critical Logic:**
- Load session → convert to SessionFormData format
- Set databaseId for existing items
- On save: items with databaseId get updated, new items inserted, removed items deleted

---

### Task 2.7.2: E2E Test - Edit Session

**Size:** M (~500 tokens)
**Files:** `tests/e2e/sessions/edit.yaml`
**Deps:** 2.7.1, 0.5.1

**Acceptance Criteria:**
- [x] Maestro test for session edit
- [x] Test passes
