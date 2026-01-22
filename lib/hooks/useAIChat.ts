import { useState, useMemo, useCallback } from 'react';
import { extractFromMessage } from '@/lib/api/prompts';
import {
  combinedExtractionSchema,
  type CombinedExtractionResult,
  type ExtractedSession,
  type ExtractedPortion,
  type ExtractedMistake,
} from '@/lib/validation/ai';
import { ZodError } from 'zod';

/**
 * Message in the AI chat conversation
 */
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  extraction?: CombinedExtractionResult;
  timestamp: Date;
}

/**
 * Current extraction state accumulated from all messages
 */
export interface CurrentExtraction {
  session: Partial<ExtractedSession>;
  portions: ExtractedPortion[];
  mistakes: ExtractedMistake[];
}

/**
 * Find the last index of an element matching the predicate
 * Polyfill for Array.prototype.findLastIndex (ES2023)
 */
function findLastIndex<T>(
  array: T[],
  predicate: (item: T) => boolean
): number {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i])) {
      return i;
    }
  }
  return -1;
}

/**
 * Generate a unique ID for messages
 */
function generateId(): string {
  // Use crypto.randomUUID if available, otherwise fallback to timestamp + random
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Remove null values from an object
 * Used to merge session data where later values override earlier ones
 */
function removeNullValues<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  const result: Partial<T> = {};
  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== undefined) {
      result[key] = obj[key] as T[typeof key];
    }
  }
  return result;
}

/**
 * Hook for managing AI-powered chat for Quran study session logging
 *
 * Features:
 * - Manages chat messages with user and assistant roles
 * - Calls AI to extract session, portion, and mistake data from messages
 * - Accumulates extracted data across conversation turns
 * - Validates AI responses with Zod schemas
 * - Provides error handling and retry capability
 *
 * @returns Chat state and control functions
 */
export function useAIChat() {
  // Core state
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Accumulated session data from all messages
   * Later values override earlier ones (for session fields)
   */
  const accumulatedSession = useMemo(() => {
    return messages.reduce((acc, msg) => {
      if (msg.extraction?.session) {
        return { ...acc, ...removeNullValues(msg.extraction.session) };
      }
      return acc;
    }, {} as Partial<ExtractedSession>);
  }, [messages]);

  /**
   * Accumulated portions from all messages
   * Each extraction adds to the array
   */
  const accumulatedPortions = useMemo(() => {
    return messages.reduce((acc, msg) => {
      if (msg.extraction?.portions && msg.extraction.portions.length > 0) {
        return [...acc, ...msg.extraction.portions];
      }
      return acc;
    }, [] as ExtractedPortion[]);
  }, [messages]);

  /**
   * Accumulated mistakes from all messages
   * Each extraction adds to the array
   */
  const accumulatedMistakes = useMemo(() => {
    return messages.reduce((acc, msg) => {
      if (msg.extraction?.mistakes && msg.extraction.mistakes.length > 0) {
        return [...acc, ...msg.extraction.mistakes];
      }
      return acc;
    }, [] as ExtractedMistake[]);
  }, [messages]);

  /**
   * Get the most recent surah from accumulated portions for context
   * Used when calling AI to provide conversation context
   */
  const contextSurah = useMemo(() => {
    // Find the last portion with a surah_name
    for (let i = accumulatedPortions.length - 1; i >= 0; i--) {
      if (accumulatedPortions[i].surah_name) {
        return accumulatedPortions[i].surah_name;
      }
    }
    return undefined;
  }, [accumulatedPortions]);

  /**
   * Get the session type from accumulated session for context
   */
  const contextSessionType = useMemo(() => {
    return accumulatedSession.session_type ?? undefined;
  }, [accumulatedSession]);

  /**
   * Check if there's enough data to save
   * Requires at least one portion with a surah_name OR mistakes with valid surah
   */
  const isReadyToSave = useMemo(() => {
    const hasValidPortion = accumulatedPortions.some(
      (portion) => portion.surah_name !== null
    );
    const hasValidMistake = accumulatedMistakes.some(
      (mistake) => mistake.portion_surah && mistake.portion_surah !== 'Unknown'
    );
    return hasValidPortion || hasValidMistake;
  }, [accumulatedPortions, accumulatedMistakes]);

  /**
   * Send a message to the AI and process the response
   *
   * @param text - User message text
   * @throws Error if AI request fails (caught internally, stored in error state)
   */
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      // Clear any previous error
      setError(null);

      // Add user message immediately
      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        // Build conversation context from accumulated data
        const context: { surah?: string; sessionType?: string } = {};
        if (contextSurah) {
          context.surah = contextSurah;
        }
        if (contextSessionType) {
          context.sessionType = contextSessionType;
        }

        // Call AI to extract data from the message
        const extractionResult = await extractFromMessage(
          text.trim(),
          Object.keys(context).length > 0 ? context : undefined
        );

        // Validate with Zod (extractFromMessage already does this, but we double-check)
        const validatedExtraction =
          combinedExtractionSchema.parse(extractionResult);

        // Create assistant message with extraction
        const assistantContent = buildAssistantResponse(validatedExtraction);
        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: assistantContent,
          extraction: validatedExtraction,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        // Handle different error types
        let errorMessage: string;
        let userFacingMessage: string;

        if (err instanceof ZodError) {
          // Zod validation error - malformed AI response
          errorMessage = `Invalid AI response format: ${err.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ')}`;
          userFacingMessage = `I received an unexpected response format. This is a technical issue - please try again.`;
        } else if (err instanceof Error) {
          errorMessage = err.message;
          userFacingMessage = `Error: ${err.message}`;
        } else {
          errorMessage = 'An unexpected error occurred';
          userFacingMessage = errorMessage;
        }

        setError(errorMessage);

        // Add error message from assistant - show actual error for debugging
        const errorAssistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: userFacingMessage,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorAssistantMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [contextSurah, contextSessionType]
  );

  /**
   * Clear all chat messages and reset state
   */
  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    setIsLoading(false);
  }, []);

  /**
   * Get the current accumulated extraction data
   * Used when saving the session
   *
   * @returns Object containing accumulated session, portions, and mistakes
   */
  const getCurrentExtraction = useCallback((): CurrentExtraction => {
    return {
      session: accumulatedSession,
      portions: accumulatedPortions,
      mistakes: accumulatedMistakes,
    };
  }, [accumulatedSession, accumulatedPortions, accumulatedMistakes]);

  /**
   * Retry the last user message after an error
   */
  const retry = useCallback(() => {
    // Find the last user message
    const lastUserMessage = [...messages]
      .reverse()
      .find((msg) => msg.role === 'user');

    if (lastUserMessage) {
      // Remove both error assistant message and user message in a single state update
      // to avoid race conditions
      setMessages((prev) => {
        const lastUserIndex = findLastIndex(prev, (msg) => msg.role === 'user');
        const lastAssistantIndex = findLastIndex(
          prev,
          (msg) => msg.role === 'assistant'
        );

        // Find the earliest of the two to remove both
        const removeFromIndex = Math.min(
          lastUserIndex !== -1 ? lastUserIndex : Infinity,
          lastAssistantIndex !== -1 ? lastAssistantIndex : Infinity
        );

        return removeFromIndex !== Infinity
          ? prev.slice(0, removeFromIndex)
          : prev;
      });

      // Send the message again
      sendMessage(lastUserMessage.content);
    }
  }, [messages, sendMessage]);

  return {
    // State
    messages,
    isLoading,
    error,

    // Accumulated data
    extractedSession: accumulatedSession,
    extractedPortions: accumulatedPortions,
    extractedMistakes: accumulatedMistakes,

    // Computed
    isReadyToSave,
    contextSurah,

    // Actions
    sendMessage,
    clearChat,
    getCurrentExtraction,
    retry,
  };
}

/**
 * Build a natural language response from the extraction result
 */
function buildAssistantResponse(extraction: CombinedExtractionResult): string {
  const parts: string[] = [];

  // Acknowledge what was extracted
  if (extraction.session) {
    const sessionParts: string[] = [];
    if (extraction.session.session_type) {
      sessionParts.push(`session type: ${extraction.session.session_type}`);
    }
    if (extraction.session.duration_minutes) {
      sessionParts.push(`duration: ${extraction.session.duration_minutes} minutes`);
    }
    if (extraction.session.performance_score !== null) {
      sessionParts.push(`performance: ${extraction.session.performance_score}/10`);
    }
    if (sessionParts.length > 0) {
      parts.push(`Got it! I've recorded: ${sessionParts.join(', ')}.`);
    }
  }

  if (extraction.portions.length > 0) {
    const portionDescriptions = extraction.portions.map((p) => {
      if (p.surah_name) {
        let desc = p.surah_name;
        if (p.ayah_start && p.ayah_end) {
          desc += ` (ayahs ${p.ayah_start}-${p.ayah_end})`;
        } else if (p.ayah_start) {
          desc += ` (starting from ayah ${p.ayah_start})`;
        }
        return desc;
      }
      return 'portion (surah not specified)';
    });
    parts.push(`Portions covered: ${portionDescriptions.join(', ')}.`);
  }

  if (extraction.mistakes.length > 0) {
    parts.push(
      `I've noted ${extraction.mistakes.length} mistake${extraction.mistakes.length > 1 ? 's' : ''}.`
    );
  }

  // Add follow-up question if there is one
  if (extraction.follow_up_question) {
    parts.push(extraction.follow_up_question);
  } else if (parts.length === 0) {
    // No data was extracted
    parts.push(
      "I couldn't extract any session information from that. Could you tell me more about your Quran practice session? For example, which surah did you work on?"
    );
  }

  return parts.join(' ');
}

/**
 * Return type of the useAIChat hook
 */
export type UseAIChatReturn = ReturnType<typeof useAIChat>;
