# Feature 4.3: Voice Input

## Overview
Speech-to-text input for hands-free session logging.

## Tasks

| ID | Task | Size | Status | TDD | UI | Notes |
|----|------|------|--------|-----|----|----|
| 4.3.1 | Research & Setup Speech Recognition | M | Not Started | - | - | RESEARCH FIRST |
| 4.3.2 | Create Voice Input Hook | M | Not Started | - | - | - |
| 4.3.3 | Create Voice Input Button Component | S | Not Started | - | Yes | Pulsing animation |
| 4.3.4 | E2E Test - Voice Input UI | S | Not Started | - | - | voice-input.yaml |

## Acceptance Criteria
- [ ] Speech recognition works on iOS physical device
- [ ] Visual feedback when listening
- [ ] Transcript sent to AI
- [ ] Graceful fallback if not supported

## Research Checklist (4.3.1)
- [ ] Check Expo SDK for built-in speech recognition
- [ ] Check `@react-native-voice/voice` Expo compatibility
- [ ] Determine if Expo Go supports it or needs dev client
- [ ] Check iOS permissions requirements
- [ ] Consider Whisper API as backup option

## Options to Evaluate
1. `expo-speech-recognition` - If available in current Expo SDK
2. `@react-native-voice/voice` - Popular community package
3. `expo-av` + Whisper API - Record audio + send to API
4. Native iOS Speech Framework - Via expo-modules

## Hook Interface
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

## Button States
- Idle: gray microphone icon
- Listening: red/pulsing microphone, "Listening..." text
- Processing: spinner
- Error: error icon with message

## Fallback Strategy
If speech recognition doesn't work:
1. Document as "requires dev client build"
2. OR use Whisper API (record with expo-av, transcribe via API)
3. Make voice input optional (text always works)
