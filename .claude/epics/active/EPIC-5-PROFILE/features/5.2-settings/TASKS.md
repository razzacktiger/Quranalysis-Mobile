# Feature 5.2: Settings (Optional)

**Status:** Not Started
**Priority:** Optional - skip if time constrained

## Tasks

| ID | Task | Size | Status |
|----|------|------|--------|
| 5.2.1 | Add Theme Toggle | S | Not Started |

---

### Task 5.2.1: Add Theme Toggle

**Size:** S (~300 tokens)
**Files:** `lib/hooks/useTheme.ts`, `app/(tabs)/profile.tsx` (update)
**Deps:** 5.1.3

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

---

## Notes
- This feature is optional and can be skipped if time constrained
- Focus on completing 5.1 first before attempting 5.2
