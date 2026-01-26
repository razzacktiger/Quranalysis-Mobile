---
description: Initialize session tracking with automatic stale session archiving
---

# /start-session

Initialize a new development session with automatic cleanup of stale data.

## Parameters

| Param | Required | Description |
|-------|----------|-------------|
| `epic_id` | No | Optional epic to start with |

## State Operations

**Reads:**
- `state/project.json` - Current project context

**Writes:**
- `state/session.json` - Reset and initialize new session
  - Fields: `started`, `epic_id`, `active_task`, `completed_tasks`, `totals`

## Execution

**Read and follow the full instructions:**
→ `core/commands/instructions/standard-loop/start-session.md`

**Schema reference:**
→ `core/commands/schemas/start-session.schema.json`
