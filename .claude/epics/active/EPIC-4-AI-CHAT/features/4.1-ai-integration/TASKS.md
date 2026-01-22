# Feature 4.1: AI Integration Tasks

**Research:** See `specs/RESEARCH-llm-apis.md`
**Technology:** Firebase AI Logic + Gemini 2.5 Flash

---

## Task 4.1.1: Setup Firebase AI + Gemini

**Size:** M | **Files:** `lib/firebase.ts`, `lib/api/ai.ts`

### Setup Steps
1. Install packages: `firebase`, `@firebase/ai`
2. Create Firebase project at console.firebase.google.com
3. Enable Vertex AI API in Firebase console
4. Download config files (google-services.json, GoogleService-Info.plist)
5. Initialize Firebase app in `lib/firebase.ts`
6. Create generative model with structured output config

### Key Configuration
- Model: `gemini-2.5-flash`
- Response format: `application/json`
- Use `responseSchema` to enforce JSON structure
- Environment: Use Firebase's built-in auth (no API key in client)

### Key APIs
- `initializeApp(config)` - Initialize Firebase
- `getAI(app)` - Get AI instance
- `getGenerativeModel(ai, { model, generationConfig })` - Configure model
- `model.generateContent(prompt)` - Send message, get response
- `result.response.text()` - Get response text (JSON string)

### Acceptance
- [x] Firebase project configured with Vertex AI
- [x] Gemini model initialized with JSON response schema
- [x] Test prompt returns valid JSON
- [x] Free tier working for development

**Status:** ✅ Complete

---

## Task 4.1.2: Session Extraction Prompt

**Size:** L | **Files:** `lib/api/prompts.ts`, `lib/validation/ai.ts`

### Zod Schema Structure
Create `sessionExtractionSchema` with these fields:

```
session: {
  duration_minutes: number | null
  session_type: enum(SESSION_TYPES) | null
  performance_score: number (0-10) | null
  session_goal: string | null
}

portions: [{
  surah_name: string | null
  ayah_start: number | null
  ayah_end: number | null
  recency_category: enum(RECENCY_CATEGORIES) | null
  repetition_count: number | null
}]

missing_fields: string[]
follow_up_question: string | null
confidence: "high" | "medium" | "low"
```

### Expected JSON Output Examples

**Input:** "I practiced Al-Fatiha for 20 minutes"
```json
{
  "session": {
    "duration_minutes": 20,
    "session_type": "reading_practice",
    "performance_score": null,
    "session_goal": null
  },
  "portions": [{
    "surah_name": "Al-Fatiha",
    "ayah_start": 1,
    "ayah_end": 7,
    "recency_category": null,
    "repetition_count": null
  }],
  "missing_fields": [],
  "follow_up_question": null,
  "confidence": "high"
}
```

**Input:** "Memorized surah yaseen ayah 1-10 today, went well"
```json
{
  "session": {
    "duration_minutes": null,
    "session_type": "memorization",
    "performance_score": 8,
    "session_goal": null
  },
  "portions": [{
    "surah_name": "Yaseen",
    "ayah_start": 1,
    "ayah_end": 10,
    "recency_category": "new",
    "repetition_count": null
  }],
  "missing_fields": ["duration_minutes"],
  "follow_up_question": "How long did you spend on this session?",
  "confidence": "high"
}
```

**Input:** "Quick review of juz 30"
```json
{
  "session": {
    "duration_minutes": null,
    "session_type": "reading_practice",
    "performance_score": null,
    "session_goal": "review"
  },
  "portions": [],
  "missing_fields": ["surah_name"],
  "follow_up_question": "Which surahs from Juz 30 did you cover? (An-Naba through An-Nas)",
  "confidence": "medium"
}
```

### Prompt Requirements
- Normalize surah names to English format (Al-Fatiha, not الفاتحة)
- If ayah range not specified, use full surah (lookup required)
- Juz 30 = Surahs 78-114 (An-Naba to An-Nas)
- Infer performance: "went well/great" = 7-8, "struggled/hard" = 3-4
- Only ask follow-up for critical missing info (surah name is critical)
- Support multiple portions in single message

### Acceptance
- [x] Zod schema created and exported
- [x] System prompt handles surah variations
- [x] Juz references resolved correctly
- [x] Performance inferred from context
- [x] Multiple portions extracted from one message

**Status:** ✅ Complete

---

## Task 4.1.3: Mistake Extraction Prompt

**Size:** L | **Files:** `lib/api/prompts.ts`, `lib/validation/ai.ts`

### Zod Schema Structure
Create `mistakeExtractionSchema`:

```
mistakes: [{
  portion_surah: string
  error_category: enum(ERROR_CATEGORIES)
  error_subcategory: string | null
  severity_level: 1 | 2 | 3 | 4 | 5
  ayah_number: number | null
  additional_notes: string | null
}]

follow_up_question: string | null
confidence: "high" | "medium" | "low"
```

### Terminology Mapping (include in prompt)

| User Says | Category | Subcategory |
|-----------|----------|-------------|
| tajweed, tajwid | tajweed | - |
| ghunna, gunna | tajweed | ghunna |
| madd, mad, elongation | tajweed | madd |
| idgham, idghaam | tajweed | idgham |
| ikhfa, ikhfaa | tajweed | ikhfa |
| qalqala, qalqalah | tajweed | qalqala |
| pronunciation, articulation | pronunciation | - |
| makhraj, makharij | pronunciation | makhraj |
| letter sound | pronunciation | letter |
| forgot, blanked, couldn't remember | memorization | forgot |
| skipped, missed verse | memorization | skip |
| mixed up, confused verses | memorization | confusion |
| hesitated, paused, slow | fluency | hesitation |
| stumbled, not smooth | fluency | stumble |
| repeated myself | fluency | repetition |
| wrong stop, bad pause | waqf | wrong_stop |
| didn't stop, missed stop | waqf | missed_stop |

### Severity Guidelines (include in prompt)

| Level | Description | User Indicators |
|-------|-------------|-----------------|
| 1 | Minor | "small slip", "barely noticeable", "self-corrected" |
| 2 | Light | "slight error", "minor issue" |
| 3 | Moderate | "mistake", "error", "needed to fix" |
| 4 | Significant | "major mistake", "big error", "serious" |
| 5 | Critical | "completely wrong", "fundamental error" |

### Expected JSON Output Examples

**Input:** "I made a tajweed mistake on ayah 5, forgot the ghunna"
```json
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
```

**Input:** "Kept hesitating on verse 10-12, and mixed up verse 15 with something similar"
```json
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
      "error_subcategory": "confusion",
      "severity_level": 3,
      "ayah_number": 15,
      "additional_notes": "Confused with similar verse"
    }
  ],
  "follow_up_question": null,
  "confidence": "high"
}
```

### Combined Schema
Create `combinedExtractionSchema` that includes both session and mistakes for conversational chat flow.

### Acceptance
- [x] Mistake schema created and exported
- [x] Terminology mapping accurate
- [x] Severity inferred from language
- [x] Multiple mistakes extracted from single message
- [x] Mistakes linked to surah from conversation context
- [x] Combined schema for chat responses

**Status:** ✅ Complete

---

## Task 4.1.4: useAIChat Hook

**Size:** M | **Files:** `lib/hooks/useAIChat.ts`

### State Structure

```typescript
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  extraction?: CombinedExtraction
  timestamp: Date
}

// Hook manages:
messages: Message[]
extractedSession: Partial<SessionFormData>
extractedPortions: PortionFormData[]
extractedMistakes: MistakeFormData[]
isLoading: boolean
error: string | null
```

### Accumulation Logic
- Each AI message may contain partial extraction
- Session fields merge (later values override)
- Portions accumulate (add to array)
- Mistakes accumulate (add to array)
- Use `useMemo` to compute accumulated state from all messages

### Functions to Implement

| Function | Purpose |
|----------|---------|
| `sendMessage(text)` | Add user message, call AI, add AI response with extraction |
| `clearChat()` | Reset messages and all extracted data |
| `getCurrentExtraction()` | Return `{ session, portions, mistakes }` for saving |
| `isReadyToSave` | True if at least one portion has surah_name |

### Error Handling
- Catch API errors, set error state
- Handle malformed JSON from AI (Zod validation)
- Allow retry on failure

### Acceptance
- [x] Messages track full conversation
- [x] Extractions validated with Zod
- [x] Data accumulates across turns
- [x] `isReadyToSave` correctly computed
- [x] Error states handled gracefully

**Status:** ✅ Complete
