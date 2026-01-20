# EPIC-4: AI Chatbot

**Status:** Not Started
**Priority:** Medium

## Goal
Users can log sessions AND mistakes via natural language (text or voice).

## Features

| ID | Feature | Status | Tasks |
|----|---------|--------|-------|
| 4.1 | AI Integration | Not Started | 4 |
| 4.2 | Chat UI | Not Started | 5 |
| 4.3 | Voice Input | Not Started | 4 |

## User Stories
- US-4.1: As a user, I can describe my session in natural language
- US-4.2: As a user, I can log mistakes via conversation
- US-4.3: As a user, I can use voice input instead of typing
- US-4.4: As a user, I see extracted details before saving
- US-4.5: As a user, I can correct extracted information

## Dependencies
- EPIC-0: Setup
- EPIC-1: Auth
- EPIC-2: Sessions (session creation)

## Definition of Done
- [ ] All features complete
- [ ] E2E tests pass
- [ ] Human QA approved
- [ ] Voice input works on physical device

## Technical Notes
- Research required for Gemini API React Native integration
- Research required for speech recognition (Expo compatibility)
- Voice is optional/graceful fallback if not supported

## Full Task Details
See [TASKS.md](./TASKS.md) for complete task breakdown and acceptance criteria.
