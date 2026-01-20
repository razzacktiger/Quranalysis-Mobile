# EPIC-1: Authentication

**Goal:** Users can sign in with Google and maintain authenticated sessions.
**Estimate:** 7 tasks, ~3200 tokens total
**Deps:** EPIC-0 complete

---

## User Stories

- US-1.1: As a user, I can sign in with my Google account
- US-1.2: As a user, I stay logged in across app restarts
- US-1.3: As a user, I can sign out

---

## Feature 1.1: Auth Types & Context

### Task 1.1.1: Create Auth Types

**Size:** S (~400 tokens)
**Files:** `types/auth.ts`
**Deps:** EPIC-0

**Acceptance Criteria:**
- [ ] `AuthUser` type (id, email, name, avatar_url)
- [ ] `AuthState` type (user, isLoading, isAuthenticated, error)
- [ ] `AuthContextValue` type (state + signIn, signOut methods)
- [ ] `npm run typecheck` passes

**Test:**
```bash
npm run typecheck
```

**Promise:** `<promise>1.1.1-DONE</promise>`

---

### Task 1.1.2: Create Auth Context

**Size:** M (~800 tokens)
**Files:** `lib/auth/AuthContext.tsx`, `lib/auth/index.ts`
**Deps:** 1.1.1, 0.2.1 (Supabase client)

**Acceptance Criteria:**
- [ ] AuthContext created with proper typing
- [ ] AuthProvider component wraps children
- [ ] useAuth hook exported
- [ ] Handles auth state from Supabase
- [ ] Listens to onAuthStateChange
- [ ] `npm run typecheck` passes

**Test:**
```bash
npm run typecheck
```

**Key Implementation:**
```typescript
// Listen to auth changes
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    }
  );
  return () => subscription.unsubscribe();
}, []);
```

**Promise:** `<promise>1.1.2-DONE</promise>`

---

## Feature 1.2: Google OAuth Flow

### Task 1.2.1: Implement Google Sign-In

**Size:** L (~1200 tokens)
**Files:** `lib/auth/googleAuth.ts`, `lib/auth/AuthContext.tsx` (update)
**Deps:** 1.1.2

**Acceptance Criteria:**
- [ ] `signInWithGoogle()` function implemented
- [ ] Uses expo-web-browser for OAuth flow
- [ ] Handles redirect URL correctly
- [ ] Extracts tokens from callback URL
- [ ] Sets Supabase session
- [ ] Error handling for failed auth
- [ ] Works on iOS simulator

**Test:**
```bash
npx expo start --ios
# Tap sign in, complete Google flow, verify redirect back
```

**Key Implementation Points:**
1. Use `makeRedirectUri({ scheme: "quranalysis" })`
2. Set `skipBrowserRedirect: true` in signInWithOAuth
3. Parse hash fragment from callback URL
4. Call `supabase.auth.setSession()` with tokens

**On Failure:**
- Check URL scheme is registered in app.json
- Verify Google OAuth is configured in Supabase dashboard
- Check redirect URL matches Supabase settings

**Promise:** `<promise>1.2.1-DONE</promise>`

---

### Task 1.2.2: Configure App Scheme

**Size:** S (~300 tokens)
**Files:** `app.json`
**Deps:** 0.1.1

**Acceptance Criteria:**
- [ ] `scheme: "quranalysis"` added to app.json
- [ ] iOS bundle identifier set
- [ ] Expo config valid

**Test:**
```bash
npx expo config --type public
# Verify scheme appears in output
```

**Promise:** `<promise>1.2.2-DONE</promise>`

---

## Feature 1.3: Auth UI

### Task 1.3.1: Create Login Screen

**Size:** M (~700 tokens)
**Files:** `app/(auth)/login.tsx`
**Deps:** 1.2.1

**Acceptance Criteria:**
- [ ] Login screen with app branding
- [ ] "Sign in with Google" button
- [ ] Loading state during auth
- [ ] Error message display
- [ ] Redirects to main app on success
- [ ] Styled with NativeWind
- [ ] testID attributes for E2E testing

**Test:**
```bash
npx expo start --ios
# Verify login screen renders
# Verify button triggers auth flow
```

**Promise:** `<promise>1.3.1-DONE</promise>`

---

### Task 1.3.2: Implement Auth Navigation Guard

**Size:** M (~600 tokens)
**Files:** `app/_layout.tsx` (update)
**Deps:** 1.1.2, 1.3.1

**Acceptance Criteria:**
- [ ] Root layout checks auth state
- [ ] Unauthenticated users see login screen
- [ ] Authenticated users see main tabs
- [ ] Shows loading spinner while checking auth
- [ ] Handles auth state changes (login/logout)

**Test:**
```bash
npx expo start --ios
# Cold start: should show login if not authenticated
# After login: should show main tabs
# After logout: should return to login
```

**Key Implementation:**
```typescript
const { user, isLoading } = useAuth();

if (isLoading) return <LoadingScreen />;
if (!user) return <Redirect href="/(auth)/login" />;
return <Stack />;
```

**Promise:** `<promise>1.3.2-DONE</promise>`

---

### Task 1.3.3: E2E Test - Auth Flow

**Size:** M (~500 tokens)
**Files:** `tests/e2e/auth/login.yaml`, `tests/e2e/auth/logout.yaml`
**Deps:** 1.3.2, 0.5.1

**Acceptance Criteria:**
- [ ] Login screen visibility test
- [ ] Sign out flow test
- [ ] Auth state persistence test (if possible)

**Maestro Tests:**

**tests/e2e/auth/login.yaml:**
```yaml
appId: com.quranalysis.mobile
name: Auth - Login Screen Visible
---
- launchApp:
    clearState: true
- assertVisible: "Sign in with Google"
- assertVisible: "Quranalysis" # App branding
```

**tests/e2e/auth/logout.yaml:**
```yaml
appId: com.quranalysis.mobile
name: Auth - Sign Out Flow
---
- launchApp
# Assumes already logged in (may need setup)
- tapOn: "Profile"
- tapOn: "Sign Out"
- assertVisible: "Sign in with Google"
```

**Test:**
```bash
maestro test tests/e2e/auth/login.yaml
maestro test tests/e2e/auth/logout.yaml
```

**Promise:** `<promise>1.3.3-DONE</promise>`

**Notes:**
- OAuth flow cannot be fully automated (requires Google login)
- Tests verify UI states, not full OAuth flow
- Consider mock auth for E2E testing

---

## Feature 1.4: Sign Out

### Task 1.4.1: Implement Sign Out

**Size:** S (~300 tokens)
**Files:** `lib/auth/AuthContext.tsx` (update)
**Deps:** 1.1.2

**Acceptance Criteria:**
- [ ] `signOut()` method in AuthContext
- [ ] Clears Supabase session
- [ ] Clears local state
- [ ] User redirected to login

**Test:**
```bash
# Manual: Sign in, then sign out, verify return to login
maestro test tests/e2e/auth/logout.yaml
```

**Promise:** `<promise>1.4.1-DONE</promise>`

---

## 🧑‍💻 Human QA: Feature 1.3 (Auth UI)

**After Auth UI tasks complete:**

- [ ] Login screen looks correct (branding, spacing)
- [ ] Button styling matches design
- [ ] Loading state feels smooth
- [ ] Error messages are readable

---

## 🧑‍💻 Human QA: EPIC-1 Complete

**After all tasks complete:**

- [ ] Can sign in with Google account
- [ ] Auth persists after app restart
- [ ] Can sign out successfully
- [ ] Protected routes redirect to login
- [ ] No auth errors in console
- [ ] All Maestro tests pass

**How to verify:**
1. Fresh install: should see login screen
2. Sign in with Google
3. Close and reopen app: should stay logged in
4. Sign out: should return to login
5. `maestro test tests/e2e/auth/`

**Known Issues to Watch:**
- iOS simulator may have issues with Google OAuth
- Test on physical device if simulator fails

---

## Dependencies Graph

```
1.1.1 (Types)
  ↓
1.1.2 (Context) ← 0.2.1 (Supabase)
  ↓
1.2.1 (Google Sign-In) ← 1.2.2 (App Scheme)
  ↓
1.3.1 (Login Screen)
  ↓
1.3.2 (Nav Guard)
  ↓
1.3.3 (E2E Tests) ← 0.5.1 (Maestro)

1.4.1 (Sign Out) ← 1.1.2
```

**Recommended Order:** 1.2.2 → 1.1.1 → 1.1.2 → 1.2.1 → 1.3.1 → 1.3.2 → 1.4.1 → 1.3.3
