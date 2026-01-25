# EPIC-5: User Profile

**Status:** Complete
**Priority:** Low - implement last

## Goal
Users can view their profile and manage settings.

## Features

| ID | Feature | Status | Tasks | Folder |
|----|---------|--------|-------|--------|
| 5.1 | Profile Screen | Complete | 4/4 | [features/5.1-profile-screen](./features/5.1-profile-screen/) |
| 5.2 | Settings | Complete | 1/1 | [features/5.2-settings](./features/5.2-settings/) |

## Dependencies
- EPIC-0: Setup
- EPIC-1: Auth
- EPIC-3: Dashboard (for useStats)

## User Stories
- US-5.1: As a user, I can see my profile information
- US-5.2: As a user, I can view my account statistics
- US-5.3: As a user, I can sign out

## Execution Order
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

## Definition of Done
- [x] Profile shows correct user info
- [x] Stats are accurate
- [x] Sign out works
- [x] Links open correctly
- [x] All Maestro tests pass
- [x] Theme toggle works with system/light/dark options
- [x] Dark mode applied across entire app
