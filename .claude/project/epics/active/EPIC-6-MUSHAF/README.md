# EPIC-6: Mushaf Mistake Marking

**Status:** Not Started
**Priority:** High

## Goal

A visual Quran (Mushaf) interface where users can view Arabic text word-by-word, drag to select a practice range, mark mistakes with color-coded highlights, and complete sessions with auto-inferred data. Modern, seamless, simple, and visually pleasing.

## Features

| ID | Feature | Status | Tasks |
|----|---------|--------|-------|
| 6.1 | Quran Data Layer | Not Started | 3 |
| 6.2 | Mushaf Display | Not Started | 4 |
| 6.3 | Range Selection | Not Started | 4 |
| 6.4 | Mistake Marking | Not Started | 4 |
| 6.5 | Historical Mistakes | Not Started | 3 |
| 6.6 | Session Completion | Not Started | 3 |
| 6.7 | Settings & Navigation | Not Started | 3 |
| 6.8 | Database & Testing | Not Started | 2 |

## User Stories

- US-6.1: View Quran text in word-by-word layout
- US-6.2: Start session and drag to select practice range
- US-6.3: Select across pages with seamless transitions
- US-6.4: Tap words to mark mistakes with quick category selection
- US-6.5: See mistakes highlighted with category-specific colors
- US-6.6: Toggle to view historical mistakes on Mushaf
- US-6.7: Add multiple portions to one session
- US-6.8: Complete session and review/edit all data before saving
- US-6.9: Configure default mistake types in settings

## Dependencies

- EPIC-0: Setup (base project)
- EPIC-1: Auth (user context)
- EPIC-2: Sessions (session/mistake data structures)

## Research

- **Spec**: `specs/SPEC-mushaf-marking.md`
- **Data Source**: [QUL Uthmani Script](https://qul.tarteel.ai/resources/quran-script/56)
- **UX Reference**: [Greentech Apps Al-Quran](https://gtaf.org/apps/quran/)

## Tech Stack

| Component | Technology |
|-----------|------------|
| Data | QUL JSON (bundled) |
| List | @shopify/flash-list |
| Bottom Sheet | @gorhom/bottom-sheet |
| Gestures | react-native-gesture-handler |
| Animations | react-native-reanimated |

## Definition of Done

- [ ] All 27 tasks complete
- [ ] E2E tests pass
- [ ] Human QA approved
- [ ] Performance verified (Al-Baqarah scrolls smoothly)
- [ ] Arabic font renders correctly
- [ ] Cross-page selection works
