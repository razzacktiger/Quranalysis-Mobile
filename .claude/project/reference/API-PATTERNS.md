# API Patterns Reference

**Backend:** Supabase (shared with web app)
**Auth:** Supabase Auth with Google OAuth

---

## Supabase Client Setup

```typescript
// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Important for React Native
  },
});
```

---

## Authentication

### Google OAuth Flow (React Native)

```typescript
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";

// 1. Get OAuth URL from Supabase
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: makeRedirectUri({ scheme: "quranalysis" }),
    skipBrowserRedirect: true,
  },
});

// 2. Open browser for OAuth
const result = await WebBrowser.openAuthSessionAsync(
  data.url,
  makeRedirectUri({ scheme: "quranalysis" })
);

// 3. Handle callback URL
if (result.type === "success") {
  const url = new URL(result.url);
  // Extract tokens from URL hash/params
  await supabase.auth.setSession({
    access_token: /* from URL */,
    refresh_token: /* from URL */,
  });
}
```

### Get Current User

```typescript
const { data: { user }, error } = await supabase.auth.getUser();
```

### Sign Out

```typescript
await supabase.auth.signOut();
```

---

## Session CRUD

### Fetch All Sessions (with portions and mistakes)

```typescript
const { data, error } = await supabase
  .from("sessions")
  .select(`
    *,
    session_portions (*),
    mistakes (*)
  `)
  .eq("user_id", user.id)
  .order("session_date", { ascending: false });
```

### Fetch Single Session

```typescript
const { data, error } = await supabase
  .from("sessions")
  .select(`
    *,
    session_portions (*),
    mistakes (*)
  `)
  .eq("id", sessionId)
  .eq("user_id", user.id)
  .single();
```

### Create Session (Transaction Pattern)

```typescript
// 1. Insert session
const { data: session, error: sessionError } = await supabase
  .from("sessions")
  .insert({
    user_id: user.id,
    session_date: formData.session_date,
    session_type: formData.session_type,
    duration_minutes: formData.duration_minutes,
    performance_score: formData.performance_score,
    session_goal: formData.session_goal,
    additional_notes: formData.additional_notes,
  })
  .select()
  .single();

if (sessionError) throw sessionError;

// 2. Insert portions (with session_id)
const portionsToInsert = formData.portions.map((p, index) => ({
  session_id: session.id,
  surah_name: p.surah_name,
  ayah_start: p.ayah_start,
  ayah_end: p.ayah_end,
  juz_number: p.juz_number,
  pages_read: p.pages_read,
  repetition_count: p.repetition_count,
  recency_category: p.recency_category,
}));

const { data: portions, error: portionsError } = await supabase
  .from("session_portions")
  .insert(portionsToInsert)
  .select();

if (portionsError) throw portionsError;

// 3. Map tempId to real portion IDs for mistakes
const tempIdToRealId = new Map();
formData.portions.forEach((p, i) => {
  tempIdToRealId.set(p.tempId, portions[i].id);
});

// 4. Insert mistakes (with session_portion_id)
const mistakesToInsert = formData.mistakes.map((m) => ({
  session_id: session.id,
  session_portion_id: tempIdToRealId.get(m.portionTempId),
  error_category: m.error_category,
  error_subcategory: m.error_subcategory,
  severity_level: m.severity_level,
  ayah_number: m.ayah_number,
  additional_notes: m.additional_notes,
}));

const { error: mistakesError } = await supabase
  .from("mistakes")
  .insert(mistakesToInsert);

if (mistakesError) throw mistakesError;
```

### Update Session

```typescript
// 1. Update session metadata
await supabase
  .from("sessions")
  .update({ ...sessionFields, updated_at: new Date().toISOString() })
  .eq("id", sessionId);

// 2. Upsert portions (use databaseId if exists)
for (const portion of formData.portions) {
  if (portion.databaseId) {
    await supabase
      .from("session_portions")
      .update({ ...portionFields })
      .eq("id", portion.databaseId);
  } else {
    await supabase
      .from("session_portions")
      .insert({ session_id: sessionId, ...portionFields });
  }
}

// 3. Delete removed portions
const existingPortionIds = formData.portions
  .filter((p) => p.databaseId)
  .map((p) => p.databaseId);

await supabase
  .from("session_portions")
  .delete()
  .eq("session_id", sessionId)
  .not("id", "in", `(${existingPortionIds.join(",")})`);

// 4. Similar pattern for mistakes
```

### Delete Session

```typescript
// Cascade delete handles portions and mistakes
const { error } = await supabase
  .from("sessions")
  .delete()
  .eq("id", sessionId)
  .eq("user_id", user.id); // Security check
```

---

## React Query Integration

```typescript
// hooks/useSession.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useSessions() {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: fetchSessions,
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}
```

---

## Error Handling Pattern

```typescript
try {
  const { data, error } = await supabase.from("sessions").select();

  if (error) {
    // Supabase error (auth, RLS, etc)
    throw new Error(error.message);
  }

  return data;
} catch (err) {
  // Network error or thrown error
  console.error("API Error:", err);
  throw err;
}
```

---

## RLS (Row Level Security)

Database has RLS policies - users can only access their own data:
- `sessions`: `user_id = auth.uid()`
- `session_portions`: via `session_id` → `sessions.user_id`
- `mistakes`: via `session_id` → `sessions.user_id`

Always include `user_id` filter as extra safety layer.
