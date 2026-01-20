# Feature 5.1: Profile Screen

## Overview
Display user profile information, account statistics, and sign out functionality.

## Tasks

| ID | Task | Size | Status | TDD | UI | Notes |
|----|------|------|--------|-----|----|----|
| 5.1.1 | Create Profile Header Component | S | Not Started | - | Yes | Avatar, name, email |
| 5.1.2 | Create Account Stats Component | S | Not Started | - | Yes | Uses useStats |
| 5.1.3 | Create Profile Screen | M | Not Started | - | Yes | Combines all |
| 5.1.4 | E2E Test - Profile Screen | S | Not Started | - | - | main.yaml, signout.yaml |

## Acceptance Criteria
- [ ] Profile header shows correct user info from Google
- [ ] Avatar loads properly (or shows placeholder)
- [ ] Stats are accurate (reuses useStats)
- [ ] Sign out works and redirects to login
- [ ] External links open correctly (Help, Privacy)

## Screen Layout
```
┌─────────────────────────────┐
│ [Avatar]                    │
│ User Name                   │
│ user@email.com              │
├─────────────────────────────┤
│ Account                     │
│ Total Sessions: X           │
│ Practice Time: X hours      │
│ Member Since: Date          │
├─────────────────────────────┤
│ About                       │
│ Help & Support  [>]         │
│ Privacy Policy  [>]         │
│ Version 1.0.0               │
├─────────────────────────────┤
│ [Sign Out Button]           │
└─────────────────────────────┘
```

## Dependencies
- 1.1.2 (Auth Context - for user info)
- 3.1.2 (useStats - for account stats)
- 1.4.1 (Sign Out - for button)
