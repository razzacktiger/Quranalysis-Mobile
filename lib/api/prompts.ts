import { Schema, sendMessageWithSchema } from './ai';
import {
  sessionExtractionSchema,
  mistakeExtractionSchema,
  combinedExtractionSchema,
  type SessionExtractionResult,
  type MistakeExtractionResult,
  type CombinedExtractionResult,
} from '@/lib/validation/ai';
import {
  SESSION_TYPES,
  RECENCY_CATEGORIES,
  ERROR_CATEGORIES,
  ERROR_SUBCATEGORIES,
} from '@/types/session';

/**
 * Firebase AI Schema for extracted session fields
 * Uses nullable fields since AI may not extract all information
 */
const extractedSessionFirebaseSchema = Schema.object({
  properties: {
    duration_minutes: Schema.integer({ nullable: true }),
    session_type: Schema.enumString({
      enum: [...SESSION_TYPES],
      nullable: true,
    }),
    performance_score: Schema.number({ nullable: true, minimum: 0, maximum: 10 }),
    session_goal: Schema.string({ nullable: true }),
  },
});

/**
 * Firebase AI Schema for extracted portion fields
 */
const extractedPortionFirebaseSchema = Schema.object({
  properties: {
    surah_name: Schema.string({ nullable: true }),
    ayah_start: Schema.integer({ nullable: true }),
    ayah_end: Schema.integer({ nullable: true }),
    recency_category: Schema.enumString({
      enum: [...RECENCY_CATEGORIES],
      nullable: true,
    }),
    repetition_count: Schema.integer({ nullable: true }),
  },
});

/**
 * Firebase AI Schema for session extraction
 * Defines the structured JSON output format for Gemini
 */
export const sessionExtractionFirebaseSchema = Schema.object({
  properties: {
    session: extractedSessionFirebaseSchema,
    portions: Schema.array({ items: extractedPortionFirebaseSchema }),
    missing_fields: Schema.array({ items: Schema.string() }),
    follow_up_question: Schema.string({ nullable: true }),
    confidence: Schema.enumString({ enum: ['high', 'medium', 'low'] }),
  },
});

/**
 * System prompt for session extraction
 * Instructs the AI on how to parse natural language session descriptions
 */
export const SESSION_EXTRACTION_SYSTEM_PROMPT = `You are a Quran study session parser. Extract structured session information from natural language descriptions.

## Your Task
Parse the user's message to extract:
1. Session details (duration, type, performance, goal)
2. Quran portions practiced (surah, ayah range, recency, repetitions)
3. Identify any missing critical information

## Surah Name Normalization
Always normalize surah names to English transliteration format:
- الفاتحة → Al-Fatiha
- يس / Yasin → Yaseen
- البقرة → Al-Baqarah
- Use standard English transliteration (Al-X format for surahs starting with "the")

## Surah Reference Data
When a surah is mentioned without ayah range, use the full surah:
- Al-Fatiha: 1-7
- Al-Baqarah: 1-286
- Al-Imran: 1-200
- An-Nisa: 1-176
- Al-Ma'idah: 1-120
- Yaseen: 1-83
- Al-Mulk: 1-30
- Al-Kahf: 1-110
- Ar-Rahman: 1-78
- Al-Waqi'ah: 1-96
- For other surahs, leave ayah_start and ayah_end as null and mark as missing

## Juz 30 (Juz Amma) Reference
Juz 30 contains surahs 78-114:
An-Naba (78), An-Nazi'at (79), Abasa (80), At-Takwir (81), Al-Infitar (82),
Al-Mutaffifin (83), Al-Inshiqaq (84), Al-Buruj (85), At-Tariq (86), Al-A'la (87),
Al-Ghashiyah (88), Al-Fajr (89), Al-Balad (90), Ash-Shams (91), Al-Layl (92),
Ad-Duha (93), Ash-Sharh (94), At-Tin (95), Al-Alaq (96), Al-Qadr (97),
Al-Bayyinah (98), Az-Zalzalah (99), Al-Adiyat (100), Al-Qari'ah (101),
At-Takathur (102), Al-Asr (103), Al-Humazah (104), Al-Fil (105), Quraysh (106),
Al-Ma'un (107), Al-Kawthar (108), Al-Kafirun (109), An-Nasr (110),
Al-Masad (111), Al-Ikhlas (112), Al-Falaq (113), An-Nas (114)

When user mentions "Juz 30" or "Juz Amma", do NOT populate portions array.
Instead, mark surah_name as missing and ask which specific surahs were covered.

## Session Type Mapping
- "practiced", "read", "reading" → reading_practice
- "memorized", "memorizing", "hifz", "new" → memorization
- "reviewed", "review", "revision" → reading_practice (with goal: "review")
- "audit", "test with teacher", "sabaq" → audit
- "mistakes", "error review" → mistake_session
- "quiz", "test" → practice_test
- "study", "tafsir", "meaning" → study_session

## Performance Score Inference (0-10 scale)
- "went well", "great", "excellent", "smooth" → 7-8
- "okay", "fine", "alright" → 5-6
- "struggled", "hard", "difficult", "many mistakes" → 3-4
- "terrible", "very bad", "couldn't remember" → 1-2
- If not mentioned, leave as null

## Recency Category Rules
- "new" or "just started" → new
- "recent" or "last few days" → recent
- "reviewing" or "going back to" → reviewing
- For memorization of new material → new
- If not clear, leave as null

## Missing Fields Logic
Only add to missing_fields if the field is:
1. Critical (surah_name is always critical)
2. Not inferrable from context
3. Needed for a complete session record

Fields that are okay to be null: duration_minutes, performance_score, repetition_count

## Follow-up Question Rules
- Only ask if critical info is missing (surah_name is critical)
- Keep questions concise and specific
- Don't ask about optional fields
- If juz mentioned without specifics, ask which surahs

## Confidence Levels
- high: All critical fields extracted, surah clearly identified
- medium: Surah identified but some ambiguity, or range unclear
- low: Unable to determine surah or major uncertainty

## Multiple Portions
Users may mention multiple surahs. Create separate portion entries for each:
"I read Al-Fatiha and first page of Al-Baqarah" → 2 portions

## Examples

Input: "I practiced Al-Fatiha for 20 minutes"
Output: session.duration_minutes=20, session.session_type="reading_practice",
portions=[{surah_name:"Al-Fatiha", ayah_start:1, ayah_end:7}], confidence="high"

Input: "Memorized surah yaseen ayah 1-10 today, went well"
Output: session.session_type="memorization", session.performance_score=8,
portions=[{surah_name:"Yaseen", ayah_start:1, ayah_end:10, recency_category:"new"}],
missing_fields=["duration_minutes"], follow_up_question="How long did you spend?", confidence="high"

Input: "Quick review of juz 30"
Output: session.session_type="reading_practice", session.session_goal="review",
portions=[], missing_fields=["surah_name"],
follow_up_question="Which surahs from Juz 30 did you cover? (An-Naba through An-Nas)", confidence="medium"

Now parse the following user message:`;

/**
 * Extracts session data from a natural language message
 * Uses Gemini AI with structured output schema
 *
 * @param userMessage - The user's description of their study session
 * @returns Structured session extraction result
 * @throws Error if AI request fails or response validation fails
 */
export async function extractSessionFromMessage(
  userMessage: string
): Promise<SessionExtractionResult> {
  const fullPrompt = `${SESSION_EXTRACTION_SYSTEM_PROMPT}

"${userMessage}"`;

  try {
    const rawResult = await sendMessageWithSchema<SessionExtractionResult>(
      fullPrompt,
      sessionExtractionFirebaseSchema
    );

    // Validate the result with Zod for type safety
    const validatedResult = sessionExtractionSchema.parse(rawResult);

    return validatedResult;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Session extraction failed: ${error.message}`);
    }
    throw new Error('Session extraction failed: Unknown error');
  }
}

// ============================================================================
// MISTAKE EXTRACTION
// ============================================================================

/**
 * Firebase AI Schema for extracted mistake fields
 */
const extractedMistakeFirebaseSchema = Schema.object({
  properties: {
    portion_surah: Schema.string(),
    error_category: Schema.enumString({ enum: [...ERROR_CATEGORIES] }),
    error_subcategory: Schema.enumString({
      enum: [...ERROR_SUBCATEGORIES],
      nullable: true,
    }),
    severity_level: Schema.integer({ minimum: 1, maximum: 5 }),
    ayah_number: Schema.integer({ nullable: true }),
    additional_notes: Schema.string({ nullable: true }),
  },
});

/**
 * Firebase AI Schema for mistake extraction
 */
export const mistakeExtractionFirebaseSchema = Schema.object({
  properties: {
    mistakes: Schema.array({ items: extractedMistakeFirebaseSchema }),
    follow_up_question: Schema.string({ nullable: true }),
    confidence: Schema.enumString({ enum: ['high', 'medium', 'low'] }),
  },
});

/**
 * System prompt for mistake extraction
 * Instructs the AI on how to parse error/mistake descriptions
 */
export const MISTAKE_EXTRACTION_SYSTEM_PROMPT = `You are a Quran recitation mistake analyzer. Extract structured mistake information from natural language descriptions.

## Your Task
Parse the user's message to extract:
1. Mistakes made during recitation (category, subcategory, severity)
2. Link mistakes to the surah being discussed
3. Identify specific ayah numbers when mentioned

## Error Categories
Available categories: ${ERROR_CATEGORIES.join(', ')}

## Terminology Mapping
Map user language to our categories:

### Tajweed Errors
| User Says | Category | Subcategory |
|-----------|----------|-------------|
| tajweed, tajwid | tajweed | (general) |
| ghunna, gunna, nasal sound | tajweed | ghunna |
| madd, mad, elongation, stretch | tajweed | madd |
| idgham, idghaam, merging | tajweed | idgham |
| ikhfa, ikhfaa, hiding | tajweed | ikhfa |
| qalqala, qalqalah, echo | tajweed | qalqalah |
| iqlab | tajweed | iqlab |

### Pronunciation Errors
| User Says | Category | Subcategory |
|-----------|----------|-------------|
| pronunciation, articulation | pronunciation | (general) |
| makhraj, makharij, point of articulation | pronunciation | makhraj |
| letter sound, wrong letter | pronunciation | sifat |

### Memorization Errors
| User Says | Category | Subcategory |
|-----------|----------|-------------|
| forgot, blanked, couldn't remember | memorization | forgotten_word |
| skipped, missed verse | memorization | verse_skip |
| mixed up, confused verses, similar verse | memorization | mutashabih |
| wrong word order | memorization | word_order |
| said wrong word | memorization | word_substitution |

### Fluency Errors
| User Says | Category | Subcategory |
|-----------|----------|-------------|
| hesitated, paused, slow | fluency | hesitation |
| stumbled, not smooth | fluency | hesitation |
| repeated myself, said twice | fluency | repetition |
| rhythm off, timing wrong | fluency | rhythm |

### Waqf (Stopping) Errors
| User Says | Category | Subcategory |
|-----------|----------|-------------|
| wrong stop, bad pause, stopped wrong | waqf | wrong_stop |
| didn't stop, missed stop, should have stopped | waqf | missed_stop |
| shouldn't have stopped | waqf | disencouraged_stop |

## Severity Guidelines (1-5 scale)
Infer severity from user language:

| Level | Description | User Indicators |
|-------|-------------|-----------------|
| 1 | Minor | "small slip", "barely noticeable", "self-corrected quickly", "tiny" |
| 2 | Light | "slight error", "minor issue", "small mistake" |
| 3 | Moderate | "mistake", "error", "needed to fix", "messed up" |
| 4 | Significant | "major mistake", "big error", "serious", "bad" |
| 5 | Critical | "completely wrong", "fundamental error", "really bad", "terrible" |

Default to severity 3 if no indicators present.

## Surah Context
The user may have mentioned a surah in the conversation context. Use that surah name for portion_surah.
If no surah is mentioned, use "Unknown" and ask in follow_up_question.

## Multiple Mistakes
Users may describe multiple mistakes. Create separate entries for each:
"I hesitated on verse 5 and forgot the ghunna on verse 7" → 2 mistakes

## Ayah Numbers
- If user says "verse X" or "ayah X", extract that number
- If user says "verses 10-12", use null for ayah_number but note in additional_notes
- If no specific verse mentioned, leave ayah_number as null

## Confidence Levels
- high: Clear error description with category easily identified
- medium: Some ambiguity in error type or severity
- low: Vague description, unclear what went wrong

## Examples

Input: "I made a tajweed mistake on ayah 5, forgot the ghunna"
Context surah: Al-Fatiha
Output:
{
  "mistakes": [{
    "portion_surah": "Al-Fatiha",
    "error_category": "tajweed",
    "error_subcategory": "ghunna",
    "severity_level": 3,
    "ayah_number": 5,
    "additional_notes": "Forgot to apply ghunna rule"
  }],
  "follow_up_question": null,
  "confidence": "high"
}

Input: "Kept hesitating on verse 10-12, and mixed up verse 15 with something similar"
Context surah: Al-Baqarah
Output:
{
  "mistakes": [
    {
      "portion_surah": "Al-Baqarah",
      "error_category": "fluency",
      "error_subcategory": "hesitation",
      "severity_level": 2,
      "ayah_number": null,
      "additional_notes": "Hesitation on verses 10-12"
    },
    {
      "portion_surah": "Al-Baqarah",
      "error_category": "memorization",
      "error_subcategory": "mutashabih",
      "severity_level": 3,
      "ayah_number": 15,
      "additional_notes": "Confused with similar verse"
    }
  ],
  "follow_up_question": null,
  "confidence": "high"
}

Input: "Made a small slip with the madd"
Context surah: Unknown
Output:
{
  "mistakes": [{
    "portion_surah": "Unknown",
    "error_category": "tajweed",
    "error_subcategory": "madd",
    "severity_level": 1,
    "ayah_number": null,
    "additional_notes": "Small madd error"
  }],
  "follow_up_question": "Which surah were you reciting?",
  "confidence": "medium"
}

Now parse the following mistake description:`;

/**
 * Extracts mistake data from a natural language message
 *
 * @param userMessage - The user's description of mistakes made
 * @param contextSurah - Optional surah name from conversation context
 * @returns Structured mistake extraction result
 */
export async function extractMistakesFromMessage(
  userMessage: string,
  contextSurah?: string
): Promise<MistakeExtractionResult> {
  const contextLine = contextSurah
    ? `\nContext surah: ${contextSurah}`
    : '\nContext surah: Unknown';

  const fullPrompt = `${MISTAKE_EXTRACTION_SYSTEM_PROMPT}${contextLine}

"${userMessage}"`;

  try {
    const rawResult = await sendMessageWithSchema<MistakeExtractionResult>(
      fullPrompt,
      mistakeExtractionFirebaseSchema
    );

    const validatedResult = mistakeExtractionSchema.parse(rawResult);
    return validatedResult;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Mistake extraction failed: ${error.message}`);
    }
    throw new Error('Mistake extraction failed: Unknown error');
  }
}

// ============================================================================
// COMBINED EXTRACTION (for conversational chat)
// ============================================================================

/**
 * Firebase AI Schema for combined session + mistake extraction
 */
export const combinedExtractionFirebaseSchema = Schema.object({
  properties: {
    session: Schema.object({
      properties: {
        duration_minutes: Schema.integer({ nullable: true }),
        session_type: Schema.enumString({
          enum: [...SESSION_TYPES],
          nullable: true,
        }),
        performance_score: Schema.number({ nullable: true, minimum: 0, maximum: 10 }),
        session_goal: Schema.string({ nullable: true }),
      },
      nullable: true,
    }),
    portions: Schema.array({ items: extractedPortionFirebaseSchema }),
    mistakes: Schema.array({ items: extractedMistakeFirebaseSchema }),
    missing_fields: Schema.array({ items: Schema.string() }),
    follow_up_question: Schema.string({ nullable: true }),
    confidence: Schema.enumString({ enum: ['high', 'medium', 'low'] }),
  },
});

/**
 * Combined system prompt for conversational extraction
 * Handles both session details and mistakes in one pass
 */
export const COMBINED_EXTRACTION_SYSTEM_PROMPT = `You are a Quran study assistant. Extract structured information from conversational messages about Quran practice sessions.

## Your Task
Parse the user's message to extract ANY of these that are mentioned:
1. Session details (duration, type, performance, goal)
2. Quran portions practiced (surah, ayah range)
3. Mistakes made during recitation

Not all fields will be present in every message - only extract what's mentioned.

## Session Information
${SESSION_EXTRACTION_SYSTEM_PROMPT.split('## Your Task')[1].split('Now parse')[0]}

## Mistake Information
${MISTAKE_EXTRACTION_SYSTEM_PROMPT.split('## Your Task')[1].split('Now parse')[0]}

## Combined Response Rules
- session: Include if user mentions duration, session type, or how it went. Set to null if no session info.
- portions: Include if user mentions specific surahs or ayahs practiced
- mistakes: Include if user describes any errors or problems
- missing_fields: List critical missing info (surah_name is critical)
- follow_up_question: Ask only for critical missing info
- confidence: Overall confidence in the extraction

Now parse the following message:`;

/**
 * Extracts combined session and mistake data from a conversational message
 *
 * @param userMessage - The user's message
 * @param conversationContext - Optional context from previous messages
 * @returns Combined extraction result
 */
export async function extractFromMessage(
  userMessage: string,
  conversationContext?: { surah?: string; sessionType?: string }
): Promise<CombinedExtractionResult> {
  let contextInfo = '';
  if (conversationContext?.surah) {
    contextInfo += `\nContext surah: ${conversationContext.surah}`;
  }
  if (conversationContext?.sessionType) {
    contextInfo += `\nContext session type: ${conversationContext.sessionType}`;
  }

  const fullPrompt = `${COMBINED_EXTRACTION_SYSTEM_PROMPT}${contextInfo}

"${userMessage}"`;

  try {
    const rawResult = await sendMessageWithSchema<CombinedExtractionResult>(
      fullPrompt,
      combinedExtractionFirebaseSchema
    );

    const validatedResult = combinedExtractionSchema.parse(rawResult);
    return validatedResult;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Extraction failed: ${error.message}`);
    }
    throw new Error('Extraction failed: Unknown error');
  }
}
