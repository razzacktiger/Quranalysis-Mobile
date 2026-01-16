# EPIC-5: User Profile

**Goal:** Users can view their profile and manage settings.
**Estimate:** 4 tasks, ~1500 tokens total
**Deps:** EPIC-0, EPIC-1
**Priority:** Low - implement last

---

## User Stories

- US-5.1: As a user, I can see my profile information
- US-5.2: As a user, I can view my account statistics
- US-5.3: As a user, I can sign out

---

## Feature 5.1: Profile Screen

### Task 5.1.1: Create Profile Header Component

**Size:** S (~400 tokens)
**Files:** `components/profile/ProfileHeader.tsx`
**Deps:** 1.1.2

**Acceptance Criteria:**
- [ ] Displays user avatar (from Google)
- [ ] Displays user name
- [ ] Displays user email
- [ ] Styled with NativeWind
- [ ] Handles missing avatar gracefully

**Test:**
```bash
npx expo start --ios
# Verify profile info displays correctly
```

**Promise:** `<promise>5.1.1-DONE</promise>`

---

### Task 5.1.2: Create Account Stats Component

**Size:** S (~400 tokens)
**Files:** `components/profile/AccountStats.tsx`
**Deps:** 3.1.2

**Acceptance Criteria:**
- [ ] Total sessions count
- [ ] Member since date
- [ ] Total practice time (sum of durations)
- [ ] Most practiced surah
- [ ] Styled consistently

**Test:**
```bash
npx expo start --ios
# Verify stats display on profile
```

**Promise:** `<promise>5.1.2-DONE</promise>`

---

### Task 5.1.3: Create Profile Screen

**Size:** M (~500 tokens)
**Files:** `app/(tabs)/profile.tsx`
**Deps:** 5.1.1, 5.1.2, 1.4.1

**Acceptance Criteria:**
- [ ] Profile header at top
- [ ] Account stats section
- [ ] Settings section (placeholder for future)
- [ ] Sign out button
- [ ] About/Help links (external URLs)
- [ ] App version display

**Test:**
```bash
npx expo start --ios
# Verify profile screen renders
# Test sign out button
```

**Layout:**
```
[Avatar + Name + Email]

--- Account ---
[Total Sessions: X]
[Practice Time: X hours]
[Member Since: Date]

--- Settings ---
[Theme Toggle] (optional/post-MVP)
[Notifications] (post-MVP)

--- About ---
[Help & Support]
[Privacy Policy]
[Version 1.0.0]

[Sign Out Button]
```

**Promise:** `<promise>5.1.3-DONE</promise>`

---

### Task 5.1.4: E2E Test - Profile Screen

**Size:** S (~400 tokens)
**Files:** `tests/e2e/profile/main.yaml`, `tests/e2e/profile/signout.yaml`
**Deps:** 5.1.3, 0.5.1

**Maestro Tests:**

**tests/e2e/profile/main.yaml:**
```yaml
appId: com.quranalysis.mobile
name: Profile - Screen Elements
---
- launchApp

# Navigate to profile tab
- tapOn: "Profile"

# Verify profile header elements
- assertVisible:
    id: "profile-header"
- assertVisible:
    id: "user-avatar"
- assertVisible:
    id: "user-name"
- assertVisible:
    id: "user-email"

# Verify account stats section
- assertVisible: "Account"
- assertVisible:
    id: "stat-total-sessions"
- assertVisible:
    id: "stat-member-since"

# Verify about section
- assertVisible: "About"
- assertVisible: "Help & Support"
- assertVisible: "Privacy Policy"

# Verify sign out button is present
- assertVisible:
    id: "sign-out-button"

# Verify version is displayed
- assertVisible: "Version"
```

**tests/e2e/profile/signout.yaml:**
```yaml
appId: com.quranalysis.mobile
name: Profile - Sign Out Flow
---
- launchApp

# Navigate to profile tab
- tapOn: "Profile"

# Tap sign out button
- tapOn:
    id: "sign-out-button"

# Confirm sign out if dialog appears
- tapOn:
    text: "Sign Out"
    optional: true

# Verify redirected to login screen
- assertVisible: "Sign in with Google"
```

**Test:**
```bash
maestro test tests/e2e/profile/main.yaml
maestro test tests/e2e/profile/signout.yaml
```

**Promise:** `<promise>5.1.4-DONE</promise>`

**Notes:**
- Sign out test will require re-authentication to continue other tests
- Consider running sign out test last in test suite

---

## 🧑‍💻 Human QA: Feature 5.1 (Profile Screen)

- [ ] Profile header shows correct user info from Google
- [ ] Avatar loads properly (or shows placeholder)
- [ ] Stats are accurate
- [ ] External links open correctly (Help, Privacy)
- [ ] Version number matches app.json
- [ ] All Maestro tests pass: `maestro test tests/e2e/profile/`

---

## Feature 5.2: Settings (Optional)

### Task 5.2.1: Add Theme Toggle

**Size:** S (~300 tokens)
**Files:** `lib/hooks/useTheme.ts`, `app/(tabs)/profile.tsx` (update)
**Deps:** 5.1.3
**Priority:** Optional - skip if time constrained

**Acceptance Criteria:**
- [ ] Theme state persisted in AsyncStorage
- [ ] Toggle switch on profile
- [ ] App respects theme setting
- [ ] Default to system preference

**Test:**
```bash
npx expo start --ios
# Toggle theme, verify colors change
# Restart app, verify theme persists
```

**Promise:** `<promise>5.2.1-DONE</promise>`

---

## 🧑‍💻 Human QA: EPIC-5

**After all tasks:**
- [ ] Profile shows correct user info
- [ ] Stats are accurate
- [ ] Sign out works
- [ ] Links open correctly

---

## Dependencies Graph

```
5.1.1 (Header) ← 1.1.2 (Auth)
5.1.2 (Stats) ← 3.1.2 (useStats)
       ↓
5.1.3 (Screen)
       ↓
5.1.4 (E2E Tests) → **Human QA**
       ↓
5.2.1 (Theme) - optional
```

**Recommended Order:**
1. 5.1.1 → 5.1.2 → 5.1.3 → 5.1.4 (E2E Tests) → **Human QA**
2. 5.2.1 (optional)
