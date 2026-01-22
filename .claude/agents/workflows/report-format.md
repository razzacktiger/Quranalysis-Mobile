# Agent Report Format

Standardized report format that ALL agents must return. This enables the orchestrator to handle git, status, and metrics consistently.

## Report Structure

```markdown
## Agent Report: Task [ID]

### 1. Status
**Result:** COMPLETE | NEEDS_INPUT | BLOCKED
**Confidence:** high | medium | low

### 2. Summary
[1-2 sentence description of what was accomplished]

### 3. Files Changed

| File | Action | Lines | Description |
|------|--------|-------|-------------|
| path/to/file.ts | Created | +85 | Description of file |
| path/to/other.ts | Modified | +12, -3 | What changed |

### 4. Exports Added

| Export | Type | Purpose |
|--------|------|---------|
| `functionName` | function | What it does |
| `TypeName` | type | What it represents |
| `schemaName` | schema | What it validates |

### 5. Dependencies

**Added packages:** (if any)
- `package-name@version` - why needed

**New imports in existing files:** (if any)
- `file.ts` now imports from `new-module`

### 6. Metrics

| Metric | Value |
|--------|-------|
| Estimated tokens | ~Xk |
| Tool calls | X |
| Files read | X |
| Checkpoints | X |

### 7. Code Review Flag

**Review needed:** Yes | No
**Reason:** [Task size M/L/XL] | [Modified >3 files] | [Security-sensitive]

### 8. Testing Notes

**Typecheck:**
- Run: `npm run typecheck`
- Expected: Pass | Known issues: [list]

**Manual verification:**
- [Step 1 to verify]
- [Step 2 to verify]

**Automated tests:**
- Run: `npm test -- path/to/test`
- Status: [If tests exist and were checked]

### 9. Learnings (if any)

**Pattern discovered:**
- **Problem:** [What issue was encountered]
- **Solution:** [How it was solved]
- **Category:** [react-native | typescript | api | etc.]
- **Add to:** learnings/[file].md

### 10. Blockers / Issues (if any)

| Issue | Severity | Resolution |
|-------|----------|------------|
| [Description] | High/Med/Low | [How resolved OR needs input] |

### 11. Commit Message Suggestion

```
feat(epic-X): Task X.X.X - [Brief description]

- [Change 1]
- [Change 2]
- [Change 3]

Co-Authored-By: Claude <noreply@anthropic.com>
```

### 12. Next Steps (if applicable)

- [What should happen next]
- [Dependencies unblocked]
- [Recommendations]
```

## Required vs Optional Sections

| Section | Required | When to Include |
|---------|----------|-----------------|
| 1. Status | Always | Every report |
| 2. Summary | Always | Every report |
| 3. Files Changed | Always | Every report |
| 4. Exports Added | If applicable | When new exports created |
| 5. Dependencies | If applicable | When packages/imports added |
| 6. Metrics | Always | Every report |
| 7. Code Review Flag | Always | Every report |
| 8. Testing Notes | Always | Every report |
| 9. Learnings | If applicable | When patterns discovered |
| 10. Blockers | If applicable | When issues exist |
| 11. Commit Message | Always | Every report |
| 12. Next Steps | If applicable | When relevant |

## Status Definitions

### COMPLETE
- Implementation finished
- All acceptance criteria met
- Ready for user review and commit

### NEEDS_INPUT
- Checkpoint reached
- Specific question needs answering
- Include question in Blockers section

### BLOCKED
- Cannot proceed
- Missing dependency or critical issue
- Include blocker details

## Metrics Guidelines

### Estimating Tokens
- Small task (S): ~3-5k tokens
- Medium task (M): ~8-12k tokens
- Large task (L): ~15-25k tokens
- Extra large (XL): ~25-40k tokens

### Counting Tool Calls
Count all tool invocations:
- Read, Write, Edit
- Glob, Grep
- Bash commands
- Web fetches

### Files Read
List files that were read for context:
- Task spec files
- Existing code files
- Standards files
- Type definition files

## Code Review Flag Logic

Set "Review needed: Yes" when:
- Task size is M, L, or XL
- More than 3 files modified
- Security-sensitive code (auth, API keys, user data)
- Complex business logic
- Database schema changes

## Example: Complete Report

```markdown
## Agent Report: Task 4.1.2

### 1. Status
**Result:** COMPLETE
**Confidence:** high

### 2. Summary
Created session extraction Zod schema and LLM prompt for extracting Quran study session data from natural language input.

### 3. Files Changed

| File | Action | Lines | Description |
|------|--------|-------|-------------|
| lib/validation/ai.ts | Created | +95 | Session extraction Zod schema |
| lib/api/prompts.ts | Created | +145 | System prompt and extraction function |

### 4. Exports Added

| Export | Type | Purpose |
|--------|------|---------|
| `sessionExtractionSchema` | Zod schema | Validates AI extraction response |
| `SessionExtraction` | type | TypeScript type for extraction |
| `SESSION_EXTRACTION_PROMPT` | const | System prompt for Gemini |
| `extractSession` | function | Main extraction API |

### 5. Dependencies

**Added packages:** None

**New imports in existing files:**
- `lib/api/prompts.ts` imports from `lib/api/ai.ts`
- `lib/api/prompts.ts` imports from `lib/validation/ai.ts`

### 6. Metrics

| Metric | Value |
|--------|-------|
| Estimated tokens | ~10k |
| Tool calls | 15 |
| Files read | 6 |
| Checkpoints | 0 |

### 7. Code Review Flag

**Review needed:** Yes
**Reason:** Task size L, prompt engineering requires validation

### 8. Testing Notes

**Typecheck:**
- Run: `npm run typecheck`
- Expected: Pass

**Manual verification:**
1. Import `extractSession` in a test file
2. Call with: `extractSession("I practiced Al-Fatiha for 20 minutes")`
3. Verify response matches expected schema

**Automated tests:**
- None yet (tests in Task 4.2.5)

### 9. Learnings

**Pattern discovered:**
- **Problem:** Firebase AI Schema format differs from Zod
- **Solution:** Created helper to convert Zod schema to Firebase Schema
- **Category:** api
- **Add to:** learnings/common-mistakes.md

### 10. Blockers / Issues

None

### 11. Commit Message Suggestion

```
feat(epic-4): Task 4.1.2 - Session extraction prompt

- Add sessionExtractionSchema with Zod validation
- Create SESSION_EXTRACTION_PROMPT for Gemini
- Implement extractSession() function
- Handle surah name normalization and Juz references

Co-Authored-By: Claude <noreply@anthropic.com>
```

### 12. Next Steps

- Task 4.1.3 can now proceed (uses same patterns)
- Task 4.1.4 depends on this schema
```

## Parsing the Report

The orchestrator parses this report to:

1. **Git Commit**: Uses section 3 (files) and section 11 (message)
2. **Status Update**: Uses section 1 (status) and section 3 (files)
3. **Metrics Recording**: Uses section 6 (metrics)
4. **Code Review**: Uses section 7 (review flag)
5. **Learnings**: Uses section 9 (learnings)
6. **Session Tracking**: Uses sections 3, 6 for meta/session/CURRENT.md
