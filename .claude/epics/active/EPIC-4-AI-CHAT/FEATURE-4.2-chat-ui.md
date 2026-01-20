# Feature 4.2: Chat UI

## Overview
Chat interface for conversational session and mistake logging.

## Tasks

| ID | Task | Size | Status | TDD | UI | Notes |
|----|------|------|--------|-----|----|----|
| 4.2.1 | Create Chat Message Component | S | Not Started | - | Yes | User/AI bubbles |
| 4.2.2 | Create Chat Modal | L | Not Started | - | Yes | Keyboard-aware |
| 4.2.3 | Create Confirmation Screen | L | Not Started | - | Yes | Review + edit |
| 4.2.4 | Add Floating Chat Button | S | Not Started | - | Yes | On all screens |
| 4.2.5 | E2E Test - Chat Modal | M | Not Started | - | - | chat-modal.yaml |

## Acceptance Criteria
- [ ] Chat modal opens/closes smoothly
- [ ] Messages display correctly (user right, AI left)
- [ ] Keyboard doesn't cover input
- [ ] Confirmation shows all extracted data
- [ ] Session with portions AND mistakes saves correctly

## Dependencies
- 4.1.4 (useAIChat hook)
- 4.3.3 (VoiceInputButton)

## Layout: Chat Modal
```
┌─────────────────────────────┐
│ [X] AI Assistant            │
├─────────────────────────────┤
│ Messages scroll area        │
│ - AI: "Hi! I can help..."   │
│ - User: "I practiced..."    │
│ - AI: "Got it! I extracted" │
│                             │
├─────────────────────────────┤
│ [Quick chips: Log session]  │
├─────────────────────────────┤
│ [Input field      ] [mic]   │
└─────────────────────────────┘
```

## Layout: Confirmation Screen
```
--- Session Details ---
Date: [editable]
Duration: [editable]
Type: [editable]

--- Portions ---
1. Al-Fatiha (1-7) [edit] [remove]

--- Mistakes ---
[Portion: Al-Fatiha]
- Tajweed/Ghunna, Ayah 3 [edit] [remove]

[+ Add More] [Save Session] [Cancel]
```
