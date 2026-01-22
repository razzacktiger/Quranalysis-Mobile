# EPIC-4 Feature 4.1: Agent Prompts

Ready-to-use prompts for dispatching agents on Feature 4.1 tasks.

## Task Overview

| Task | Agent | Can Parallel With |
|------|-------|-------------------|
| 4.1.2 Session Prompt | prompt-agent | 4.3.1 |
| 4.1.3 Mistake Prompt | prompt-agent | After 4.1.2 |
| 4.1.4 useAIChat Hook | prompt-agent | After 4.1.2 + 4.1.3 |

---

## Task 4.1.2: Session Extraction Prompt

**Agent Type:** prompt-agent
**Subagent:** `general-purpose`
**Run in Background:** Yes

### Dispatch Prompt

```markdown
# Prompt Agent Task: 4.1.2 - Session Extraction Prompt

## Your Role
You are a Prompt Agent implementing session extraction for a Quran study app.
This app helps users log their Quran reading/memorization sessions via natural language.

## Task Specification
**Size:** L | **Files:** `lib/api/prompts.ts`, `lib/validation/ai.ts`

### What to Create

1. **Zod Schema** (`lib/validation/ai.ts`):
Create `sessionExtractionSchema` with these fields:

```typescript
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

2. **System Prompt** (`lib/api/prompts.ts`):
Create `SESSION_EXTRACTION_PROMPT` that instructs the AI to:
- Extract session details from natural language
- Normalize surah names to transliteration format (Al-Fatihah, Ya-Sin, etc.)
- If ayah range not specified, use full surah (lookup from SURAHS constant)
- Juz 30 = Surahs 78-114 (An-Naba to An-Nas)
- Infer performance from context:
  - "went well/great/smooth" = 7-8
  - "okay/decent/average" = 5-6
  - "struggled/hard/difficult" = 3-4
- Only ask follow-up for critical missing info (surah name is critical)
- Support multiple portions in single message

3. **Send Function** (`lib/api/prompts.ts`):
Create `extractSession(userMessage: string)` that:
- Combines system prompt + user message
- Uses `sendMessageWithSchema` from `lib/api/ai.ts`
- Returns validated extraction result

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
    "surah_name": "Al-Fatihah",
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
    "surah_name": "Ya-Sin",
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

## Context Files to Read First
- `lib/api/ai.ts` - existing AI client with sendMessageWithSchema
- `lib/validation/session.ts` - existing session schema patterns
- `types/session.ts` - SESSION_TYPES, RECENCY_CATEGORIES constants
- `constants/quran-data.ts` - SURAHS array with transliteration names

## Standards to Follow
- Use Zod v4 syntax (`message` property, not `errorMap`)
- Export types alongside schemas: `export type X = z.infer<typeof xSchema>`
- Use Firebase AI Schema format for `sendMessageWithSchema`
- Match existing patterns in lib/validation/session.ts

## Workflow
1. READ: Read all context files listed above
2. PLAN: Outline schema structure and prompt design
3. CHECKPOINT: If surah name matching logic is unclear, ask
4. IMPLEMENT: Create both files
5. VERIFY: Ensure schemas match expected JSON examples
6. REPORT: Complete structured report (REQUIRED - see below)

## CRITICAL: Structured Report Format

You MUST end your response with this exact report format. The orchestrator needs it to complete the workflow (git commit, status updates, metrics).

```markdown
## Agent Report: Task 4.1.2

### 1. Status
**Result:** COMPLETE | NEEDS_INPUT | BLOCKED
**Confidence:** high | medium | low

### 2. Summary
[1-2 sentences describing what was accomplished]

### 3. Files Changed

| File | Action | Lines | Description |
|------|--------|-------|-------------|
| lib/validation/ai.ts | Created | +XX | Session extraction Zod schema |
| lib/api/prompts.ts | Created | +XX | System prompt and extraction function |

### 4. Exports Added

| Export | Type | Purpose |
|--------|------|---------|
| sessionExtractionSchema | Zod schema | Validates AI extraction response |
| SessionExtraction | type | TypeScript type for extraction |
| SESSION_EXTRACTION_PROMPT | const | System prompt for Gemini |
| extractSession | function | Main extraction API |

### 5. Dependencies

**Added packages:** None
**New imports:** [list any new import relationships]

### 6. Metrics

| Metric | Value |
|--------|-------|
| Estimated tokens | ~Xk |
| Tool calls | X |
| Files read | X |
| Checkpoints | X |

### 7. Code Review Flag

**Review needed:** Yes
**Reason:** Task size L

### 8. Testing Notes

**Typecheck:** npm run typecheck - Expected: Pass
**Manual verification:**
1. [Step to verify]
2. [Step to verify]

### 9. Learnings (if any)

[Only if you discovered a pattern worth recording]

### 10. Commit Message Suggestion

feat(epic-4): Task 4.1.2 - Session extraction prompt

- Add sessionExtractionSchema with Zod validation
- Create SESSION_EXTRACTION_PROMPT for Gemini
- Implement extractSession() function

Co-Authored-By: Claude <noreply@anthropic.com>
```
```

---

## Task 4.1.3: Mistake Extraction Prompt

**Agent Type:** prompt-agent
**Subagent:** `general-purpose`
**Depends On:** 4.1.2 (needs schema patterns)

### Dispatch Prompt

```markdown
# Prompt Agent Task: 4.1.3 - Mistake Extraction Prompt

## Your Role
You are a Prompt Agent implementing mistake extraction for a Quran study app.
Users describe mistakes they made during recitation, and the AI extracts structured data.

## Task Specification
**Size:** L | **Files:** `lib/api/prompts.ts`, `lib/validation/ai.ts`

### What to Create

1. **Zod Schema** (`lib/validation/ai.ts`):
Add `mistakeExtractionSchema` with these fields:

```typescript
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

2. **Terminology Mapping** (include in prompt):

| User Says | Category | Subcategory |
|-----------|----------|-------------|
| tajweed, tajwid | tajweed | - |
| ghunna, gunna | tajweed | ghunna |
| madd, mad, elongation | tajweed | madd |
| idgham, idghaam | tajweed | idgham |
| ikhfa, ikhfaa | tajweed | ikhfa |
| qalqala, qalqalah | tajweed | qalqalah |
| pronunciation, articulation | pronunciation | - |
| makhraj, makharij | pronunciation | makhraj |
| forgot, blanked, couldn't remember | memorization | forgotten_word |
| skipped, missed verse | memorization | verse_skip |
| mixed up, confused verses | memorization | mutashabih |
| hesitated, paused, slow | fluency | hesitation |
| stumbled, not smooth | fluency | rhythm |
| repeated myself | fluency | repetition |
| wrong stop, bad pause | waqf | wrong_stop |
| didn't stop, missed stop | waqf | missed_stop |

3. **Severity Guidelines** (include in prompt):

| Level | Description | User Indicators |
|-------|-------------|-----------------|
| 1 | Minor | "small slip", "barely noticeable", "self-corrected instantly" |
| 2 | Light | "slight error", "minor issue", "corrected quickly" |
| 3 | Moderate | "mistake", "error", "needed to fix" |
| 4 | Significant | "major mistake", "big error", "serious" |
| 5 | Critical | "completely wrong", "fundamental error", "changed meaning" |

4. **Combined Schema**:
Create `combinedExtractionSchema` that merges session + mistakes for chat responses.

### Expected JSON Output Examples

**Input:** "I made a tajweed mistake on ayah 5, forgot the ghunna"
```json
{
  "mistakes": [{
    "portion_surah": "Al-Fatihah",
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
      "error_subcategory": "mutashabih",
      "severity_level": 3,
      "ayah_number": 15,
      "additional_notes": "Confused with similar verse"
    }
  ],
  "follow_up_question": null,
  "confidence": "high"
}
```

## Context Files to Read First
- `lib/validation/ai.ts` - sessionExtractionSchema (from 4.1.2)
- `lib/api/prompts.ts` - SESSION_EXTRACTION_PROMPT (from 4.1.2)
- `types/session.ts` - ERROR_CATEGORIES, ERROR_SUBCATEGORIES

## Standards to Follow
- Same Zod patterns as sessionExtractionSchema
- Terminology mapping must be comprehensive
- Mistakes inherit surah context from conversation if not specified
- Combined schema should allow both session + mistakes in one response

## Workflow
1. READ: Read context files including 4.1.2 outputs
2. PLAN: Design terminology mapping and severity inference
3. IMPLEMENT: Add schemas and prompts to existing files
4. VERIFY: Test with example inputs mentally
5. REPORT: Complete structured report (REQUIRED)

## CRITICAL: Structured Report Format

You MUST end with the standard agent report format (see report-format.md).
Required sections: Status, Summary, Files Changed, Exports Added, Metrics, Code Review Flag, Testing Notes, Commit Message.
```

---

## Task 4.1.4: useAIChat Hook

**Agent Type:** prompt-agent
**Subagent:** `general-purpose`
**Depends On:** 4.1.2 + 4.1.3 (needs schemas)

### Dispatch Prompt

```markdown
# Prompt Agent Task: 4.1.4 - useAIChat Hook

## Your Role
You are a Prompt Agent implementing the useAIChat React hook.
This hook manages conversation state and accumulates extracted data.

## Task Specification
**Size:** M | **Files:** `lib/hooks/useAIChat.ts`

### Interface to Implement

```typescript
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  extraction?: CombinedExtraction
  timestamp: Date
}

interface UseAIChatReturn {
  messages: Message[]
  extractedSession: Partial<SessionFormData>
  extractedPortions: PortionFormData[]
  extractedMistakes: MistakeFormData[]
  isLoading: boolean
  error: string | null

  sendMessage: (text: string) => Promise<void>
  clearChat: () => void
  getCurrentExtraction: () => { session, portions, mistakes }
  isReadyToSave: boolean
}
```

### Accumulation Logic
- Each AI message may contain partial extraction
- Session fields merge (later values override earlier)
- Portions accumulate (add to array)
- Mistakes accumulate (add to array)
- Use `useMemo` to compute accumulated state from all messages

### Implementation Details

1. **State**:
```typescript
const [messages, setMessages] = useState<Message[]>([])
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState<string | null>(null)
```

2. **Accumulated Extraction** (useMemo):
```typescript
const { extractedSession, extractedPortions, extractedMistakes } = useMemo(() => {
  // Iterate through messages with extractions
  // Merge session fields, accumulate portions and mistakes
}, [messages])
```

3. **sendMessage**:
```typescript
async function sendMessage(text: string) {
  // Add user message immediately
  // Set loading
  // Call extractSession (or combined extraction)
  // Add AI message with extraction
  // Clear loading
  // Handle errors
}
```

4. **isReadyToSave**:
```typescript
const isReadyToSave = useMemo(() => {
  return extractedPortions.some(p => p.surah_name)
}, [extractedPortions])
```

### Error Handling
- Wrap API calls in try/catch
- Set error state with user-friendly message
- Allow retry (error clears on next sendMessage)
- Validate AI response with Zod (handle parse errors)

## Context Files to Read First
- `lib/validation/ai.ts` - CombinedExtraction schema
- `lib/api/prompts.ts` - extractSession function
- `types/session.ts` - SessionFormData, PortionFormData, MistakeFormData
- `lib/hooks/` - existing hook patterns

## Standards to Follow
- Use uuid for message IDs (import 'react-native-get-random-values' first)
- Handle all async errors
- Memoize computed values
- No useEffect for derived state

## Workflow
1. READ: Understand extraction types and API
2. PLAN: Design state shape and accumulation logic
3. IMPLEMENT: Create hook
4. VERIFY: Trace through a conversation flow mentally
5. REPORT: Complete structured report (REQUIRED)

## CRITICAL: Structured Report Format

You MUST end with the standard agent report format. Include:

```markdown
## Agent Report: Task 4.1.4

### 1. Status
**Result:** COMPLETE
**Confidence:** high

### 2. Summary
[What was built]

### 3. Files Changed
| File | Action | Lines | Description |
|------|--------|-------|-------------|
| lib/hooks/useAIChat.ts | Created | +XX | AI chat hook with accumulation |

### 4. Exports Added
| Export | Type | Purpose |
|--------|------|---------|
| useAIChat | hook | Main chat state management |
| Message | type | Chat message structure |
| UseAIChatReturn | type | Hook return type |

### 5-10. [Other required sections...]

### Usage Example (include in Testing Notes)
```typescript
function ChatScreen() {
  const { messages, sendMessage, isReadyToSave, getCurrentExtraction } = useAIChat()
}
```

### 11. Commit Message Suggestion
feat(epic-4): Task 4.1.4 - useAIChat hook

- Add useAIChat hook with conversation state
- Implement extraction accumulation logic
- Handle loading and error states

Co-Authored-By: Claude <noreply@anthropic.com>
```
```

---

## Parallel Execution Strategy

```
Time →

T1: /agent-dispatch 4.1.2 (prompt-agent) ──────────────────► Agent Reports
    /agent-dispatch 4.3.1 (setup-agent)  ─────► Agent Reports
                                                      │
T2: /agent-complete (4.3.1) ◄─────────────────────────┘
    - User approves → Commit, update status
    /agent-complete (4.1.2) ◄─────────────────────────────┘
    - User approves → Code review → Commit, update status
                                                      │
T3: /agent-dispatch 4.1.3 (prompt-agent) ──────────────────► Agent Reports
    /agent-dispatch 4.3.2 (prompt-agent) ─────────────────► Agent Reports
                                                      │
T4: /agent-complete (both) ◄──────────────────────────────┘
    - Process each: approve → review → commit → status
                                                      │
T5: /agent-dispatch 4.1.4 (prompt-agent) ──────────────────► Agent Reports
                                                      │
T6: /agent-complete (4.1.4) ◄─────────────────────────────┘
    - Final feature 4.1 task complete
```

### Workflow Per Agent

```
1. /agent-dispatch [task_id]
   └── Launches agent with focused context

2. [Agent works in background]
   └── User can monitor: tail -50 [output_file]

3. Agent returns structured report
   └── Contains: files, metrics, commit message

4. /agent-complete
   ├── Parse report
   ├── Show summary to user
   ├── User approves
   ├── Run code-reviewer (if L/XL)
   ├── Git commit
   ├── Update status/CURRENT.md
   ├── Update TASKS.md
   ├── Update meta/session/CURRENT.md
   └── Update meta/metrics/*

5. Ready for next task
```

## Orchestrator Commands

### Dispatch Agent: /agent-dispatch 4.1.2
```
Orchestrator will:
1. Read task spec from TASKS.md
2. Select agent type (prompt-agent)
3. Gather context files
4. Compose prompt with report format requirement
5. Launch via Task tool (background)
6. Update meta/session/CURRENT.md with agent tracking
7. Report agent ID and output file to user
```

### Check Agent Progress
```bash
tail -50 [output_file_path]
# or
Read tool on output file
```

### Resume Agent with Input
```
Use Task tool with:
- resume: [agent_id from previous response]
- prompt: "User clarification: [answer]"
```

### Complete Task: /agent-complete
```
Orchestrator will:
1. Parse structured report from agent
2. Present summary to user
3. Get user approval
4. Run code-reviewer (if flagged)
5. Git commit with suggested message
6. Update status/CURRENT.md
7. Update TASKS.md (mark complete)
8. Update meta/session/CURRENT.md (add metrics row)
9. Update meta/metrics/* (detailed tracking)
10. Record learnings (if any)
11. Report completion, suggest next task
```

### Full Cycle Example
```
User: /agent-dispatch 4.1.2
Orchestrator: [Dispatches agent, reports ID]

[Agent works...]

Orchestrator: Agent complete! Here's the summary...
             Files: 2 created
             Review: Needed
             Approve?

User: approve

Orchestrator: [Runs code review]
             [Git commits]
             [Updates all status/metrics]
             Task 4.1.2 complete! Commit: abc123
             Next: 4.1.3 - Mistake Extraction Prompt
             Ready to dispatch?

User: yes

Orchestrator: /agent-dispatch 4.1.3
[Cycle repeats...]
```
