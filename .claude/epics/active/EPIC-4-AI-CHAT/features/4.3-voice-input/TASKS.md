# Feature 4.3: Voice Input Tasks

**Research:** See `specs/RESEARCH-voice-input.md`
**Technology:** expo-speech-recognition (by jamsch)

---

## Task 4.3.1: Setup expo-speech-recognition

**Size:** M | **Files:** `app.json`, dev build configuration

### Installation
```bash
npx expo install expo-speech-recognition
```

### app.json Plugin Configuration
```json
{
  "expo": {
    "plugins": [
      [
        "expo-speech-recognition",
        {
          "microphonePermission": "Allow Quranalysis to use the microphone for voice input.",
          "speechRecognitionPermission": "Allow Quranalysis to use speech recognition for session logging."
        }
      ]
    ]
  }
}
```

### Development Build Required
Expo Go does NOT support expo-speech-recognition. Must create dev build:
```bash
npx expo prebuild
npx expo run:ios        # For iOS simulator
npx expo run:ios --device  # For physical device (recommended for testing)
```

### iOS Permissions
The plugin automatically adds to Info.plist:
- `NSSpeechRecognitionUsageDescription`
- `NSMicrophoneUsageDescription`

### Android Requirements
- Minimum API level 21
- On-device recognition requires API 33+ (Android 13)
- Google app must be installed for cloud recognition

### Verification Steps
1. Build app: `npx expo run:ios`
2. Launch on device/simulator
3. Check permissions are requested
4. Test with basic speech input

### Acceptance
- [x] Package installed
- [x] Plugin configured in app.json
- [ ] Dev build created successfully (user must run manually)
- [ ] Permissions appear on first use (verify after dev build)
- [ ] Basic recognition works on physical device (verify after dev build)

**Status:** ✅ Complete (config done, dev build pending user action)

---

## Task 4.3.2: Voice Input Hook

**Size:** M | **Files:** `lib/hooks/useVoiceInput.ts`

### Hook Interface
```typescript
interface UseVoiceInputReturn {
  isListening: boolean;      // Currently recording
  isSupported: boolean;      // Device supports speech recognition
  transcript: string;        // Current/final transcript
  error: string | null;      // Error message if any
  startListening: () => Promise<void>;
  stopListening: () => void;
  cancelListening: () => void;
}
```

### Key APIs from expo-speech-recognition

**Permission:**
- `ExpoSpeechRecognitionModule.requestPermissionsAsync()` → `{ granted, status }`

**Recognition Control:**
- `ExpoSpeechRecognitionModule.start(options)` - Begin recognition
- `ExpoSpeechRecognitionModule.stop()` - Stop and get final result
- `ExpoSpeechRecognitionModule.abort()` - Cancel without result

**Start Options:**
```typescript
{
  lang: 'en-US',           // Recognition language
  interimResults: true,    // Get partial results as user speaks
  continuous: true,        // Don't stop after silence
}
```

**Event Hooks:**
- `useSpeechRecognitionEvent('start', callback)` - Recognition started
- `useSpeechRecognitionEvent('end', callback)` - Recognition ended
- `useSpeechRecognitionEvent('result', callback)` - Got transcript result
- `useSpeechRecognitionEvent('error', callback)` - Error occurred

### Event Callback Data

**Result Event:**
```typescript
{
  results: [{
    transcript: string;     // Transcribed text
    confidence: number;     // 0-1 confidence score
    isFinal: boolean;       // Final result or interim
  }]
}
```

**Error Event:**
```typescript
{
  error: string;           // Error code
  message: string;         // Human-readable message
}
```

### isSupported Check
Check on mount if speech recognition is available:
```typescript
ExpoSpeechRecognitionModule.getSupportedLocales({})
  .then(locales => setIsSupported(locales.length > 0))
  .catch(() => setIsSupported(false));
```

### Error Messages to Handle
| Error Code | User Message |
|------------|--------------|
| `not-allowed` | "Microphone permission denied" |
| `no-speech` | "No speech detected. Please try again." |
| `network` | "Network error. Check your connection." |
| `audio-capture` | "Could not access microphone." |

### Acceptance
- [x] Hook returns all interface properties
- [x] Permission requested on first `startListening`
- [x] Real-time transcript updates via `interimResults`
- [x] `isSupported` correctly detects capability
- [x] Errors surfaced with user-friendly messages
- [x] Clean stop/cancel behavior

**Status:** ✅ Complete

---

## Task 4.3.3: Voice Input Button

**Size:** S | **Files:** `components/ai/VoiceInputButton.tsx`

### Props Interface
```typescript
interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;  // Called with final transcript
  disabled?: boolean;                     // Disable during loading
}
```

### Visual States

| State | Icon | Background | Text | Animation |
|-------|------|------------|------|-----------|
| Idle | `mic-outline` | #f3f4f6 | - | None |
| Listening | `mic` | #ef4444 | "Listening..." | Pulse |
| Disabled | `mic-outline` | #f3f4f6 @ 50% | - | None |
| Error | `alert-circle` | - | Error msg | None |
| Not Supported | (hidden) | - | - | - |

### Button Specs
- Size: 44x44 circular
- Touchable area: entire button
- Icon size: 22

### Pulse Animation
Use `react-native-reanimated`:
```typescript
// When listening starts:
scale.value = withRepeat(
  withSequence(
    withTiming(1.2, { duration: 500 }),
    withTiming(1.0, { duration: 500 })
  ),
  -1,  // Infinite repeat
  false
);

// When listening stops:
cancelAnimation(scale);
scale.value = withTiming(1.0);
```

### Behavior Flow
1. User taps button
2. If `isSupported === false`: do nothing (button hidden)
3. If `!isListening`: call `startListening()`, show pulse
4. If `isListening`: call `stopListening()`, stop pulse
5. When recognition ends with transcript: call `onTranscript(transcript)`

### Transcript Preview (Optional)
While listening, show real-time transcript in tooltip above button:
- Position: absolute, above button
- Background: dark (#1f2937)
- Max 2 lines, truncated

### Acceptance
- [ ] Button hidden when not supported
- [ ] Pulse animation when listening
- [ ] Red background when listening
- [ ] Tapping toggles listening state
- [ ] Final transcript passed to `onTranscript`
- [ ] Error state shows alert icon

---

## Task 4.3.4: E2E Test

**Size:** S | **Files:** `tests/e2e/ai/voice-input.yaml`

### Test Flow
```yaml
# tests/e2e/ai/voice-input.yaml
appId: com.quranalysis.mobile
name: Voice Input - UI States
---
- launchApp
- waitForAnimationToEnd

# Open chat modal
- tapOn:
    id: "floating-chat-button"
- waitForAnimationToEnd

# Verify voice button exists
- assertVisible:
    id: "voice-input-button"

# Tap to start listening
- tapOn:
    id: "voice-input-button"

# May show permission dialog - accept if appears
# (Maestro may need to handle this manually)

# Verify listening indicator
- assertVisible:
    id: "voice-listening-indicator"

# Tap to stop listening
- tapOn:
    id: "voice-input-button"

# Verify back to idle
- assertNotVisible:
    id: "voice-listening-indicator"
```

### Limitations
- Cannot test actual speech recognition in Maestro
- Cannot simulate microphone input
- Test only verifies UI state transitions
- Manual testing required on physical device

### Manual Test Checklist
- [ ] Permission prompt appears on first use
- [ ] Accepting permission enables recognition
- [ ] Speaking produces transcript
- [ ] Transcript appears in chat input
- [ ] Stopping sends message (if transcript exists)
- [ ] Denying permission shows error state

### Acceptance
- [ ] E2E test passes for UI states
- [ ] Manual testing confirms speech works on device
