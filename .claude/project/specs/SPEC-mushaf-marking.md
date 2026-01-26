# EPIC-6: Mushaf Mistake Marking

## Overview

A visual Quran (Mushaf) interface where users can view Arabic text word-by-word, drag to select a practice range, mark mistakes with color-coded highlights, and complete sessions with auto-inferred data. Modern, seamless, simple, and visually pleasing.

## User Stories

- **US-6.1**: As a user, I can view the Quran text in a word-by-word layout
- **US-6.2**: As a user, I can start a session and drag to select my practice range
- **US-6.3**: As a user, I can select across pages with seamless transitions
- **US-6.4**: As a user, I can tap words to mark mistakes with quick category selection
- **US-6.5**: As a user, I can see my mistakes highlighted with category-specific colors
- **US-6.6**: As a user, I can toggle to view my historical mistakes on the Mushaf
- **US-6.7**: As a user, I can add multiple portions to one session
- **US-6.8**: As a user, I can complete the session and review/edit all data before saving
- **US-6.9**: As a user, I can configure my default mistake types in settings

---

## Primary UI Flow (Mushaf-Centric)

```
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: Open Mushaf                                            │
│  ─────────────────────────────────────────────────────────────  │
│  User opens Mushaf tab/screen                                   │
│  Shows: Quran text + "Start Session" floating button            │
│  Optional: Toggle "Show Past Mistakes" to see historical errors │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: Start Session & Select Range                           │
│  ─────────────────────────────────────────────────────────────  │
│  User taps "Start Session"                                      │
│  Mode changes: "Drag to select your practice range"             │
│  User drags from start word → end word (cross-page OK)          │
│  Selection highlights in blue as user drags                     │
│  Cancel button available to reset selection                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: Confirm Range → Portion Created                        │
│  ─────────────────────────────────────────────────────────────  │
│  User releases drag → "Confirm Range" button appears            │
│  Shows: "Al-Baqarah 2:1-10 (10 ayahs)"                         │
│  User confirms → Portion added to session                       │
│  Option: "Add Another Portion" or continue marking              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: Mark Mistakes                                          │
│  ─────────────────────────────────────────────────────────────  │
│  User taps any word in the selected range                       │
│  Bottom sheet appears with:                                     │
│    - Quick category buttons (default highlighted)               │
│    - Subcategory dropdown                                       │
│    - Severity selector (1-5)                                    │
│  User taps category → mistake saved instantly                   │
│  Word highlighted with category color                           │
│  Repeat for all mistakes                                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 5: Complete Session                                       │
│  ─────────────────────────────────────────────────────────────  │
│  User taps "Complete Session" button                            │
│  Confirmation screen shows:                                     │
│    - Portions with ranges (editable)                            │
│    - All mistakes marked (editable/removable)                   │
│    - Auto-inferred: duration, session type, performance         │
│  User reviews, edits if needed, taps "Save Session"             │
│  Session saved to database, user returns to Mushaf              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Layout | Word-by-word grid | Best for precise mistake marking and drag selection |
| Selection | Drag gesture | Modern, seamless, supports cross-page selection |
| Data Source | QUL (Tarteel) JSON | Word-level data with position, text, location |
| Position Tracking | Word-level | Precise mistake location tracking |
| Mistake Colors | Category-based | Visual differentiation (7 colors for 7 categories) |
| Historical View | Toggle overlay | Compare current session vs past mistakes |
| Defaults | User settings + smart tracking | Faster marking for common mistakes |

---

## Mistake Category Colors

| Category | Color | Tailwind Class |
|----------|-------|----------------|
| Pronunciation | Blue | `bg-blue-200 border-blue-500` |
| Tajweed | Purple | `bg-purple-200 border-purple-500` |
| Memorization | Orange | `bg-orange-200 border-orange-500` |
| Fluency | Yellow | `bg-yellow-200 border-yellow-500` |
| Waqf | Green | `bg-green-200 border-green-500` |
| Translation | Gray | `bg-gray-200 border-gray-500` |
| Other | Red | `bg-red-200 border-red-500` |

Historical mistakes shown with lower opacity + dotted border to distinguish from current session.

---

## Data Architecture

### Quran Data Source

**Primary**: [QUL Uthmani Script](https://qul.tarteel.ai/resources/quran-script/56) (JSON)
- Word-by-word JSON for all 114 surahs (~8-12MB bundled)
- Fields: `position`, `text`, `location` (surah:ayah:word), `page`

### New Types

```typescript
// types/quran.ts
export interface QuranWord {
  position: number;
  text: string;
  location: string;        // "surah:ayah:word"
  page: number;
}

export interface QuranAyah {
  key: string;             // "1:1"
  surah: number;
  ayah: number;
  words: QuranWord[];
  page: number;
  juz: number;
}

export interface SelectionRange {
  startLocation: string;   // "2:1:1"
  endLocation: string;     // "2:10:15"
  surahNumber: number;
  ayahStart: number;
  ayahEnd: number;
}

export interface MushafMistake extends MistakeFormData {
  word_position: number;
  word_text: string;
  word_location: string;   // "surah:ayah:word"
}

// types/settings.ts
export interface MushafSettings {
  defaultCategory: ErrorCategory | null;
  defaultSeverity: SeverityLevel;
  showHistoricalMistakes: boolean;
  fontSize: 'small' | 'medium' | 'large';
  smartDefaults: boolean;  // Track most-used categories
}
```

### Database Schema Additions

```sql
-- Add word-level tracking to mistakes table
ALTER TABLE mistakes ADD COLUMN word_position INTEGER;
ALTER TABLE mistakes ADD COLUMN word_text TEXT;
ALTER TABLE mistakes ADD COLUMN word_location TEXT;

-- Track smart defaults (most used categories per user)
CREATE TABLE user_mistake_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  error_category TEXT NOT NULL,
  usage_count INTEGER DEFAULT 1,
  last_used TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, error_category)
);
```

---

## Feature Breakdown

### Feature 6.1: Quran Data Layer
| Task | Size | Description |
|------|------|-------------|
| 6.1.1 | M | Download and bundle QUL word-by-word JSON data with page info |
| 6.1.2 | S | Create QuranWord/QuranAyah/SelectionRange types |
| 6.1.3 | M | Build useQuranData hook with per-surah lazy loading |

### Feature 6.2: Mushaf Display
| Task | Size | Description |
|------|------|-------------|
| 6.2.1 | S | Add Arabic font (Uthmani) with expo-font |
| 6.2.2 | L | Create MushafScreen with page-based FlashList layout |
| 6.2.3 | M | Build AyahRow component (RTL word flow) |
| 6.2.4 | M | Create WordToken with color-coded mistake highlighting |

### Feature 6.3: Range Selection
| Task | Size | Description |
|------|------|-------------|
| 6.3.1 | L | Implement drag-to-select with react-native-gesture-handler |
| 6.3.2 | L | Handle cross-page selection with smooth page transitions |
| 6.3.3 | M | Build SelectionOverlay component (visual feedback during drag) |
| 6.3.4 | S | Add cancel/reset selection functionality |

### Feature 6.4: Mistake Marking
| Task | Size | Description |
|------|------|-------------|
| 6.4.1 | L | Build MistakeBottomSheet with quick category buttons |
| 6.4.2 | M | Create useMushafSession hook for session state |
| 6.4.3 | M | Implement mistake edit/remove on marked words |
| 6.4.4 | S | Add smart defaults tracking (increment usage_count) |

### Feature 6.5: Historical Mistakes
| Task | Size | Description |
|------|------|-------------|
| 6.5.1 | M | Fetch user's past mistakes for current surah |
| 6.5.2 | M | Build HistoricalMistakeOverlay (dotted, lower opacity) |
| 6.5.3 | S | Add toggle switch in Mushaf header |

### Feature 6.6: Session Completion
| Task | Size | Description |
|------|------|-------------|
| 6.6.1 | L | Build MushafConfirmationScreen (like AI chat's SessionConfirmation) |
| 6.6.2 | M | Auto-infer session data (duration, type, performance) |
| 6.6.3 | L | Save session with portions and mistakes to Supabase |

### Feature 6.7: Settings & Navigation
| Task | Size | Description |
|------|------|-------------|
| 6.7.1 | M | Add Mushaf settings to Profile screen |
| 6.7.2 | M | Build MushafHeader with surah picker and ayah jump |
| 6.7.3 | S | Add font size controls |

### Feature 6.8: Database & Testing
| Task | Size | Description |
|------|------|-------------|
| 6.8.1 | S | Apply Supabase migration for new columns |
| 6.8.2 | M | E2E tests for selection, marking, and completion flow |

---

## Component Architecture

```
components/
  mushaf/
    MushafScreen.tsx           # Main screen with mode management
    MushafView.tsx             # Page-based FlashList of ayahs
    AyahRow.tsx                # Single ayah with RTL word layout
    WordToken.tsx              # Touchable word with color highlighting

    # Selection
    SelectionOverlay.tsx       # Visual feedback during drag
    RangeConfirmSheet.tsx      # "Confirm Range" bottom sheet

    # Mistakes
    MistakeBottomSheet.tsx     # Quick mistake entry
    MistakeColorIndicator.tsx  # Color badge on word
    HistoricalMistakeOverlay.tsx  # Past mistakes (dotted style)

    # Session
    MushafConfirmationScreen.tsx  # Review before save
    SessionProgressBar.tsx     # Shows portions + mistake count

    # Navigation
    MushafHeader.tsx           # Surah picker, toggle, controls
    SurahPicker.tsx            # Modal surah selector

lib/
  hooks/
    useQuranData.ts            # Load surah data with caching
    useMushafSession.ts        # Session state (portions, mistakes)
    useMushafSelection.ts      # Drag selection logic
    useHistoricalMistakes.ts   # Fetch past mistakes

  stores/
    mushafStore.ts             # Zustand store for Mushaf state
```

---

## Drag Selection Implementation

Using `react-native-gesture-handler` + `react-native-reanimated`:

```typescript
// Key interaction logic
const useMushafSelection = () => {
  const [selectionMode, setSelectionMode] = useState<'idle' | 'selecting' | 'confirming'>('idle');
  const [startWord, setStartWord] = useState<QuranWord | null>(null);
  const [endWord, setEndWord] = useState<QuranWord | null>(null);

  const onWordPanStart = (word: QuranWord) => {
    if (selectionMode === 'idle') return;
    setStartWord(word);
    setEndWord(word);
  };

  const onWordPanMove = (word: QuranWord) => {
    if (selectionMode !== 'selecting') return;
    setEndWord(word);
    // Highlight all words between start and end
  };

  const onWordPanEnd = () => {
    setSelectionMode('confirming');
    // Show confirm sheet
  };

  const cancelSelection = () => {
    setStartWord(null);
    setEndWord(null);
    setSelectionMode('idle');
  };
};
```

### Cross-Page Handling

When user drags to edge of screen:
1. Auto-scroll to next/previous page
2. Continue selection seamlessly
3. Track words across page boundaries using `word.page` field

---

## MistakeBottomSheet UI (Updated)

```
┌─────────────────────────────────────────────┐
│  Mark Mistake                          [X]  │
│  ─────────────────────────────────────────  │
│  "بِسْمِ" • Al-Fatihah 1:1, Word 1          │
├─────────────────────────────────────────────┤
│  ┌────────┐ ┌────────┐ ┌────────┐          │
│  │ Pron.  │ │Tajweed │ │ Memor. │  ← Quick │
│  │  🔵    │ │  🟣    │ │  🟠    │    taps  │
│  └────────┘ └────────┘ └────────┘          │
│  ┌────────┐ ┌────────┐ ┌────────┐          │
│  │Fluency │ │  Waqf  │ │ Other  │          │
│  │  🟡    │ │  🟢    │ │  🔴    │          │
│  └────────┘ └────────┘ └────────┘          │
│                                              │
│  Subcategory: [Makhraj              ▼]      │
│                                              │
│  Severity:  ① ② ③ ④ ⑤                      │
│                ↑ (default from settings)    │
│                                              │
│  [Cancel]              [Save Mistake]       │
└─────────────────────────────────────────────┘

Note: User's most-used category highlighted as default.
      Tapping category button = instant save (1-tap marking).
```

---

## Settings Screen Addition

Add to Profile > Settings:

```
┌─────────────────────────────────────────────┐
│  Mushaf Settings                            │
├─────────────────────────────────────────────┤
│  Default Mistake Type     [Smart ▼]         │
│  ├─ Smart (most used)                       │
│  ├─ Tajweed                                 │
│  ├─ Memorization                            │
│  └─ None (always ask)                       │
│                                              │
│  Default Severity         [3 - Medium]      │
│                                              │
│  Font Size               [Medium ▼]         │
│                                              │
│  Show Past Mistakes       [Toggle ON]       │
│  (See historical mistakes on Mushaf)        │
└─────────────────────────────────────────────┘
```

---

## Libraries to Add

| Library | Purpose | Size |
|---------|---------|------|
| `@shopify/flash-list` | Virtualized list | ~50KB |
| `@gorhom/bottom-sheet` | Native bottom sheet | ~80KB |
| `react-native-gesture-handler` | Drag gestures | Already in Expo |
| `react-native-reanimated` | Smooth animations | Already in Expo |

---

## Critical Files to Modify

| File | Changes |
|------|---------|
| `types/session.ts` | Add MushafMistake, word fields |
| `types/quran.ts` | New file for Quran types |
| `lib/api/sessions.ts` | Extend for word-level mistakes |
| `lib/validation/session.ts` | Add word_position validation |
| `app/(tabs)/_layout.tsx` | Add Mushaf tab |
| `app/(tabs)/profile.tsx` | Add Mushaf settings section |
| `constants/` | Add category colors constant |

---

## Execution Order

```
Phase 1: Foundation
6.1.1 → 6.1.2 → 6.1.3 → 6.2.1  (Data + Font)

Phase 2: Display
6.2.2 → 6.2.3 → 6.2.4  (Mushaf view + words)

Phase 3: Selection
6.3.1 → 6.3.2 → 6.3.3 → 6.3.4  (Drag selection)

Phase 4: Marking
6.4.1 → 6.4.2 → 6.4.3 → 6.4.4  (Mistake marking)

Phase 5: Historical
6.5.1 → 6.5.2 → 6.5.3  (Past mistakes toggle)

Phase 6: Completion
6.6.1 → 6.6.2 → 6.6.3  (Session save flow)

Phase 7: Polish
6.7.1 → 6.7.2 → 6.7.3  (Settings + navigation)

Phase 8: Finalize
6.8.1 → 6.8.2  (Migration + tests)
```

**Total: 27 tasks**

---

## Verification Plan

1. **Data**: All 114 surahs load with word-level data
2. **Arabic font**: Uthmani script renders correctly with diacritics
3. **Drag selection**: Smooth selection within page and across pages
4. **Cross-page**: Selection continues when scrolling to next page
5. **Mistake marking**: Tap word → bottom sheet → save in 2 taps
6. **Colors**: Each category shows distinct highlight color
7. **Historical**: Toggle shows past mistakes with different style
8. **Multi-portion**: Can add 2+ portions to same session
9. **Confirmation**: All data editable before final save
10. **Performance**: Al-Baqarah (286 ayahs) scrolls smoothly

---

## Data Sources

- [QUL - Quranic Universal Library](https://qul.tarteel.ai/resources)
- [QUL Uthmani Word-by-Word](https://qul.tarteel.ai/resources/quran-script/56)
- [Quran.com API](https://api.quran.com) (fallback)
- [Greentech Apps Al-Quran](https://gtaf.org/apps/quran/) (UX reference)
