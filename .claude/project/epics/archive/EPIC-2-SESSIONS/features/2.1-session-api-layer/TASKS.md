# Feature 2.1: Session API Layer

**Status:** ✅ Complete

## Tasks

| ID | Task | Size | Status |
|----|------|------|--------|
| 2.1.1 | Create Session API Functions | L | ✅ Complete |
| 2.1.2 | Create Session Hooks | M | ✅ Complete |

---

### Task 2.1.1: Create Session API Functions

**Size:** L (~1500 tokens)
**Files:** `lib/api/sessions.ts`
**Deps:** 0.2.1, 0.3.1

**Acceptance Criteria:**
- [x] `fetchSessions()` - get all user sessions with portions/mistakes
- [x] `fetchSession(id)` - get single session with relations
- [x] `createSession(data)` - create session + portions + mistakes
- [x] `updateSession(id, data)` - update with upsert logic
- [x] `deleteSession(id)` - delete session (cascade)
- [x] All functions handle errors properly
- [x] TypeScript types match request/response types

**Critical Logic:**
- Create: Insert session → get ID → insert portions → map tempId to real IDs → insert mistakes
- Update: Use databaseId for existing, insert for new, delete removed

---

### Task 2.1.2: Create Session Hooks

**Size:** M (~1000 tokens)
**Files:** `lib/hooks/useSessions.ts`, `lib/hooks/useSessions.test.ts`
**Deps:** 2.1.1

**Acceptance Criteria:**
- [x] `useSessions()` - fetch all sessions with React Query
- [x] `useSession(id)` - fetch single session
- [x] `useCreateSession()` - mutation with cache invalidation
- [x] `useUpdateSession()` - mutation with cache invalidation
- [x] `useDeleteSession()` - mutation with cache invalidation
- [x] Loading, error, success states handled
- [x] Unit tests pass
