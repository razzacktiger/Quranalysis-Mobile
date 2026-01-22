# Checkpoint Protocol

When and how agents pause for human input.

## Purpose

Checkpoints allow:
- User oversight at critical decisions
- Course correction before wasted effort
- Knowledge transfer (user learns what's happening)
- Quality control gates

## Checkpoint Triggers

### MUST Checkpoint

| Trigger | Example |
|---------|---------|
| **Ambiguous requirement** | "Make it look nice" - what does nice mean? |
| **Multiple valid approaches** | Redux vs Context for state management |
| **Breaking change** | Modifying shared interface |
| **Scope expansion** | Task requires more than specified |
| **Security decision** | How to handle auth tokens |
| **Missing dependency** | Required file doesn't exist |

### MAY Checkpoint

| Trigger | Decision |
|---------|----------|
| **Minor ambiguity** | Use reasonable default, note in report |
| **Style choice** | Follow existing patterns |
| **Performance tradeoff** | Document decision in report |

### NEVER Checkpoint

| Situation | Instead |
|-----------|---------|
| **Routine implementation** | Just do it |
| **Standard patterns** | Follow standards |
| **Clear requirements** | Execute directly |

## Checkpoint Format

```markdown
## CHECKPOINT: [Brief Description]

### Context
[What I was trying to do]

### Question
[Specific question that needs answering]

### Options (if applicable)

**Option A: [Name]**
- Pros: [list]
- Cons: [list]
- Recommendation: [why or why not]

**Option B: [Name]**
- Pros: [list]
- Cons: [list]
- Recommendation: [why or why not]

### My Recommendation
[If you have one, state it with rationale]

### Awaiting
[What input do you need to proceed]
```

## Examples

### Example 1: Ambiguous Requirement

```markdown
## CHECKPOINT: Surah Name Normalization

### Context
Task 4.1.2 requires normalizing surah names to "English format".

### Question
What exactly is "English format" for surah names?

### Options

**Option A: Transliteration (Al-Fatiha, Al-Baqarah)**
- Pros: Commonly used, recognizable
- Cons: Multiple spellings exist (Fatihah vs Fatiha)

**Option B: Translation (The Opening, The Cow)**
- Pros: Meaningful to non-Arabic speakers
- Cons: Less common in Quran apps

**Option C: Both with primary (Al-Fatiha / The Opening)**
- Pros: Flexible, comprehensive
- Cons: More complex schema

### My Recommendation
Option A with standardized spellings. Most Quran apps use transliteration.

### Awaiting
Confirmation of naming format or alternative approach.
```

### Example 2: Missing Dependency

```markdown
## CHECKPOINT: Missing Type Definition

### Context
Implementing useAIChat hook (Task 4.1.4).

### Question
The hook needs `CombinedExtraction` type, but I don't see it defined.

### Required Type
```typescript
interface CombinedExtraction {
  session: SessionExtraction;
  mistakes: MistakeExtraction[];
  // What else?
}
```

### Options

**Option A: Define in Task 4.1.2/4.1.3 first**
- Need to complete prompt tasks before this hook

**Option B: I define a placeholder, refine later**
- Can proceed but may need changes

### My Recommendation
Option A - these tasks have a dependency order.

### Awaiting
Confirmation to wait for 4.1.2/4.1.3 or proceed with placeholder.
```

### Example 3: Scope Expansion

```markdown
## CHECKPOINT: Scope Expansion Detected

### Context
Implementing ChatModal (Task 4.2.2).

### Question
The spec mentions VoiceInputButton from Task 4.3.3, but that task isn't complete.

### Options

**Option A: Stub the voice button**
- Render placeholder, wire up later
- Can complete this task independently

**Option B: Wait for 4.3.3**
- Full implementation but blocked

**Option C: Implement voice button inline**
- Scope expansion, task grows

### My Recommendation
Option A - stub with testID, implement voice separately.

### Awaiting
Confirmation on approach for handling missing dependency.
```

## User Response Protocol

### User Can Reply With

1. **Selection**: "Go with Option A"
2. **Clarification**: "Here's what I mean..."
3. **New Direction**: "Actually, let's do this instead..."
4. **Context**: "Here's additional information..."

### Agent Response to Input

After receiving input:
1. Acknowledge the decision
2. Update plan if needed
3. Resume workflow from IMPLEMENT phase
4. Note decision in final report

## Checkpoint Tracking

Orchestrator tracks checkpoints in session file:

```markdown
## Checkpoints This Session

| Agent | Task | Checkpoint | Status | Resolution |
|-------|------|------------|--------|------------|
| prompt-agent | 4.1.2 | Surah format | Resolved | Use Option A |
| ui-agent | 4.2.2 | Voice button | Resolved | Stub for now |
```

## Timeout Handling

If no response within reasonable time:
- Agent can use reasonable default if low-risk
- Agent must wait if high-risk decision
- Orchestrator can resume agent with input later
