# Research: Voice Input for React Native (Expo)

## Date
2026-01-20

## Question
What is the best approach for speech-to-text voice input in an Expo SDK 54 app, compatible with iOS and Android, for hands-free session logging?

## Requirements
- Expo SDK 54 compatibility
- iOS and Android support
- Real-time transcription feedback
- Works with development builds (not Expo Go)
- Graceful fallback if not supported
- Arabic language support (for Quranic terms) is a plus

---

## Options Evaluated

### Option 1: expo-speech-recognition (by jamsch)

**Overview:**
Community package implementing native Speech Recognition for iOS, Android, and Web in Expo projects.

**Pros:**
- Built specifically for Expo
- Native platform APIs (no network required for basic usage)
- Real-time transcription with `interimResults`
- iOS on-device recognition support
- Web support for universal apps
- Clean hook-based API (`useSpeechRecognitionEvent`)
- Continuous mode for longer input
- Language detection on Android 14+
- Good documentation with examples
- Active maintenance

**Cons:**
- Requires development build (no Expo Go)
- iOS file transcription limited to 1 minute
- Android on-device recognition requires API 33+
- Some Android devices may have limited language support
- No guaranteed Arabic support on all devices

**Pricing:** Free (uses native platform APIs)

**Expo Compatible:** Yes (requires dev build)

**Integration Effort:** S

**Code Example:**
```typescript
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

function VoiceInput() {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);

  useSpeechRecognitionEvent("start", () => setIsListening(true));
  useSpeechRecognitionEvent("end", () => setIsListening(false));
  useSpeechRecognitionEvent("result", (event) => {
    setTranscript(event.results[0]?.transcript);
  });

  const handleStart = async () => {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!result.granted) return;

    ExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: true,
      continuous: false,
    });
  };

  return (
    <Button
      title={isListening ? "Stop" : "Start"}
      onPress={isListening ? ExpoSpeechRecognitionModule.stop : handleStart}
    />
  );
}
```

---

### Option 2: whisper.rn (On-device Whisper)

**Overview:**
React Native binding of whisper.cpp for on-device OpenAI Whisper model inference.

**Pros:**
- State-of-the-art transcription accuracy
- Works completely offline
- Excellent multilingual support (including Arabic)
- Real-time transcription with VAD (Voice Activity Detection)
- Privacy-focused (no data sent to servers)
- Consistent behavior across devices

**Cons:**
- Large model file downloads (50MB-1.5GB depending on model)
- Higher memory/CPU usage on mobile
- Slower startup time (model loading)
- Requires prebuild (no Expo Go)
- iOS works seamlessly, Android has latency issues
- Complex setup with ffmpeg for optimal results

**Pricing:** Free (open source)

**Expo Compatible:** Yes (requires prebuild)

**Integration Effort:** L

**Notes:**
Android issues observed - may need to record with expo-av, convert with ffmpeg-kit-react-native to 16000 bitrate for reliable results.

---

### Option 3: whisper-kit-expo (iOS Only)

**Overview:**
Expo wrapper for Apple's WhisperKit library - optimized on-device transcription for Apple devices.

**Pros:**
- Optimized for Apple Silicon
- Fast on-device transcription
- Excellent accuracy
- Low memory footprint
- Clean Expo integration

**Cons:**
- **iOS only - no Android support**
- Requires development build
- Newer library, less battle-tested

**Pricing:** Free

**Expo Compatible:** Yes (iOS only, requires prebuild)

**Integration Effort:** M

---

### Option 4: OpenAI Whisper API (Cloud)

**Overview:**
Cloud-based transcription using OpenAI's Whisper API - record audio with expo-av and send to API.

**Pros:**
- Best-in-class accuracy
- Excellent multilingual support
- No device performance concerns
- Consistent results across all devices
- Simple integration (just HTTP calls)

**Cons:**
- Requires network connection
- API costs ($0.006/minute)
- Latency (record → upload → transcribe → respond)
- Privacy concerns (audio sent to cloud)
- Not real-time (batch transcription)

**Pricing:** $0.006 per minute of audio

**Expo Compatible:** Yes

**Integration Effort:** M

**Code Example:**
```typescript
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';

async function transcribeAudio(audioUri: string): Promise<string> {
  const response = await FileSystem.uploadAsync(
    'https://api.openai.com/v1/audio/transcriptions',
    audioUri,
    {
      httpMethod: 'POST',
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: 'file',
      parameters: {
        model: 'whisper-1',
        language: 'en',
      },
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    }
  );
  const result = JSON.parse(response.body);
  return result.text;
}
```

---

### Option 5: @react-native-voice/voice

**Overview:**
Popular community library for speech recognition in React Native.

**Pros:**
- Large community, well-documented
- Both online and offline support
- Mature library

**Cons:**
- **Known Expo SDK 54 compatibility issues**
- Depends on outdated `@expo/config-plugins@2.0.4` (SDK 54 expects ~9.0.0)
- Requires native code (no Expo Go)
- May require patch-package to work with current Expo

**Pricing:** Free

**Expo Compatible:** Partially (needs patches for SDK 54)

**Integration Effort:** M-L (due to compatibility issues)

---

### Option 6: ElevenLabs React Native SDK

**Overview:**
Full voice agent platform with speech recognition (ASR) and text-to-speech (TTS).

**Pros:**
- Complete voice interaction solution
- High-quality ASR with VAD
- Beautiful voice responses (TTS)
- Real-time conversation support
- Well-designed Expo SDK

**Cons:**
- Overkill for just speech-to-text
- Requires LiveKit dependencies
- Cannot use with Expo Go
- Paid service (credits-based)
- More suited for conversational agents than simple transcription

**Pricing:** Credit-based pricing (varies)

**Expo Compatible:** Yes (requires dev build)

**Integration Effort:** M

---

## Comparison Matrix

| Criteria | expo-speech-recognition | whisper.rn | whisper-kit-expo | Whisper API | react-native-voice |
|----------|------------------------|------------|------------------|-------------|-------------------|
| Expo SDK 54 | Yes | Yes | Yes | Yes | Partial (needs patches) |
| iOS Support | Yes | Yes | Yes | Yes | Yes |
| Android Support | Yes | Yes (with issues) | No | Yes | Yes |
| Real-time | Yes | Yes | Yes | No | Yes |
| Offline | Yes | Yes | Yes | No | Yes |
| Arabic Support | Device-dependent | Excellent | Excellent | Excellent | Device-dependent |
| Setup Complexity | Low | High | Medium | Low | Medium |
| Accuracy | Good | Excellent | Excellent | Excellent | Good |
| Bundle Impact | Low | High (model files) | Medium | Low | Low |

---

## Recommendation

**Primary: expo-speech-recognition**

### Rationale:

1. **Built for Expo**: Designed specifically for Expo projects with proper config plugin support.

2. **Simple Integration**: Hook-based API (`useSpeechRecognitionEvent`) matches existing patterns in codebase.

3. **Real-time Feedback**: `interimResults` option provides live transcription as user speaks.

4. **No Bundle Bloat**: Uses native platform APIs, no large model downloads.

5. **Cross-platform**: Works on iOS, Android, and Web.

6. **Free**: Uses native speech services at no cost.

### Fallback: OpenAI Whisper API

For users where native speech recognition fails or for:
- Better multilingual support (Arabic Quranic terms)
- Consistent accuracy across devices
- Devices without good native speech support

Implement as optional fallback:
```typescript
// If native speech recognition fails, offer Whisper fallback
const transcribeWithWhisper = async (audioUri: string) => {
  // Record with expo-av, upload to Whisper API
};
```

---

## Integration Notes

### For This Codebase (Expo SDK 54):

1. **Install package:**
```bash
npx expo install expo-speech-recognition
```

2. **Configure app.json:**
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

3. **Create development build:**
```bash
npx expo prebuild
npx expo run:ios
```

4. **Create hook** (`lib/hooks/useVoiceInput.ts`):
```typescript
import { useState, useCallback } from 'react';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';

interface UseVoiceInputReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  error: string | null;
  startListening: () => Promise<void>;
  stopListening: () => void;
  cancelListening: () => void;
}

export function useVoiceInput(): UseVoiceInputReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  useSpeechRecognitionEvent('start', () => {
    setIsListening(true);
    setError(null);
  });

  useSpeechRecognitionEvent('end', () => {
    setIsListening(false);
  });

  useSpeechRecognitionEvent('result', (event) => {
    setTranscript(event.results[0]?.transcript ?? '');
  });

  useSpeechRecognitionEvent('error', (event) => {
    setError(event.message);
    setIsListening(false);
  });

  const startListening = useCallback(async () => {
    setTranscript('');
    setError(null);

    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!result.granted) {
      setError('Microphone permission denied');
      return;
    }

    ExpoSpeechRecognitionModule.start({
      lang: 'en-US',
      interimResults: true,
      continuous: true,
    });
  }, []);

  const stopListening = useCallback(() => {
    ExpoSpeechRecognitionModule.stop();
  }, []);

  const cancelListening = useCallback(() => {
    ExpoSpeechRecognitionModule.abort();
    setTranscript('');
  }, []);

  return {
    isListening,
    isSupported: true, // Check at runtime if needed
    transcript,
    error,
    startListening,
    stopListening,
    cancelListening,
  };
}
```

5. **Create Voice Button Component** (`components/ai/VoiceInputButton.tsx`):
```typescript
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import { useVoiceInput } from '@/lib/hooks/useVoiceInput';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
}

export function VoiceInputButton({ onTranscript }: VoiceInputButtonProps) {
  const { isListening, transcript, error, startListening, stopListening } = useVoiceInput();
  const scale = useSharedValue(1);

  // Pulse animation when listening
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = async () => {
    if (isListening) {
      stopListening();
      if (transcript) onTranscript(transcript);
    } else {
      scale.value = withRepeat(withTiming(1.2, { duration: 500 }), -1, true);
      await startListening();
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          style={[styles.button, isListening && styles.buttonActive]}
          onPress={handlePress}
        >
          <Ionicons
            name={isListening ? 'mic' : 'mic-outline'}
            size={24}
            color={isListening ? '#fff' : '#666'}
          />
        </TouchableOpacity>
      </Animated.View>
      {isListening && <Text style={styles.status}>Listening...</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonActive: { backgroundColor: '#ef4444' },
  status: { marginTop: 4, fontSize: 12, color: '#666' },
  error: { marginTop: 4, fontSize: 12, color: '#ef4444' },
});
```

---

## Graceful Fallback Strategy

As specified in EPIC-4, voice input should degrade gracefully:

```typescript
// lib/hooks/useVoiceInput.ts

export function useVoiceInput(): UseVoiceInputReturn {
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if speech recognition is available
    ExpoSpeechRecognitionModule.getSupportedLocales({})
      .then((locales) => {
        setIsSupported(locales.length > 0);
      })
      .catch(() => {
        setIsSupported(false);
      });
  }, []);

  // If not supported, return disabled state
  if (!isSupported) {
    return {
      isListening: false,
      isSupported: false,
      transcript: '',
      error: 'Speech recognition not available on this device',
      startListening: async () => {},
      stopListening: () => {},
      cancelListening: () => {},
    };
  }

  // ... rest of implementation
}
```

In the UI, hide voice button if not supported:
```typescript
{voiceInput.isSupported && (
  <VoiceInputButton onTranscript={handleVoiceTranscript} />
)}
```

---

## References

- [expo-speech-recognition GitHub](https://github.com/jamsch/expo-speech-recognition)
- [expo-speech-recognition npm](https://www.npmjs.com/package/@jamsch/expo-speech-recognition)
- [whisper.rn GitHub](https://github.com/mybigday/whisper.rn)
- [OpenAI Whisper API](https://platform.openai.com/docs/guides/speech-to-text)
- [ElevenLabs React Native SDK](https://elevenlabs.io/docs/agents-platform/libraries/react-native)
- [Expo Audio Documentation](https://docs.expo.dev/versions/latest/sdk/audio/)
- [Making speech-to-text work with React Native and Expo](https://fostermade.co/about/journal/making-speech-to-text-work-with-react-native-and-expo)
