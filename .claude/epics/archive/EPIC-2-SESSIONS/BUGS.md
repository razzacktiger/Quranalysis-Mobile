# EPIC-2: Sessions Bugs

**Epic:** Sessions
**Last Updated:** 2026-01-22

---

## Bug Severity Guide

| Level | Name | Description | Blocks Completion |
|-------|------|-------------|-------------------|
| 1 | Critical | Crashes, data loss, security issues | Yes |
| 2 | High | Feature broken, blocks user flow | Yes |
| 3 | Medium | Feature degraded but usable | No |
| 4 | Low | Cosmetic, minor UX issues | No |

---

## Open Bugs

## BUG-2.1: Invalid ayah range accepted when adding session portions

**Severity:** 2 (High) | **Status:** Open
**Found In:** Manual testing | **Found Date:** 2026-01-22
**Files:** `components/sessions/PortionInput.tsx`, `lib/utils/validation.ts` (suspected)

### Description
When adding a session with a portion, the app accepts ayah ranges that exceed the actual number of ayahs in a surah. For example, Surah Maryam (19) has 98 ayahs, but the app allowed "30-100" as a valid range and saved it to the database.

### Reproduction Steps
1. Navigate to Add Session screen
2. Add a portion for Surah Maryam
3. Enter "30" as start ayah, "100" as end ayah
4. Save the session
5. Observe that the session is saved with invalid ayah range (100 > 98)

### Expected Behavior
- The app should validate that the end ayah does not exceed the surah's total ayah count
- User should see an error message like "Surah Maryam only has 98 ayahs"
- The form should not submit until valid ayah boundaries are entered

### Actual Behavior
- The invalid range is accepted
- Session is saved to database with incorrect data
- Session details show "Ayahs 30 - 100" for Surah Maryam which is impossible

### Notes
- Need to implement validation against surah metadata (ayah count per surah)
- Surah data likely exists in `lib/data/surahs.ts` or similar
- Also need to validate: start ayah > 0, start ayah <= end ayah
- Consider edge cases: juz boundaries, partial surah recitations

---

---

## Fixed Bugs

_No fixed bugs yet._
