# Feature 2.8: Delete Session

**Status:** ✅ Complete

## Tasks

| ID | Task | Size | Status |
|----|------|------|--------|
| 2.8.1 | Implement Delete Confirmation | S | ✅ Complete |
| 2.8.2 | E2E Test - Delete Session | S | ✅ Complete |

---

### Task 2.8.1: Implement Delete Confirmation

**Size:** S (~400 tokens)
**Files:** `components/ui/ConfirmDialog.tsx`, `app/session/[id].tsx` (update)
**Deps:** 2.6.1, 2.1.2

**Acceptance Criteria:**
- [x] Reusable confirmation dialog component
- [x] Delete button shows "Are you sure?" dialog
- [x] Confirm triggers deleteSession mutation
- [x] Success: navigate to session list
- [x] Cancel: dismiss dialog
- [x] testID attributes

---

### Task 2.8.2: E2E Test - Delete Session

**Size:** S (~400 tokens)
**Files:** `tests/e2e/sessions/delete.yaml`
**Deps:** 2.8.1, 0.5.1

**Acceptance Criteria:**
- [x] Maestro test for session delete
- [x] Test passes
