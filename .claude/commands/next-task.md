---
description: Continue to the next task in the current epic
---

# Next Task

Continue work on the current epic with smart context loading.

## Step 1: Read Status
Read `status/CURRENT.md` to identify:
- Current epic
- Last completed task
- Any blockers noted

## Step 2: Read Epic
Read the current epic feature file to find the next task.
Note task type and size for smart loading.

## Step 3: Smart Loading (Based on Task Type)
Load only relevant standards based on task type:

### If UI task:
- Read: `standards/components.md`
- Read: `standards/styling.md`
- Read: `learnings/react-native.md`

### If API/Hook task:
- Read: `standards/api-patterns.md`
- Read: `standards/state-management.md`
- Read: `learnings/typescript.md`

### If Test task:
- Read: `standards/testing.md`
- Read: `learnings/testing.md`

### If DB/Migration task:
- Read: `reference/API-PATTERNS.md`

### Always check (if small):
- `learnings/common-mistakes.md`

## Step 4: Check File Read Cache
Before reading implementation files:
1. Check `meta/session/CURRENT.md` for already-read files
2. Skip if file already in context this session
3. Add new reads to the tracking list

This prevents redundant file reads.

## Step 5: Check Task Requirements
For the next task, identify:
- Acceptance criteria
- Files to create/modify
- Dependencies (verify they're complete)
- Test commands
- Whether TDD is required (marked with TDD)
- Whether UI design needed (marked with UI)

## Step 6: Update Session Tracking
Update `meta/session/CURRENT.md`:
- Set Active Task details
- Note task start time

## Step 7: Implement
If TDD required:
1. Write tests first
2. Run tests (should fail)
3. Implement code
4. Run tests (should pass)

If UI task:
- Consider using /frontend-design agent for component design

If not TDD:
1. Implement following acceptance criteria
2. Run specified tests

## Step 8: Report Results
Tell the user:
- Task ID in progress
- Files that will be created/modified
- Which standards loaded
- Tests to run after

Then implement and wait for approval before committing.

## On Failure
**After 1st failure - ASSESS:**
- Human-required? (env vars, API keys, design decisions) -> Ask immediately
- Code/logic issue? -> Check `learnings/`, try again

**After 2nd failure:** Research using Context7 or web

**After 3rd failure:** Stop and ask human

## Standards
Follow `.claude/standards/` for all code.
Only load relevant standard files to save context.

## Example Usage
```
User: /next-task
Agent: *Reads status, identifies task 4.1.2*
Agent: "Next task: 4.1.2 - Create Session Extraction Prompt
       Type: API (loading api-patterns.md)
       Size: L

       Files to create: lib/api/prompts.ts
       Dependencies: 4.1.1 (complete)
       TDD: No

       Implementing..."
```

## Context Efficiency
This skill loads ~60% less context than loading all standards:
- Before: ~16k tokens for all standards
- After: ~6k tokens for relevant standards only
