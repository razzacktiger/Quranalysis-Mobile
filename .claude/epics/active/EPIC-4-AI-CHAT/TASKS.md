# EPIC-4: AI Chatbot

**Goal:** Users can log sessions AND mistakes via natural language (text or voice).
**Estimate:** 10 tasks, ~5500 tokens total
**Deps:** EPIC-0, EPIC-1, EPIC-2 (session creation)
**Priority:** Medium - implement after core features work

---

## User Stories

- US-4.1: As a user, I can describe my session in natural language
- US-4.2: As a user, I can log mistakes via conversation
- US-4.3: As a user, I can use voice input instead of typing
- US-4.4: As a user, I see extracted details before saving
- US-4.5: As a user, I can correct extracted information

---

## Feature 4.1: AI Integration

### Task 4.1.1: Research & Setup Gemini API Client

**Size:** M (~700 tokens)
**Files:** `lib/api/ai.ts`
**Deps:** None

**IMPORTANT - Agent Must Research:**
Before implementing, verify:
1. Current Gemini SDK for React Native/Expo compatibility
2. Check if `@google/generative-ai` works in React Native or if REST API is better
3. Verify latest model names (gemini-1.5-flash, gemini-2.0-flash, etc.)
4. Check Expo compatibility and any polyfill requirements

**Research Commands:**
```bash
# Check npm for latest package
npm info @google/generative-ai

# Search web for "Gemini API React Native 2025" for current best practices
```

**Possible Approaches (verify which is current best practice):**
1. `@google/generative-ai` npm package (may need polyfills)
2. Direct REST API calls to `https://generativelanguage.googleapis.com/v1beta/`
3. Vertex AI SDK if available for React Native

**Acceptance Criteria:**
- [ ] Working Gemini API integration (SDK or REST)
- [ ] API key from environment variable (EXPO_PUBLIC_GEMINI_API_KEY)
- [ ] `sendMessage(prompt, systemPrompt)` function
- [ ] Error handling for API failures
- [ ] Verified working in Expo/React Native environment

**Test:**
```bash
npm run typecheck
npx expo start --ios
# Manual: test with simple prompt, verify response received
```

**Promise:** `<promise>4.1.1-DONE</promise>`

**On Failure:**
- Check if SDK requires node polyfills
- Try REST API approach instead
- Verify API key is valid and has quota
- Check network connectivity in simulator

---

### Task 4.1.2: Create Session Extraction Prompt

**Size:** L (~1000 tokens)
**Files:** `lib/api/prompts.ts`
**Deps:** 4.1.1, 0.3.1

**Acceptance Criteria:**
- [ ] System prompt for session extraction
- [ ] Extracts: surah name, ayah range, duration, session type, performance, recency
- [ ] Returns structured JSON matching SessionFormData
- [ ] Handles ambiguous input gracefully
- [ ] Asks for missing required fields
- [ ] Supports multiple portions in one message

**Test Inputs:**
```
"I practiced Al-Fatiha for 20 minutes"
"Memorized surah yaseen ayah 1-10 today, went well"
"Quick review of juz 30, Al-Naba and Al-Nazi'at"
```

**Prompt Output Schema:**
```json
{
  "session": {
    "duration_minutes": number | null,
    "session_type": "reading_practice" | "memorization" | "audit" | "mistake_session" | "practice_test" | "study_session" | null,
    "performance_score": number | null,
    "session_goal": string | null
  },
  "portions": [
    {
      "surah_name": string | null,
      "ayah_start": number | null,
      "ayah_end": number | null,
      "recency_category": "new" | "recent" | "reviewing" | "maintenance" | null,
      "repetition_count": number | null
    }
  ],
  "missing_fields": string[],
  "follow_up_question": string | null,
  "confidence": "high" | "medium" | "low"
}
```

**Promise:** `<promise>4.1.2-DONE</promise>`

---

### Task 4.1.3: Create Mistake Extraction Prompt

**Size:** L (~1000 tokens)
**Files:** `lib/api/prompts.ts` (update)
**Deps:** 4.1.1, 0.3.1

**Acceptance Criteria:**
- [ ] System prompt for mistake extraction
- [ ] Extracts: error category, subcategory, severity, ayah number, notes
- [ ] Understands Quranic terminology (tajweed, makhraj, ghunna, etc.)
- [ ] Maps natural language to ErrorCategory and ErrorSubcategory enums
- [ ] Handles multiple mistakes in one message
- [ ] Links mistakes to correct portion (by surah context)

**Test Inputs:**
```
"I made a tajweed mistake on ayah 5, forgot the ghunna"
"Kept hesitating on verse 10-12"
"Mixed up the similar verses in Al-Baqarah"
```

**Prompt Output Schema:**
```json
{
  "mistakes": [
    {
      "portion_surah": string,
      "error_category": "pronunciation" | "tajweed" | "memorization" | "fluency" | "waqf" | "translation" | "other",
      "error_subcategory": string | null,
      "severity_level": 1 | 2 | 3 | 4 | 5,
      "ayah_number": number | null,
      "additional_notes": string | null
    }
  ],
  "follow_up_question": string | null,
  "confidence": "high" | "medium" | "low"
}
```

**Natural Language Mappings (include in prompt):**
| User Says | Maps To |
|-----------|---------|
| "tajweed mistake", "ghunna", "madd", "idgham" | tajweed category |
| "forgot the word", "skipped verse", "mixed up" | memorization category |
| "hesitated", "stumbled", "repeated myself" | fluency category |
| "wrong stop", "didn't stop", "stopped wrongly" | waqf category |
| "pronunciation", "makhraj", "letter sound" | pronunciation category |

**Promise:** `<promise>4.1.3-DONE</promise>`

---

### Task 4.1.4: Create useAIChat Hook

**Size:** M (~800 tokens)
**Files:** `lib/hooks/useAIChat.ts`
**Deps:** 4.1.2, 4.1.3

**Acceptance Criteria:**
- [ ] Manages chat state (messages array)
- [ ] `sendMessage(text)` adds to history and calls API
- [ ] Detects intent: session logging vs mistake logging
- [ ] Parses AI response JSON (with error handling for malformed responses)
- [ ] Tracks extracted session AND mistakes data
- [ ] Accumulates portions and mistakes across messages
- [ ] Handles loading/error states
- [ ] `clearChat()` resets state
- [ ] `getCurrentExtraction()` returns combined data

**Test:**
```bash
npm run typecheck
```

**State Structure:**
```typescript
interface ChatState {
  messages: Message[];
  extractedSession: Partial<SessionFormData> | null;
  extractedMistakes: MistakeFormData[];
  isLoading: boolean;
  error: string | null;
}
```

**Promise:** `<promise>4.1.4-DONE</promise>`

---

## Feature 4.2: Chat UI

### Task 4.2.1: Create Chat Message Component

**Size:** S (~400 tokens)
**Files:** `components/ai/ChatMessage.tsx`
**Deps:** 0.1.3

**Acceptance Criteria:**
- [ ] User message bubble (right-aligned, primary color)
- [ ] AI message bubble (left-aligned, gray)
- [ ] Timestamp display
- [ ] Loading indicator for pending AI response
- [ ] Extraction preview inline (shows what was understood)

**Test:**
```bash
npx expo start --ios
# Verify message bubbles render correctly
```

**Promise:** `<promise>4.2.1-DONE</promise>`

---

### Task 4.2.2: Create Chat Modal

**Size:** L (~1200 tokens)
**Files:** `components/ai/ChatModal.tsx`
**Deps:** 4.1.4, 4.2.1, 4.3.2 (voice input)

**IMPORTANT - Agent Must Research:**
Verify best approach for keyboard-aware modal in React Native:
- `KeyboardAvoidingView` behavior differences iOS vs Android
- May need `react-native-keyboard-aware-scroll-view`
- Check Expo compatibility

**Acceptance Criteria:**
- [ ] Modal overlay with chat interface
- [ ] Message list (scrollable, auto-scroll to bottom)
- [ ] Text input at bottom with voice button
- [ ] Send button
- [ ] Close button
- [ ] Keyboard-aware (input stays above keyboard)
- [ ] Initial greeting with capabilities
- [ ] Quick action chips: "Log session", "Add mistake"
- [ ] Shows extraction progress summary

**Test:**
```bash
npx expo start --ios
# Open chat, type message, verify AI responds
# Test keyboard behavior
```

**Initial Greeting:**
```
"Hi! I can help you log your practice sessions and mistakes.

Try saying or typing:
- 'I practiced Al-Fatiha for 20 minutes'
- 'I made a tajweed mistake on ayah 5'
- 'Review of Surah Yaseen, made 3 hesitation errors'

What would you like to log?"
```

**Promise:** `<promise>4.2.2-DONE</promise>`

---

### Task 4.2.3: Create Confirmation Screen

**Size:** L (~1000 tokens)
**Files:** `components/ai/SessionConfirmation.tsx`
**Deps:** 4.1.4, 2.1.2

**Acceptance Criteria:**
- [ ] Displays extracted session data in readable format
- [ ] Shows portions with surah, ayah range
- [ ] Shows mistakes grouped by portion
- [ ] Edit button for each field/item
- [ ] "Add More" button to continue conversation
- [ ] "Save Session" button
- [ ] "Cancel" button
- [ ] Calls createSession on confirm (with portions + mistakes)
- [ ] Shows success/error feedback

**Test:**
```bash
npx expo start --ios
# Extract session via chat, add mistakes, verify confirmation shows all data
# Confirm, verify session + mistakes saved
```

**Layout:**
```
--- Session Details ---
Date: [editable]
Duration: [editable]
Type: [editable]
Performance: [editable]

--- Portions ---
1. Al-Fatiha (1-7) [edit] [remove]
2. Al-Baqarah (1-20) [edit] [remove]

--- Mistakes ---
[Portion: Al-Fatiha]
- Tajweed/Ghunna, Ayah 3, Severity 2 [edit] [remove]

[Portion: Al-Baqarah]
- Memorization/Hesitation, Ayah 15, Severity 3 [edit] [remove]

[+ Add More via Chat]
[Save Session] [Cancel]
```

**Promise:** `<promise>4.2.3-DONE</promise>`

---

### Task 4.2.4: Add Floating Chat Button

**Size:** S (~400 tokens)
**Files:** `components/ai/FloatingChatButton.tsx`, `app/(tabs)/_layout.tsx` (update)
**Deps:** 4.2.2

**Acceptance Criteria:**
- [ ] Circular button in bottom-right corner
- [ ] Chat icon (use Ionicons or similar from @expo/vector-icons)
- [ ] Positioned above tab bar (use safe area insets)
- [ ] Opens ChatModal on press
- [ ] Visible on all main screens
- [ ] Badge indicator if extraction in progress (optional)

**Test:**
```bash
npx expo start --ios
# Verify button visible on dashboard, sessions, add screens
# Tap to open chat
```

**Promise:** `<promise>4.2.4-DONE</promise>`

---

### Task 4.2.5: E2E Test - Chat Modal

**Size:** M (~600 tokens)
**Files:** `tests/e2e/ai/chat-modal.yaml`, `tests/e2e/ai/session-extraction.yaml`
**Deps:** 4.2.4, 0.5.1

**Maestro Tests:**

**tests/e2e/ai/chat-modal.yaml:**
```yaml
appId: com.quranalysis.mobile
name: AI Chat - Modal Opens and Closes
---
- launchApp

# Verify floating chat button is visible
- assertVisible:
    id: "floating-chat-button"

# Open chat modal
- tapOn:
    id: "floating-chat-button"

# Verify chat modal is open
- assertVisible:
    id: "chat-modal"
- assertVisible: "I can help you log"

# Verify input area is present
- assertVisible:
    id: "chat-input"
- assertVisible:
    id: "voice-input-button"

# Close modal
- tapOn:
    id: "chat-close-button"

# Verify modal is closed
- assertNotVisible:
    id: "chat-modal"
```

**tests/e2e/ai/session-extraction.yaml:**
```yaml
appId: com.quranalysis.mobile
name: AI Chat - Session Extraction Flow
---
- launchApp

# Open chat modal
- tapOn:
    id: "floating-chat-button"

# Type a session description
- inputText:
    id: "chat-input"
    text: "I practiced Al-Fatiha for 20 minutes"

# Send message
- tapOn:
    id: "chat-send-button"

# Wait for AI response (may take a few seconds)
- extendedWaitUntil:
    visible:
      id: "ai-response"
    timeout: 10000

# Verify extraction appears
- assertVisible: "Al-Fatiha"
- assertVisible: "20 minutes"

# Proceed to confirmation
- tapOn: "Review & Save"

# Verify confirmation screen
- assertVisible:
    id: "session-confirmation"
- assertVisible: "Al-Fatiha"
```

**Test:**
```bash
maestro test tests/e2e/ai/chat-modal.yaml
maestro test tests/e2e/ai/session-extraction.yaml
```

**Promise:** `<promise>4.2.5-DONE</promise>`

**Notes:**
- AI response timing may vary; use extended wait
- Tests verify UI flow, not AI accuracy (that's manual QA)
- Mock AI responses may be needed for consistent tests

---

## Feature 4.3: Voice Input

### Task 4.3.1: Research & Setup Speech Recognition

**Size:** M (~600 tokens)
**Files:** `lib/voice/speechRecognition.ts`
**Deps:** None (can start in parallel with 4.1.x)

**IMPORTANT - Agent Must Research:**
Before implementing, verify current best approach for Expo/React Native:

**Options to evaluate:**
1. **`expo-speech-recognition`** - If available in current Expo SDK
2. **`@react-native-voice/voice`** - Popular community package
   - Check Expo compatibility (may need dev client, not Expo Go)
3. **`expo-av`** - Record audio + send to Whisper API
4. **Native iOS Speech Framework** - Via expo-modules or native code

**Research Commands:**
```bash
# Check if expo has built-in speech recognition
npx expo install expo-speech-recognition

# Check community package
npm info @react-native-voice/voice

# Search: "Expo speech to text 2025" for current recommendations
```

**Key Considerations:**
- Does it work in Expo Go or requires dev client?
- iOS permissions required (microphone, speech recognition)
- Offline vs online recognition
- Language support (English primary, Arabic nice-to-have)

**Acceptance Criteria:**
- [ ] Speech recognition library installed and configured
- [ ] Works on iOS (simulator may not work - test on device)
- [ ] Permissions handled correctly
- [ ] Returns transcribed text

**Test:**
```bash
npx expo start --ios
# On physical device: test speech recognition
```

**Promise:** `<promise>4.3.1-DONE</promise>`

**On Failure:**
- If Expo Go doesn't support, document need for dev client build
- Consider Whisper API as fallback (record audio, send to API)

---

### Task 4.3.2: Create Voice Input Hook

**Size:** M (~700 tokens)
**Files:** `lib/hooks/useVoiceInput.ts`
**Deps:** 4.3.1

**Acceptance Criteria:**
- [ ] `startListening()` - begins speech recognition
- [ ] `stopListening()` - ends recognition, returns text
- [ ] `isListening` - current state
- [ ] `transcript` - real-time partial transcript (if supported)
- [ ] `error` - error state
- [ ] Handles permissions request
- [ ] Auto-stops after silence (configurable timeout)

**Test:**
```bash
npm run typecheck
# On device: test voice input returns text
```

**Hook Interface:**
```typescript
interface UseVoiceInputReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  error: string | null;
  startListening: () => Promise<void>;
  stopListening: () => Promise<string>;
  cancelListening: () => void;
}
```

**Promise:** `<promise>4.3.2-DONE</promise>`

---

### Task 4.3.3: Create Voice Input Button Component

**Size:** S (~500 tokens)
**Files:** `components/ai/VoiceInputButton.tsx`
**Deps:** 4.3.2

**Acceptance Criteria:**
- [ ] Microphone icon button
- [ ] Visual feedback when listening (pulsing animation, color change)
- [ ] Shows real-time transcript preview (if available)
- [ ] Tap to start, tap again to stop
- [ ] Long press alternative: hold to talk, release to send
- [ ] Error state (no permission, not supported)
- [ ] Integrates with chat input

**Test:**
```bash
npx expo start --ios
# Verify button shows in chat input area
# Test listening state visual feedback
```

**States:**
- Idle: gray microphone icon
- Listening: red/pulsing microphone, "Listening..." text
- Processing: spinner
- Error: error icon with message

**Promise:** `<promise>4.3.3-DONE</promise>`

---

### Task 4.3.4: E2E Test - Voice Input UI

**Size:** S (~400 tokens)
**Files:** `tests/e2e/ai/voice-input.yaml`
**Deps:** 4.3.3, 0.5.1

**Maestro Test:**

**tests/e2e/ai/voice-input.yaml:**
```yaml
appId: com.quranalysis.mobile
name: AI Chat - Voice Input Button
---
- launchApp

# Open chat modal
- tapOn:
    id: "floating-chat-button"

# Verify voice input button is present
- assertVisible:
    id: "voice-input-button"

# Tap voice button to start listening
- tapOn:
    id: "voice-input-button"

# Verify listening state (may show permission dialog on first use)
# Note: Actual speech recognition cannot be automated
- assertVisible:
    id: "voice-listening-indicator"

# Tap again to stop
- tapOn:
    id: "voice-input-button"

# Verify returns to idle state
- assertNotVisible:
    id: "voice-listening-indicator"
```

**Test:**
```bash
maestro test tests/e2e/ai/voice-input.yaml
```

**Promise:** `<promise>4.3.4-DONE</promise>`

**Notes:**
- Actual speech recognition cannot be automated in Maestro
- Test verifies UI states only (idle → listening → idle)
- Manual testing required for actual speech-to-text functionality
- May need to dismiss permission dialog on first run

---

## 🧑‍💻 Human QA: Feature 4.2 (Chat UI)

- [ ] Chat modal opens/closes smoothly
- [ ] Messages display correctly
- [ ] Keyboard doesn't cover input
- [ ] Quick action chips work
- [ ] AI responds within reasonable time
- [ ] All Maestro tests pass: `maestro test tests/e2e/ai/chat-modal.yaml`

---

## 🧑‍💻 Human QA: Feature 4.3 (Voice Input)

- [ ] Voice button visible in chat
- [ ] Visual feedback when listening
- [ ] Speech recognition works (physical device only)
- [ ] Transcript sent to AI correctly
- [ ] Permission handling works
- [ ] All Maestro tests pass: `maestro test tests/e2e/ai/voice-input.yaml`

---

## 🧑‍💻 Human QA: EPIC-4

**After Feature 4.1 (AI Integration):**
- [ ] AI extracts session details correctly
- [ ] AI extracts mistake details correctly
- [ ] Missing fields trigger follow-up
- [ ] Multiple portions/mistakes handled
- [ ] No API errors or timeouts

**After Feature 4.2 (Chat UI):**
- [ ] Chat modal opens/closes smoothly
- [ ] Messages display correctly
- [ ] Keyboard doesn't cover input
- [ ] Confirmation shows all extracted data
- [ ] Session with portions AND mistakes saves correctly

**After Feature 4.3 (Voice Input):**
- [ ] Voice button visible in chat
- [ ] Speech recognition works (on physical device)
- [ ] Transcript sent to AI correctly
- [ ] Permission handling works
- [ ] Graceful fallback if not supported

**Test Scenarios:**

1. **Session only (text):**
   - Input: "I practiced Al-Fatiha for 20 minutes"
   - Expected: Session extracted, no mistakes

2. **Session with mistakes (text):**
   - Input: "Memorized Surah Yaseen ayah 1-10, made a few hesitation mistakes on ayah 5 and 7"
   - Expected: Session + 2 mistakes extracted

3. **Voice input:**
   - Tap mic, say "I reviewed Al-Baqarah for 30 minutes"
   - Expected: Speech transcribed, sent to AI, session extracted

4. **Multi-turn conversation:**
   - Input 1: "I reviewed juz 30 today"
   - AI asks: "Which surahs did you cover?"
   - Input 2 (voice): "Al-Naba and An-Nazi'at"
   - Expected: Portions added to extraction

---

## Dependencies Graph

```
Feature 4.1 (AI):
4.1.1 (Gemini Client - RESEARCH FIRST)
  ↓
4.1.2 (Session Prompt)
4.1.3 (Mistake Prompt)
  ↓
4.1.4 (useAIChat)

Feature 4.3 (Voice) - CAN RUN IN PARALLEL:
4.3.1 (Speech Recognition - RESEARCH FIRST)
  ↓
4.3.2 (useVoiceInput)
  ↓
4.3.3 (VoiceInputButton)
  ↓
4.3.4 (Voice E2E) → **Human QA**

Feature 4.2 (UI) - AFTER 4.1 AND 4.3:
4.2.1 (ChatMessage)
  ↓
4.2.2 (ChatModal) ← 4.1.4, 4.3.3
  ↓
4.2.3 (Confirmation)
  ↓
4.2.4 (Floating Button)
  ↓
4.2.5 (Chat E2E) → **Human QA**
```

**Recommended Order:**
1. Start in parallel:
   - 4.1.1 → 4.1.2 → 4.1.3 → 4.1.4 (AI layer)
   - 4.3.1 → 4.3.2 → 4.3.3 → 4.3.4 (Voice layer) → **Human QA**
2. Then: 4.2.1 → 4.2.2 → 4.2.3 → 4.2.4 → 4.2.5 (UI integrates both) → **Human QA**
3. **Final Human QA for EPIC-4**

---

## Technical Notes for Agent

### API Integration Research Checklist
Before implementing 4.1.1, verify:
- [ ] Check `@google/generative-ai` npm page for React Native compatibility
- [ ] Search for "Gemini API React Native 2025" for current best practices
- [ ] Check if REST API is more reliable than SDK in RN environment
- [ ] Verify model names (may have changed)
- [ ] Check Expo forums for any known issues

### Voice Input Research Checklist
Before implementing 4.3.1, verify:
- [ ] Check Expo SDK for built-in speech recognition
- [ ] Check `@react-native-voice/voice` Expo compatibility
- [ ] Determine if Expo Go supports it or needs dev client
- [ ] Check iOS permissions requirements
- [ ] Consider Whisper API as backup option

### Fallback Strategies

**If Gemini SDK doesn't work:**
1. Use direct REST API calls
2. Create simple fetch wrapper

**If speech recognition doesn't work in Expo Go:**
1. Document as "requires dev client build"
2. OR use Whisper API (record with expo-av, transcribe via API)
3. Make voice input optional (text always works)

### AI Prompt Engineering Notes

**Key Challenges:**
1. Mapping natural language to exact enum values
2. Inferring ayah numbers from context
3. Handling ambiguous input ("a few mistakes")
4. Maintaining context across conversation turns

**Fallback Behavior:**
- If AI can't extract, show form with whatever was understood
- User can complete missing fields manually
- Never save incomplete data without confirmation
