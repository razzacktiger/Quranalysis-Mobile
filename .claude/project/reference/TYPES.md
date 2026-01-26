# Type Reference

**Source:** Web app `src/types/session.ts`
**Last Synced:** 2025-01-15

Copy these types exactly into `types/session.ts`.

---

## Core Database Types

```typescript
// Maps directly to Supabase tables

export interface SessionData {
  id: string;
  user_id: string;
  session_date: string; // ISO string
  session_type: SessionType;
  duration_minutes: number;
  performance_score: number; // 0-10, allows decimals (0.5 increments)
  session_goal?: string;
  additional_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SessionPortion {
  id: string;
  session_id: string;
  surah_name: string;
  ayah_start: number;
  ayah_end: number;
  juz_number: number;
  pages_read: number;
  repetition_count: number;
  recency_category: RecencyCategory;
  created_at: string;
}

export interface MistakeData {
  id: string;
  session_id: string;
  session_portion_id: string;
  error_category: ErrorCategory;
  error_subcategory?: ErrorSubcategory;
  severity_level: number; // 1-5
  ayah_number: number;
  additional_notes?: string;
  created_at: string;
}
```

---

## Frontend Form Types

```typescript
// Used for form state management - includes tempId for tracking before DB save

export interface SessionFormData {
  session_date: string;
  session_type: SessionType;
  duration_minutes: number;
  performance_score: number;
  session_goal?: string;
  additional_notes?: string;
  portions: PortionFormData[];
  mistakes: MistakeFormData[];
}

export interface PortionFormData {
  tempId: string; // UUID for frontend tracking
  databaseId?: string; // Set after save or when editing existing
  surah_name: string;
  ayah_start?: number;
  ayah_end?: number;
  repetition_count: number;
  recency_category: RecencyCategory;
  juz_number?: number; // Auto-calculated
  pages_read?: number; // Auto-calculated
}

export interface MistakeFormData {
  tempId: string;
  databaseId?: string;
  portionTempId: string; // Links to PortionFormData.tempId
  error_category: ErrorCategory;
  error_subcategory?: ErrorSubcategory;
  severity_level: number;
  ayah_number: number;
  additional_notes?: string;
}
```

---

## API Request/Response Types

```typescript
export interface CreateSessionRequest {
  session: Omit<SessionData, "id" | "user_id" | "created_at" | "updated_at">;
  session_portions: Omit<SessionPortion, "id" | "session_id" | "created_at">[];
  mistakes: Omit<MistakeData, "id" | "session_id" | "session_portion_id" | "created_at">[];
}

export interface UpdateSessionRequest {
  session: Partial<Omit<SessionData, "id" | "user_id" | "created_at">>;
  session_portions: Omit<SessionPortion, "session_id" | "created_at">[];
  mistakes: Omit<MistakeData, "session_id" | "created_at">[];
}

export interface FullSessionData {
  session: SessionData;
  session_portions: SessionPortion[];
  mistakes: MistakeData[];
}
```

---

## Utility Types

```typescript
export interface SessionStats {
  portion_count: number;
  mistake_count: number;
  avg_mistake_severity: number;
  surahs_practiced: string[];
  total_ayahs: number;
  total_pages: number;
  total_repetitions: number;
}

export interface SessionSummary extends SessionData {
  stats: SessionStats;
}

export interface ValidationErrors {
  session?: Record<string, string>;
  portions?: Record<string, Record<string, string>>;
  mistakes?: Record<string, Record<string, string>>;
}
```

---

## Key Patterns

### TempId Pattern
- Generate UUID for each new portion/mistake in form
- Use `tempId` to link mistakes to portions before DB save
- After save, backend returns real IDs
- For editing, set `databaseId` from existing data

### Validation Rules
- `performance_score`: 0-10, decimal allowed
- `severity_level`: 1-5, integer only
- `ayah_end` >= `ayah_start`
- `duration_minutes` > 0
- At least 1 portion required
