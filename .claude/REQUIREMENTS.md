# Quranalysis Mobile - Product Requirements Document

**Project:** Quranalysis Mobile MVP (iOS)
**Version:** 1.0.0
**Platform:** React Native with Expo (iOS First)
**Backend:** Supabase (Shared with Web App)
**Last Updated:** January 15, 2025

---

## Quick Links

| Document | Purpose |
|----------|---------|
| [STATUS.md](./STATUS.md) | Current sprint status & task tracking |
| [LEARNINGS.md](./LEARNINGS.md) | Issue resolution patterns |
| [AGENT-WORKFLOW-GUIDE.md](./AGENT-WORKFLOW-GUIDE.md) | Claude Code optimization & context management |
| [CODE-STANDARDS.md](./CODE-STANDARDS.md) | Clean code practices & conventions |
| [reference/TYPES.md](./reference/TYPES.md) | TypeScript types to implement |
| [reference/ENUMS.md](./reference/ENUMS.md) | All enum values |
| [reference/API-PATTERNS.md](./reference/API-PATTERNS.md) | Supabase integration patterns |

### Epics (in order)
1. [EPIC-0-SETUP.md](./epics/EPIC-0-SETUP.md) - Project initialization
2. [EPIC-1-AUTH.md](./epics/EPIC-1-AUTH.md) - Authentication
3. [EPIC-2-SESSIONS.md](./epics/EPIC-2-SESSIONS.md) - Session CRUD (largest)
4. [EPIC-3-DASHBOARD.md](./epics/EPIC-3-DASHBOARD.md) - Stats & analytics
5. [EPIC-4-AI-CHAT.md](./epics/EPIC-4-AI-CHAT.md) - AI chatbot with voice
6. [EPIC-5-PROFILE.md](./epics/EPIC-5-PROFILE.md) - User profile

---

## 1. Project Overview

### 1.1 Purpose
Build a mobile-first iOS application that allows users to track their Quran memorization and recitation practice sessions with detailed analytics, mistake tracking, and AI-powered assistance.

### 1.2 Goals
- **Primary:** Working MVP sharing Supabase database with existing web app
- **Secondary:** Mobile-optimized UX for session logging and progress tracking
- **Tertiary:** AI-powered session/mistake logging via text and voice

### 1.3 Target Users
- Muslims actively memorizing or reviewing Quran
- Users already using the web app (cross-platform access)
- New users preferring mobile-first experience

### 1.4 Out of Scope (Post-MVP)
- Android version
- iPad optimization
- Audio recording/playback
- Push notifications
- Community features

---

## 2. Technical Stack

### Frontend
- **Framework:** React Native with Expo SDK 50+
- **Language:** TypeScript 5.x
- **Navigation:** Expo Router (file-based)
- **Styling:** NativeWind (Tailwind for RN)
- **State:** React Query + Zustand
- **Forms:** React Hook Form + Zod

### Backend
- **Database:** Supabase PostgreSQL (shared with web)
- **Auth:** Supabase Auth (Google OAuth)
- **AI:** Google Gemini API

### Key Dependencies
See EPIC-0-SETUP.md for full dependency list and installation commands.

### Testing Framework
- **E2E Testing:** Maestro (mobile-native E2E testing)
- **Type Checking:** TypeScript strict mode
- **Unit Testing:** Jest (for utility functions)

---

## 3. Data Model

**Shared with web app - see reference/TYPES.md for exact types**

### Tables
- `sessions` - Session metadata
- `session_portions` - Per-surah details (multi-portion support)
- `mistakes` - Detailed mistake tracking per portion

### Key Relationships
```
User
  └── Sessions (1:many)
        ├── SessionPortions (1:many)
        └── Mistakes (1:many, linked to portions)
```

---

## 4. Core Features

### Authentication (EPIC-1)
- Google OAuth via Supabase
- Persistent sessions
- Protected routes

### Session Management (EPIC-2)
- Create sessions with multiple portions
- Log mistakes per portion
- View, edit, delete sessions
- Filter and search

### Dashboard (EPIC-3)
- Stats cards (sessions, performance, mistakes, streak)
- Activity heatmap
- Progress charts

### AI Chatbot (EPIC-4)
- Natural language session logging
- Mistake logging via conversation
- Voice input support
- Confirmation before save

### Profile (EPIC-5)
- User info display
- Account statistics
- Sign out

---

## 5. Agent Workflow

### Standard Workflow (Recommended)

See `AGENT-WORKFLOW-GUIDE.md` for complete details. Summary:

1. **Start session:** `/clear` → prompt with epic + task
2. **Create branch:** Claude auto-creates `epic-{n}-{name}` from main
3. **Per task:** Claude implements → tests → reports → you approve → commit
4. **Check context:** Run `/context` every 3-5 tasks
5. **End session:** Update STATUS.md → `/clear`
6. **Complete epic:** Human QA → merge to main

### Per-Task Flow

1. **Read LEARNINGS.md** for known issues (if relevant section exists)
2. **Read epic file** for task details
3. **TDD if required:** Write tests first for logic-heavy tasks (marked ⚠️ TDD)
4. **Implement** following acceptance criteria
5. **Run tests** specified in task
6. **Report results** and wait for approval
7. **Commit on approval**

### Task Size Guide
- **S:** ~500 tokens, 1 file
- **M:** ~1000 tokens, 1-2 files
- **L:** ~2000 tokens, 2-4 files
- **XL:** 3000+ tokens, split into smaller tasks

### On Failure / Blocked

**After 1st failure - ASSESS:**
- Human-required? (env vars, API keys, design decisions, external services) → **Ask immediately**
- Code/logic issue? → Check LEARNINGS.md, then try again

**After 2nd failure:** Research using Context7 or web search

**After 3rd failure:** Stop and ask human - don't waste more tokens

**Always human-required:**
- Missing environment variables or API keys
- OAuth/external service configuration
- Design or UX decisions
- Ambiguous requirements
- Hardware/device-specific issues

---

## 6. Testing Strategy

### Automated Testing (Maestro E2E)

Maestro is used for automated E2E testing of mobile functionality. Tests are defined in `.yaml` files in `tests/e2e/`.

**Running Tests:**
```bash
# Run all E2E tests
maestro test tests/e2e/

# Run specific epic tests
maestro test tests/e2e/auth/
maestro test tests/e2e/sessions/
maestro test tests/e2e/dashboard/
maestro test tests/e2e/ai/
maestro test tests/e2e/profile/
```

**What Maestro Tests Cover:**
- UI element visibility and testID verification
- Navigation flows between screens
- Form input and submission
- Button interactions
- Data display verification

**What Maestro Cannot Test (Human QA):**
- Visual design quality (colors, spacing, typography)
- Animation smoothness and feel
- Touch gesture responsiveness
- "Does this feel right?"
- OAuth flows (Google login)
- Speech recognition accuracy
- AI response quality

### Test Structure Per Epic

Each epic follows this pattern:
1. **Task implementation** - Build the feature
2. **E2E test task** - Add Maestro tests for the feature
3. **Human QA checkpoint** - Visual and feel verification

### Human QA Checkpoints

QA checkpoints are defined at end of each feature and epic. Human verification needed for:

- Visual correctness (layout, colors, spacing)
- Touch interactions and feel
- Animation smoothness
- "Does this feel right on device?"

### testID Conventions

All interactive/important UI elements should have a `testID` prop for Maestro testing:

```
Component Type      | Pattern                  | Examples
--------------------|--------------------------|----------------------------------
Buttons             | {action}-button          | sign-out-button, save-session-button
Inputs              | {field}-input            | duration-input, surah-search
Pickers/Selects     | {field}-picker           | session-type-picker, surah-picker-0
Cards/Items         | {type}-{id}              | session-item-123, stat-card-streak
Containers          | {name}-{type}            | session-list, stats-grid, chat-modal
Form Fields         | {form}-{field}           | session-form-duration
```

---

## 7. Success Criteria

### Technical
- App launches without crash
- All TypeScript compiles
- Tests pass
- API calls succeed

### User Experience
- Session creation < 2 minutes
- Dashboard loads < 2 seconds
- Intuitive navigation
- Works offline (cached data)

---

## 8. Environment Variables

```env
EXPO_PUBLIC_SUPABASE_URL=https://scqseishklizofqtddxr.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<from web app .env>
EXPO_PUBLIC_GEMINI_API_KEY=<your gemini api key>
```

---

## 9. Pre-Requisites Checklist

**Before starting EPIC-0, verify:**

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm 9+ installed (`npm --version`)
- [ ] Xcode installed (for iOS Simulator)
- [ ] iOS Simulator available (`xcrun simctl list devices`)
- [ ] Maestro CLI installed (`maestro --version`) - install during EPIC-0
- [ ] Supabase project exists with:
  - [ ] Google OAuth provider configured
  - [ ] Database tables from web app (sessions, session_portions, mistakes)
  - [ ] RLS policies configured
- [ ] Google Cloud project with Gemini API enabled (for EPIC-4)
- [ ] Environment variables ready (see section 8)

---

## 10. Getting Started

```bash
# 1. Install dependencies (see EPIC-0)
npm install

# 2. Copy environment variables
cp .env.example .env

# 3. Start development
npx expo start --ios

# 4. Run type check
npm run typecheck

# 5. Run tests
npm test
```

---

## 11. Cost Estimate

**With optimized setup (trimmed MCPs):**

| Scenario | Estimated Cost |
|----------|----------------|
| All tasks on Opus | $120-150 |
| Mixed (60% Sonnet, 40% Opus) | $70-90 |
| Heavy Sonnet usage | $50-70 |

**Factors that increase cost:**
- Keeping unnecessary MCP servers enabled (+$30-50)
- Not starting fresh sessions per epic (+$20-40)
- Many failed attempts / debugging (+$20-50)

**Total tasks:** 63 across 6 epics

---

**For detailed implementation tasks, see the epic files in `./epics/`**
