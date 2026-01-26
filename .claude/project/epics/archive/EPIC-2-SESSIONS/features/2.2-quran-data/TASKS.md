# Feature 2.2: Quran Data

**Status:** ✅ Complete

## Tasks

| ID | Task | Size | Status |
|----|------|------|--------|
| 2.2.1 | Create Surah Data File | M | ✅ Complete |

---

### Task 2.2.1: Create Surah Data File

**Size:** M (~800 tokens)
**Files:** `constants/quran-data.ts`
**Deps:** None

**Acceptance Criteria:**
- [x] All 114 surahs with: number, name, transliteration, ayah_count, juz_start, page_start, page_end
- [x] Helper functions: `getSurahByName()`, `getSurahByNumber()`, `getJuzForAyah()`
- [x] `calculatePagesRead(surah, ayahStart, ayahEnd)` function
- [x] TypeScript types for surah data

**Data Source:** Extract from web app's `src/data/surahs-complete.ts`
