# Feature 1.3: Auth UI

**Status:** ✅ Complete

## Tasks

| ID | Task | Size | Status |
|----|------|------|--------|
| 1.3.1 | Create Login Screen | M | ✅ Complete |
| 1.3.2 | Implement Auth Navigation Guard | M | ✅ Complete |
| 1.3.3 | E2E Test - Auth Flow | M | ✅ Complete |

---

### Task 1.3.1: Create Login Screen

**Size:** M (~700 tokens)
**Files:** `app/(auth)/login.tsx`
**Deps:** 1.2.1

**Acceptance Criteria:**
- [x] Login screen with app branding
- [x] "Sign in with Google" button
- [x] Loading state during auth
- [x] Error message display
- [x] Redirects to main app on success
- [x] Styled with NativeWind
- [x] testID attributes for E2E testing

---

### Task 1.3.2: Implement Auth Navigation Guard

**Size:** M (~600 tokens)
**Files:** `app/_layout.tsx` (update)
**Deps:** 1.1.2, 1.3.1

**Acceptance Criteria:**
- [x] Root layout checks auth state
- [x] Unauthenticated users see login screen
- [x] Authenticated users see main tabs
- [x] Shows loading spinner while checking auth
- [x] Handles auth state changes (login/logout)

---

### Task 1.3.3: E2E Test - Auth Flow

**Size:** M (~500 tokens)
**Files:** `tests/e2e/auth/login.yaml`, `tests/e2e/auth/logout.yaml`
**Deps:** 1.3.2, 0.5.1

**Acceptance Criteria:**
- [x] Login screen visibility test
- [x] Sign out flow test
- [x] Auth state persistence test

**Notes:**
- OAuth flow cannot be fully automated (requires Google login)
- Tests verify UI states, not full OAuth flow
