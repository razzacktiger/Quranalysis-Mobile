# Project Structure Overview

**Project:** Quranalysis Mobile (React Native/Expo)
**Purpose:** Guide AI agents and developers to write consistent, maintainable code.

## Directory Layout

```
app/                    # Expo Router pages (file-based routing)
├── (auth)/            # Auth group (login, etc.)
├── (tabs)/            # Main tab navigation
│   ├── index.tsx      # Dashboard (default tab)
│   ├── sessions.tsx   # Sessions list
│   ├── add.tsx        # Add session
│   └── profile.tsx    # User profile
├── _layout.tsx        # Root layout
└── session/[id].tsx   # Dynamic route

components/             # Reusable components
├── ui/                # Generic UI (Button, Card, Input)
├── forms/             # Form components (SessionForm, etc.)
├── sessions/          # Session-specific components
├── analytics/         # Charts, stats components
├── ai/                # Chat, voice components
└── profile/           # Profile components

lib/                    # Business logic & utilities
├── api/               # API clients (Supabase, Gemini)
├── auth/              # Auth context & hooks
├── hooks/             # Custom React hooks
├── utils/             # Pure utility functions
├── validation/        # Zod schemas
└── voice/             # Speech recognition

types/                  # TypeScript type definitions
constants/              # App constants, enums
tests/                  # Test files
└── e2e/               # Maestro E2E tests
```

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `SessionCard.tsx` |
| Hooks | camelCase, use* prefix | `useStats.ts` |
| Utilities | camelCase | `formatDate.ts` |
| Types | PascalCase | `session.ts` (contains `SessionData`) |
| Constants | SCREAMING_SNAKE | `SESSION_TYPES` |
| Test files | *.test.ts | `stats.test.ts` |
| E2E tests | kebab-case.yaml | `create-session.yaml` |
