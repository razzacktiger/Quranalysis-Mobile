# EPIC-4: AI Chatbot

**Status:** Not Started
**Priority:** Medium

## Goal
Users can log sessions AND mistakes via natural language (text or voice).

## Features

| ID | Feature | Status | Tasks | Folder |
|----|---------|--------|-------|--------|
| 4.1 | AI Integration | Not Started | 4 | [features/4.1-ai-integration](./features/4.1-ai-integration/) |
| 4.2 | Chat UI | Not Started | 5 | [features/4.2-chat-ui](./features/4.2-chat-ui/) |
| 4.3 | Voice Input | Not Started | 4 | [features/4.3-voice-input](./features/4.3-voice-input/) |

## User Stories
- US-4.1: Describe session in natural language
- US-4.2: Log mistakes via conversation
- US-4.3: Use voice input instead of typing
- US-4.4: See extracted details before saving
- US-4.5: Correct extracted information

## Dependencies
- EPIC-0: Setup
- EPIC-1: Auth
- EPIC-2: Sessions

## Research Completed
- **LLM:** `specs/RESEARCH-llm-apis.md` → Firebase AI + Gemini 2.5 Flash
- **Voice:** `specs/RESEARCH-voice-input.md` → expo-speech-recognition

## Tech Stack
| Component | Technology | Fallback |
|-----------|------------|----------|
| LLM | Firebase AI + Gemini 2.5 Flash | OpenRouter + Claude |
| Voice | expo-speech-recognition | OpenAI Whisper API |

## Execution Order
```
4.1.1 → 4.1.2 → 4.1.3 → 4.1.4  (AI layer)
        ↓
4.3.1 → 4.3.2 → 4.3.3 → 4.3.4  (Voice layer - can parallel with 4.1)
        ↓
4.2.1 → 4.2.2 → 4.2.3 → 4.2.4 → 4.2.5  (UI integrates both)
```

## Definition of Done
- [ ] All features complete
- [ ] E2E tests pass
- [ ] Human QA approved
- [ ] Voice works on physical device
