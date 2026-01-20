# Human QA Checklist

## Epic Status

| Epic | Status | Notes |
|------|--------|-------|
| EPIC-0: Setup | Pending | Run `npx expo start --ios` to verify |
| EPIC-1: Auth | Pending | Test full auth flow: login, persist, logout |
| EPIC-2: Sessions | Pending | Test sessions CRUD flow |
| EPIC-3: Dashboard | Pending | Verify dashboard stats, charts, recent sessions |
| EPIC-4: AI Chat | Not Started | - |
| EPIC-5: Profile | Not Started | - |

## QA Process

1. **Per-Feature QA:**
   - Run relevant Maestro tests
   - Manual smoke test of new functionality
   - Verify error states

2. **Per-Epic QA (Before Merge):**
   - Run ALL Maestro tests for the epic
   - Manual regression test of related features
   - Check performance on device
   - Verify accessibility

3. **Final Sign-off:**
   - Mark epic as "Passed" in this file
   - Note date and any caveats
   - Epic can be merged to main

## Recent QA Results

| Date | Epic | Result | Notes |
|------|------|--------|-------|
| - | - | - | - |
