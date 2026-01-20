# EPIC-0: Project Setup

**Goal:** Initialize React Native project with all dependencies, configuration, and testing infrastructure.
**Estimate:** 8 tasks, ~4000 tokens total

---

## User Stories

- US-0.1: As a developer, I have a working React Native project
- US-0.2: As a developer, I can connect to Supabase
- US-0.3: As a developer, I have type safety and validation
- US-0.4: As a developer, I can run automated E2E tests

---

## Feature 0.1: Project Initialization

### Task 0.1.1: Initialize Expo Project

**Size:** M (~1000 tokens)
**Files:** Multiple (project scaffold)
**Deps:** None

**Commands to Run:**
```bash
npx create-expo-app@latest . --template tabs
```

**Acceptance Criteria:**
- [ ] Expo project created with TypeScript
- [ ] Tab navigation template working
- [ ] `npx expo start` runs without errors

**Test:**
```bash
npx expo start --ios
# Verify app launches in simulator
```

**Promise:** `<promise>0.1.1-DONE</promise>`

**Notes:**
- Use "tabs" template for navigation scaffold
- This creates the base project structure

---

### Task 0.1.2: Install Core Dependencies

**Size:** S (~500 tokens)
**Files:** `package.json`
**Deps:** 0.1.1

**Commands to Run:**
```bash
# State management & data fetching
npx expo install @tanstack/react-query zustand

# Forms & validation
npm install react-hook-form zod @hookform/resolvers

# Supabase
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage

# UI
npx expo install nativewind tailwindcss react-native-paper react-native-safe-area-context

# Auth
npx expo install expo-web-browser expo-auth-session expo-crypto

# Utils
npm install date-fns uuid
npm install -D @types/uuid
```

**Acceptance Criteria:**
- [ ] All packages installed without errors
- [ ] No peer dependency conflicts
- [ ] `npm ls` shows all packages

**Test:**
```bash
npm ls @tanstack/react-query zustand react-hook-form zod @supabase/supabase-js
```

**Promise:** `<promise>0.1.2-DONE</promise>`

---

### Task 0.1.3: Configure NativeWind (Tailwind)

**Size:** S (~500 tokens)
**Files:** `tailwind.config.js`, `babel.config.js`, `global.css`, `app/_layout.tsx`
**Deps:** 0.1.2

**Acceptance Criteria:**
- [ ] `tailwind.config.js` created with content paths
- [ ] `babel.config.js` includes nativewind preset
- [ ] `global.css` imports tailwind directives
- [ ] Root layout imports global.css
- [ ] Tailwind classes work in components

**Test:**
```bash
# Add className="bg-red-500" to a View and verify red background
npx expo start --ios
```

**Code Example (tailwind.config.js):**
```javascript
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#10B981",
        secondary: "#4F46E5",
      },
    },
  },
  plugins: [],
};
```

**Promise:** `<promise>0.1.3-DONE</promise>`

---

## Feature 0.2: Supabase Configuration

### Task 0.2.1: Create Supabase Client

**Size:** S (~500 tokens)
**Files:** `lib/supabase.ts`, `.env`
**Deps:** 0.1.2

**Acceptance Criteria:**
- [ ] `.env` file created with EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
- [ ] Supabase client configured with AsyncStorage
- [ ] Client exported for use in app
- [ ] TypeScript types correct

**Test:**
```bash
npm run typecheck
```

**Reference:** See `reference/API-PATTERNS.md` for client setup code.

**Promise:** `<promise>0.2.1-DONE</promise>`

**On Failure:**
- Check env vars are prefixed with EXPO_PUBLIC_
- Verify AsyncStorage is installed

---

## Feature 0.3: Type System

### Task 0.3.1: Create Session Types

**Size:** M (~800 tokens)
**Files:** `types/session.ts`
**Deps:** 0.1.2

**Acceptance Criteria:**
- [ ] All types from `reference/TYPES.md` implemented
- [ ] All enums from `reference/ENUMS.md` implemented
- [ ] Constants arrays exported (SESSION_TYPES, ERROR_CATEGORIES, etc.)
- [ ] `npm run typecheck` passes

**Test:**
```bash
npm run typecheck
```

**Reference:** Copy types exactly from `reference/TYPES.md` and `reference/ENUMS.md`.

**Promise:** `<promise>0.3.1-DONE</promise>`

---

### Task 0.3.2: Create Zod Validation Schemas

**Size:** M (~800 tokens)
**Files:** `lib/validation/session.ts`, `lib/validation/session.test.ts`
**Deps:** 0.3.1

**⚠️ TDD REQUIRED - Write tests FIRST, then implement:**

**Step 1: Write tests first (session.test.ts)**
```typescript
describe('sessionSchema', () => {
  it('accepts valid session data', () => { /* ... */ });
  it('rejects invalid performance_score > 10', () => { /* ... */ });
  it('rejects invalid performance_score < 0', () => { /* ... */ });
});

describe('portionSchema', () => {
  it('accepts ayah_end >= ayah_start', () => { /* ... */ });
  it('rejects ayah_end < ayah_start', () => { /* ... */ });
});

describe('mistakeSchema', () => {
  it('accepts severity_level 1-5', () => { /* ... */ });
  it('rejects severity_level > 5', () => { /* ... */ });
  it('rejects severity_level < 1', () => { /* ... */ });
});
```

**Step 2: Run tests (should fail)**
```bash
npm test -- session.test.ts
# Expected: All tests fail (no implementation yet)
```

**Step 3: Implement schemas to make tests pass**

**Step 4: Run tests again (should pass)**
```bash
npm test -- session.test.ts
# Expected: All tests pass
```

**Acceptance Criteria:**
- [ ] Tests written BEFORE implementation
- [ ] `sessionSchema` validates all session fields
- [ ] `portionSchema` validates ayah_end >= ayah_start
- [ ] `mistakeSchema` validates severity_level 1-5
- [ ] `sessionFormSchema` validates complete form
- [ ] All unit tests pass

**Validation Rules:**
- performance_score: 0-10, decimal allowed
- severity_level: 1-5, integer
- duration_minutes: positive integer
- ayah_end >= ayah_start
- At least 1 portion required

**Promise:** `<promise>0.3.2-DONE</promise>`

---

## Feature 0.4: Project Structure

### Task 0.4.1: Create Folder Structure

**Size:** S (~300 tokens)
**Files:** Multiple empty index files
**Deps:** 0.1.1

**Folders to Create:**
```
lib/
├── api/
├── hooks/
├── utils/
├── validation/
├── voice/
components/
├── ui/
├── forms/
├── sessions/
├── analytics/
├── ai/
types/
constants/
tests/
├── e2e/
```

**Acceptance Criteria:**
- [ ] All folders created
- [ ] Each folder has index.ts (can be empty)
- [ ] Imports work from folder level

**Promise:** `<promise>0.4.1-DONE</promise>`

---

## Feature 0.5: E2E Testing Infrastructure

### Task 0.5.1: Setup Maestro

**Size:** M (~700 tokens)
**Files:** `.maestro/config.yaml`, `tests/e2e/smoke.yaml`
**Deps:** 0.1.1

**IMPORTANT - Agent Must Research:**
Before implementing, verify:
1. Current Maestro installation method
2. Expo compatibility requirements
3. iOS simulator setup requirements

**Research Commands:**
```bash
# Check Maestro installation
curl -Ls "https://get.maestro.mobile.dev" | bash

# Verify installation
maestro --version

# Search: "Maestro Expo 2025" for current best practices
```

**Installation:**
```bash
# macOS
curl -Ls "https://get.maestro.mobile.dev" | bash

# Add to PATH if needed
export PATH="$PATH":"$HOME/.maestro/bin"
```

**Acceptance Criteria:**
- [ ] Maestro CLI installed
- [ ] Config file created at `.maestro/config.yaml`
- [ ] Smoke test created that launches app
- [ ] Smoke test passes

**Config File (.maestro/config.yaml):**
```yaml
# Maestro configuration
flows:
  - tests/e2e/**/*.yaml
```

**Smoke Test (tests/e2e/smoke.yaml):**
```yaml
appId: com.quranalysis.mobile
name: Smoke Test - App Launches
---
- launchApp
- assertVisible: ".*" # Any content visible means app launched
```

**Test:**
```bash
# Build dev client first (if needed)
npx expo run:ios

# Run smoke test
maestro test tests/e2e/smoke.yaml
```

**Promise:** `<promise>0.5.1-DONE</promise>`

**On Failure:**
- Check Maestro is in PATH
- Verify iOS simulator is running
- May need Expo dev client instead of Expo Go

---

### Task 0.5.2: Create Test Utilities

**Size:** S (~400 tokens)
**Files:** `tests/e2e/helpers/common.yaml`
**Deps:** 0.5.1

**Acceptance Criteria:**
- [ ] Common test flows created (login, navigate to tab, etc.)
- [ ] Reusable across all E2E tests
- [ ] Documented in file comments

**Helper Flows (tests/e2e/helpers/common.yaml):**
```yaml
# Common test helpers
# Import with: - runFlow: tests/e2e/helpers/common.yaml

# Helper: Login (if not already logged in)
- runFlow:
    when:
      visible: "Sign in with Google"
    commands:
      - tapOn: "Sign in with Google"
      # Note: OAuth flow may need manual setup or mocking

# Helper: Navigate to tab
- runFlow:
    env:
      TAB_NAME: "Sessions"
    commands:
      - tapOn: ${TAB_NAME}
```

**Promise:** `<promise>0.5.2-DONE</promise>`

---

## 🧑‍💻 Human QA: EPIC-0

**After all tasks complete:**

- [ ] App runs in iOS simulator
- [ ] No TypeScript errors
- [ ] Tailwind classes apply styles
- [ ] Folder structure makes sense
- [ ] Environment variables set correctly
- [ ] Maestro smoke test passes

**How to verify:**
1. `npx expo start --ios`
2. App launches without errors
3. Navigation tabs work
4. `maestro test tests/e2e/smoke.yaml` passes

---

## Dependencies Graph

```
0.1.1 (Init)
  ↓
0.1.2 (Deps) → 0.1.3 (Tailwind)
  ↓
0.2.1 (Supabase)
  ↓
0.3.1 (Types) → 0.3.2 (Validation)

0.4.1 (Folders) - independent
0.5.1 (Maestro) → 0.5.2 (Test Helpers)
```

**Recommended Order:**
1. 0.1.1 → 0.1.2 → 0.4.1 → 0.1.3
2. 0.2.1 → 0.3.1 → 0.3.2
3. 0.5.1 → 0.5.2
