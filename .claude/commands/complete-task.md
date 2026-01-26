---
description: Complete current task with code review and commit
---

# /complete-task

Commit work with code review, metrics tracking, and status updates.

## Parameters

| Param | Required | Description |
|-------|----------|-------------|
| `commit_message` | Yes | Git commit message for the completed work |

## Prerequisites

- Must have an active task (`session.active_task`)

## State Operations

**Reads:**
- `state/project.json` - Epic context
- `state/session.json` - Active task info
- `state/tasks.json` - Task details

**Writes:**
- `state/tasks.json` → `status=complete`, `completed_at`, `metrics`
- `state/session.json` → Append to `completed_tasks`, update `totals`, clear `active_task`
- `state/project.json` → Update `progress[epic].completed`

## Triggers

- Runs `code-reviewer` agent for M/L/XL tasks
- Git operations: `add`, `commit`

## Checklist

1. Run code review (for M/L/XL tasks)
2. Update task status to complete
3. Record metrics (tokens, turns, tools)
4. Update session totals
5. Check for new learnings to capture

## Execution

**Read and follow the full instructions:**
→ `core/commands/instructions/standard-loop/complete-task.md`

**Schema reference:**
→ `core/commands/schemas/complete-task.schema.json`
