import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Return type for the useVoiceInput hook
 */
export interface UseVoiceInputReturn {
  /** Whether speech recognition is currently active */
  isListening: boolean;
  /** Whether the device supports speech recognition */
  isSupported: boolean;
  /** Current transcript (interim or final) */
  transcript: string;
  /** Error message if any, null otherwise */
  error: string | null;
  /** Start listening for speech input */
  startListening: () => Promise<void>;
  /** Stop listening and get final result */
  stopListening: () => void;
  /** Cancel listening without result */
  cancelListening: () => void;
  /** Clear the current transcript */
  clearTranscript: () => void;
}

/**
 * Map error codes to user-friendly messages
 */
const ERROR_MESSAGES: Record<string, string> = {
  'not-allowed': 'Microphone permission denied',
  'no-speech': 'No speech detected. Please try again.',
  'network': 'Network error. Check your connection.',
  'audio-capture': 'Could not access microphone.',
  'aborted': 'Speech recognition was cancelled.',
  'service-not-allowed': 'Speech recognition service not available.',
  'not-available': 'Voice input requires a development build.',
};

/**
 * Get a user-friendly error message from an error code
 */
function getErrorMessage(errorCode: string): string {
  return ERROR_MESSAGES[errorCode] ?? `Speech recognition error: ${errorCode}`;
}

// Try to load the speech recognition module
// This will fail in Expo Go but work in development builds
let ExpoSpeechRecognitionModule: any = null;
let moduleAvailable = false;

try {
  // Use require to avoid static import analysis
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const speechRecognition = require('expo-speech-recognition');
  ExpoSpeechRecognitionModule = speechRecognition.ExpoSpeechRecognitionModule;
  moduleAvailable = true;
} catch {
  // Module not available (e.g., in Expo Go)
  moduleAvailable = false;
}

/**
 * Hook for voice input using expo-speech-recognition
 *
 * IMPORTANT: This hook requires a development build to work.
 * It will return `isSupported: false` when running in Expo Go.
 *
 * Features:
 * - Graceful fallback when native module not available
 * - Permission handling
 * - Real-time transcript updates
 * - Error handling with user-friendly messages
 * - Support detection
 *
 * @example
 * ```tsx
 * const { isListening, isSupported, transcript, startListening, stopListening } = useVoiceInput();
 *
 * if (!isSupported) return null; // Hide voice button in Expo Go
 *
 * return (
 *   <Button onPress={isListening ? stopListening : startListening}>
 *     {isListening ? 'Stop' : 'Start'}
 *   </Button>
 * );
 * ```
 */
export function useVoiceInput(): UseVoiceInputReturn {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Track if component is mounted to avoid state updates after unmount
  const isMountedRef = useRef(true);

  // Store event unsubscribe functions
  const unsubscribersRef = useRef<Array<() => void>>([]);

  // Check support on mount
  useEffect(() => {
    isMountedRef.current = true;

    const checkSupport = async () => {
      if (!moduleAvailable || !ExpoSpeechRecognitionModule) {
        if (isMountedRef.current) {
          setIsSupported(false);
        }
        return;
      }

      try {
        const locales = await ExpoSpeechRecognitionModule.getSupportedLocales({});
        if (isMountedRef.current) {
          setIsSupported(locales.locales.length > 0);
        }
      } catch {
        if (isMountedRef.current) {
          setIsSupported(false);
        }
      }
    };

    checkSupport();

    return () => {
      isMountedRef.current = false;
      // Clean up any subscriptions
      unsubscribersRef.current.forEach((unsub) => unsub());
      unsubscribersRef.current = [];
    };
  }, []);

  /**
   * Request permissions and start listening
   */
  const startListening = useCallback(async () => {
    // Clear previous state
    setError(null);
    setTranscript('');

    if (!moduleAvailable || !ExpoSpeechRecognitionModule) {
      setError(getErrorMessage('not-available'));
      return;
    }

    try {
      // Request permission if needed
      const permissionResult = await ExpoSpeechRecognitionModule.requestPermissionsAsync();

      if (!permissionResult.granted) {
        setError('Microphone permission denied');
        return;
      }

      // Set up event handlers before starting
      const handleStart = () => {
        if (isMountedRef.current) {
          setIsListening(true);
          setError(null);
        }
      };

      const handleEnd = () => {
        if (isMountedRef.current) {
          setIsListening(false);
        }
      };

      const handleResult = (event: { results?: Array<{ transcript: string }> }) => {
        if (isMountedRef.current && event.results && event.results.length > 0) {
          const latestResult = event.results[event.results.length - 1];
          if (latestResult) {
            setTranscript(latestResult.transcript);
          }
        }
      };

      const handleError = (event: { error: string }) => {
        if (isMountedRef.current) {
          setIsListening(false);
          setError(getErrorMessage(event.error));
        }
      };

      // Subscribe to events
      const unsubStart = ExpoSpeechRecognitionModule.addListener('start', handleStart);
      const unsubEnd = ExpoSpeechRecognitionModule.addListener('end', handleEnd);
      const unsubResult = ExpoSpeechRecognitionModule.addListener('result', handleResult);
      const unsubError = ExpoSpeechRecognitionModule.addListener('error', handleError);

      // Store unsubscribers for cleanup
      unsubscribersRef.current = [
        () => unsubStart.remove(),
        () => unsubEnd.remove(),
        () => unsubResult.remove(),
        () => unsubError.remove(),
      ];

      // Start recognition with options
      await ExpoSpeechRecognitionModule.start({
        lang: 'en-US',
        interimResults: true,
        continuous: true,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start speech recognition';
      setError(errorMessage);
      setIsListening(false);
    }
  }, []);

  /**
   * Stop listening and keep the final result
   */
  const stopListening = useCallback(() => {
    if (!moduleAvailable || !ExpoSpeechRecognitionModule) return;

    try {
      ExpoSpeechRecognitionModule.stop();
    } catch {
      // Ignore errors when stopping
    }
  }, []);

  /**
   * Cancel listening and discard the result
   */
  const cancelListening = useCallback(() => {
    if (!moduleAvailable || !ExpoSpeechRecognitionModule) return;

    try {
      ExpoSpeechRecognitionModule.abort();
      setTranscript('');
    } catch {
      // Ignore errors when aborting
    }
  }, []);

  /**
   * Clear the current transcript
   */
  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    error,
    startListening,
    stopListening,
    cancelListening,
    clearTranscript,
  };
}
