# Setup Issues

## create-expo-app won't overwrite existing files

**Symptom:** "The directory has files that might be overwritten" error
**Cause:** create-expo-app refuses to run in non-empty directories
**Fix:** Create in temp directory and copy files back:
```bash
npx create-expo-app ../temp-dir/app --template tabs
cp -r ../temp-dir/app/* .
rm -rf ../temp-dir
```
**Prevention:** Start with empty directory or use this workaround

## Expo Router rejects dynamic routes that don't exist yet

**Symptom:** TypeScript error "Argument of type '`/session/${string}`' is not assignable to parameter of type..."
**Cause:** Expo Router generates strict types based on existing route files - if the route file doesn't exist yet, the path is rejected
**Fix:** Cast the path to `Href` type:
```typescript
import { type Href } from 'expo-router';
router.push(`/session/${id}` as Href);
```
**Prevention:** When building components that reference future routes, cast paths to `Href` until the route file is created
