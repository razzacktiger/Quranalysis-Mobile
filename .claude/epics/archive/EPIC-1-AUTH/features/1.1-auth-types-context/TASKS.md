# Feature 1.1: Auth Types & Context

**Status:** ✅ Complete

## Tasks

| ID | Task | Size | Status |
|----|------|------|--------|
| 1.1.1 | Create Auth Types | S | ✅ Complete |
| 1.1.2 | Create Auth Context | M | ✅ Complete |

---

### Task 1.1.1: Create Auth Types

**Size:** S (~400 tokens)
**Files:** `types/auth.ts`
**Deps:** EPIC-0

**Acceptance Criteria:**
- [x] `AuthUser` type (id, email, name, avatar_url)
- [x] `AuthState` type (user, isLoading, isAuthenticated, error)
- [x] `AuthContextValue` type (state + signIn, signOut methods)
- [x] `npm run typecheck` passes

---

### Task 1.1.2: Create Auth Context

**Size:** M (~800 tokens)
**Files:** `lib/auth/AuthContext.tsx`, `lib/auth/index.ts`
**Deps:** 1.1.1, 0.2.1 (Supabase client)

**Acceptance Criteria:**
- [x] AuthContext created with proper typing
- [x] AuthProvider component wraps children
- [x] useAuth hook exported
- [x] Handles auth state from Supabase
- [x] Listens to onAuthStateChange
- [x] `npm run typecheck` passes
