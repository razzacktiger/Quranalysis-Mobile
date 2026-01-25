# Feature 5.1: Profile Screen

**Status:** Not Started

## Tasks

| ID | Task | Size | Status |
|----|------|------|--------|
| 5.1.1 | Create Profile Header Component | S | Not Started |
| 5.1.2 | Create Account Stats Component | S | Not Started |
| 5.1.3 | Create Profile Screen | M | Not Started |
| 5.1.4 | E2E Test - Profile Screen | S | Not Started |

---

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
- tapOn: "Profile"
- assertVisible:
    id: "profile-header"
- assertVisible:
    id: "user-avatar"
- assertVisible: "Account"
- assertVisible:
    id: "sign-out-button"
```

**tests/e2e/profile/signout.yaml:**
```yaml
appId: com.quranalysis.mobile
name: Profile - Sign Out Flow
---
- launchApp
- tapOn: "Profile"
- tapOn:
    id: "sign-out-button"
- assertVisible: "Sign in with Google"
```

---

## Human QA: Feature 5.1

- [ ] Profile header shows correct user info from Google
- [ ] Avatar loads properly (or shows placeholder)
- [ ] Stats are accurate
- [ ] External links open correctly (Help, Privacy)
- [ ] Version number matches app.json
- [ ] All Maestro tests pass
