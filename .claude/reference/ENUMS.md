# Enum Reference

**Source:** Web app `src/types/session.ts` + Supabase database
**Must match database exactly**

---

## SessionType

```typescript
export type SessionType =
  | "reading_practice"
  | "memorization"
  | "audit"
  | "mistake_session"
  | "practice_test"
  | "study_session";

export const SESSION_TYPES: SessionType[] = [
  "reading_practice",
  "memorization",
  "audit",
  "mistake_session",
  "practice_test",
  "study_session",
];
```

**Display Labels:**
| Value | Label |
|-------|-------|
| reading_practice | Reading Practice |
| memorization | Memorization |
| audit | Audit |
| mistake_session | Mistake Review |
| practice_test | Practice Test |
| study_session | Study Session |

---

## RecencyCategory

```typescript
export type RecencyCategory = "new" | "recent" | "reviewing" | "maintenance";

export const RECENCY_CATEGORIES: RecencyCategory[] = [
  "new",
  "recent",
  "reviewing",
  "maintenance",
];
```

**Definitions:**
| Value | Description |
|-------|-------------|
| new | Practiced within last 1-2 days |
| recent | Practiced 1-4 weeks ago or within 20 pages |
| reviewing | Last practiced more than 4 weeks ago |
| maintenance | Beyond 20 pages |

---

## ErrorCategory

```typescript
export type ErrorCategory =
  | "pronunciation"
  | "tajweed"
  | "memorization"
  | "translation"
  | "fluency"
  | "waqf"
  | "other";

export const ERROR_CATEGORIES: ErrorCategory[] = [
  "pronunciation",
  "tajweed",
  "memorization",
  "translation",
  "fluency",
  "waqf",
  "other",
];
```

---

## ErrorSubcategory

```typescript
export type ErrorSubcategory =
  // Pronunciation (makhraj/sifat)
  | "makhraj"
  | "sifat"
  // Tajweed rules
  | "ghunna"
  | "qalqalah"
  | "madd"
  | "idgham"
  | "ikhfa"
  | "iqlab"
  // Memorization errors
  | "word_order"
  | "verse_skip"
  | "word_substitution"
  | "mutashabih"
  | "forgotten_word"
  | "forgotten_verse_start"
  | "forgotten_verse_end"
  | "forgotten_verse_middle"
  | "forgotten_verse_all"
  | "forgotten_verse_middle_end"
  | "forgotten_verse_start_middle"
  | "verse_slipping"
  // Fluency errors
  | "hesitation"
  | "repetition"
  | "rhythm"
  // Waqf (stopping) errors
  | "wrong_stop"
  | "missed_stop"
  | "disencouraged_stop"
  | "disencouraged_continue";

export const ERROR_SUBCATEGORIES: ErrorSubcategory[] = [
  "makhraj",
  "sifat",
  "ghunna",
  "qalqalah",
  "madd",
  "idgham",
  "ikhfa",
  "iqlab",
  "word_order",
  "verse_skip",
  "word_substitution",
  "mutashabih",
  "forgotten_word",
  "forgotten_verse_start",
  "forgotten_verse_end",
  "forgotten_verse_middle",
  "forgotten_verse_all",
  "forgotten_verse_middle_end",
  "forgotten_verse_start_middle",
  "verse_slipping",
  "hesitation",
  "repetition",
  "rhythm",
  "wrong_stop",
  "missed_stop",
  "disencouraged_stop",
  "disencouraged_continue",
];
```

**Subcategory by Category Mapping:**

| Category | Subcategories |
|----------|---------------|
| pronunciation | makhraj, sifat |
| tajweed | ghunna, qalqalah, madd, idgham, ikhfa, iqlab |
| memorization | word_order, verse_skip, word_substitution, mutashabih, forgotten_word, forgotten_verse_* (7 variants), verse_slipping |
| fluency | hesitation, repetition, rhythm |
| waqf | wrong_stop, missed_stop, disencouraged_stop, disencouraged_continue |
| translation | (none - use additional_notes) |
| other | (none - use additional_notes) |

---

## Severity Levels

Not an enum, but constrained integer:

```typescript
// 1 = Minor, 5 = Critical
type SeverityLevel = 1 | 2 | 3 | 4 | 5;
```

**Display:**
| Level | Label | Color |
|-------|-------|-------|
| 1 | Minor | Gray |
| 2 | Low | Green |
| 3 | Medium | Yellow |
| 4 | High | Orange |
| 5 | Critical | Red |
