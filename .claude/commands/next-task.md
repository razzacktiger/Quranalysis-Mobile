---
description: Continue to the next pending task in the current epic
---

# /next-task

Get and start the next pending task with smart context loading.

## Parameters

| Param | Required | Description |
|-------|----------|-------------|
| `task_id` | No | Specific task ID to start (otherwise picks next pending) |

## State Operations

**Reads:**
- `state/project.json` - Current epic context
- `state/tasks.json` - Find next pending task
- `state/session.json` - Check file read cache
- `state/bugs.json` - Check for blocking bugs

**Writes:**
- `state/project.json` → `active.task_id`, `active.feature_id`
- `state/session.json` → `active_task`
- `state/tasks.json` → Set task status to `in_progress`

## Logic

Find next: First pending task in current epic, ordered by feature then task ID.

## Execution

**Read and follow the full instructions:**
→ `core/commands/instructions/standard-loop/next-task.md`

**Schema reference:**
→ `core/commands/schemas/next-task.schema.json`
