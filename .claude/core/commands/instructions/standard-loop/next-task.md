---
description: Continue to the next task in the current epic
---

# Next Task

Continue work on the current epic with smart context loading.

## Step 1: Read Project State
Read `state/project.json` to identify:
- Current epic (`active.epic_id`)
- Last completed task
- Any blockers noted

## Step 2: Find Next Task
Query `state/tasks.json` for the next pending task:
```typescript
// Filter: 
// - epic_id matches active epic
// - status = 'pending'
// Order by: feature_id, then task id
// Return: first match
```

## Step 2.5: Check for Blocking Bugs

Before proceeding to next task, check for blocking bugs:

Query `state/bugs.json`:
```typescript
// Filter:
// - epic_id matches OR feature_id matches current feature
// - status = 'open'
// - severity in [1, 2] (Critical, High)
```

If blocking bugs found:
```
⚠️ Feature X.X has blocking bugs that must be fixed first:

| ID | Title | Severity |
|----|-------|----------|
| BUG-X.X.X | {title} | {severity} |

Fix these before continuing with tasks.
Use `/fix-bug X.X` to start.
```

If only non-blocking bugs (severity 3-4), report as informational:
```
Note: Feature X.X has N non-blocking bugs (can fix later)
```
Then proceed to next task.

## Step 3: Smart Loading (Based on Task Type)
Load only relevant standards based on task type from `state/tasks.json`:

### If type = "UI":
- Read: `standards/components.md`
- Read: `standards/styling.md`
- Query: `state/learnings-index.json` by tag "react-native"

### If type = "API":
- Read: `standards/api-patterns.md`
- Read: `standards/state-management.md`
- Query: `state/learnings-index.json` by tag "typescript"

### If type = "Test":
- Read: `standards/testing.md`
- Query: `state/learnings-index.json` by tag "testing"

### Always check:
- Query: `state/learnings-index.json` by category "common-mistakes"

## Step 4: Check File Read Cache
Before reading implementation files:
1. Check `state/session.json` `files_read` array
2. Skip if file already in context this session
3. Add new reads to the tracking list

This prevents redundant file reads.

## Step 5: Check Task Requirements
From the task in `state/tasks.json`, identify:
- `acceptance_criteria` - what must be done
- `files` - files to create/modify
- `deps` - verify dependencies are complete (status = 'complete')
- `test_command` - how to verify
- `type` - determines what agents/standards to use
- `size` - determines if code review needed

## Step 6: Update Session State
Update `state/session.json`:
```json
{
  "active_task": {
    "id": "{task_id}",
    "name": "{task_name}",
    "type": "{type}",
    "size": "{size}",
    "started_at": "{ISO timestamp}"
  }
}
```

Update `state/project.json`:
```json
{
  "active": {
    "task_id": "{task_id}",
    "feature_id": "{feature_id}"
  }
}
```

Update `state/tasks.json` - set task status to "in_progress".

## Step 7: Implement
If TDD required (check notes/flags):
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
- Code/logic issue? -> Search learnings, try again

**After 2nd failure:** Research using web search

**After 3rd failure:** Stop and ask human

## Standards
Follow `.claude/standards/` for all code.
Only load relevant standard files to save context.

## Example Usage
```
User: /next-task
Agent: *Reads state/project.json, queries state/tasks.json*
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
