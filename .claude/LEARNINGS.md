# Issue Resolution Patterns

**Purpose:** Document issues encountered and their solutions for future agent sessions.

---

## How to Use This File

When you encounter and resolve an issue:
1. Add it under the appropriate category
2. Include: Symptom, Cause, Fix, Prevention
3. Keep entries concise

When starting a new session:
1. Review relevant sections before starting work
2. Check if current issue matches a known pattern

---

## Setup Issues

### create-expo-app won't overwrite existing files
**Symptom:** "The directory has files that might be overwritten" error
**Cause:** create-expo-app refuses to run in non-empty directories
**Fix:** Create in temp directory and copy files back:
```bash
npx create-expo-app ../temp-dir/app --template tabs
cp -r ../temp-dir/app/* .
rm -rf ../temp-dir
```
**Prevention:** Start with empty directory or use this workaround

<!-- Example:
### Expo CLI not found
**Symptom:** `expo: command not found`
**Cause:** Expo CLI not installed globally
**Fix:** `npm install -g expo-cli` or use `npx expo`
**Prevention:** Use `npx expo` instead of global install
-->

---

## Authentication Issues

_No entries yet_

---

## Supabase Issues

_No entries yet_

---

## React Native Issues

_No entries yet_

---

## TypeScript Issues

_No entries yet_

---

## Form/Validation Issues

### Zod v4 enum API changed
**Symptom:** TypeScript error "errorMap does not exist in type"
**Cause:** Zod v4 changed the enum options API
**Fix:** Use `message` instead of `errorMap`:
```typescript
// OLD (Zod v3)
z.enum(VALUES, { errorMap: () => ({ message: 'Invalid' }) })

// NEW (Zod v4)
z.enum(VALUES, { message: 'Invalid' })
```
**Prevention:** Check Zod version and use Context7 for current docs

---

## Build Issues

_No entries yet_

---

## Test Issues

_No entries yet_

---

## Common Mistakes

_No entries yet_

<!-- Example:
### Forgetting to handle loading state
**Symptom:** UI flashes or shows undefined
**Cause:** Rendering before data is loaded
**Fix:** Check `isLoading` before rendering data
**Prevention:** Always add loading check in query-dependent components
-->
