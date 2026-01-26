# Authentication Issues

## Google OAuth redirect fails in Expo Go

**Symptom:** After Google sign-in, redirects to web app instead of mobile app
**Cause:** Expo Go doesn't support custom URL schemes (quranalysis://), only exp://. Supabase doesn't redirect to exp:// URLs properly.
**Fix:** Use a development build instead of Expo Go:
```bash
npx expo install expo-dev-client
npx expo prebuild --platform ios
npx expo run:ios
```
**Prevention:** Always use development builds for OAuth testing, not Expo Go

## Auth state causes infinite render loop

**Symptom:** App flickers between loading spinner and login screen repeatedly
**Cause:** Using `<Redirect />` component causes AuthProvider to remount, resetting isLoading to true
**Fix:** Use `router.replace()` in a useEffect instead of rendering `<Redirect />`:
```typescript
useEffect(() => {
  if (isLoading) return;
  if (!user && !inAuthGroup) {
    router.replace('/(auth)/login');
  }
}, [user, isLoading]);
```
**Prevention:** Never use `<Redirect />` that could cause parent context to remount
