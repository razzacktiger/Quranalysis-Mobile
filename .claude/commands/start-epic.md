---
description: Begin working on an epic with branch setup
---

# /start-epic

Initialize work on an epic with git branch and session setup.

## Parameters

| Param | Required | Description |
|-------|----------|-------------|
| `epic_id` | Yes | Epic identifier (e.g., "5" or "5-profile") |
| `--bugs` | No | Focus on bugs instead of tasks |

## State Operations

**Reads:**
- `state/project.json` - Verify epic exists
- `project/epics/active/EPIC-{N}-*/README.md` - Epic details

**Writes:**
- `state/project.json` → Set `active.epic_id`, `active.feature_id`
- `state/session.json` → Initialize session for epic

## Git Operations

- Create branch: `epic-{n}-{name}` (if not exists)
- Checkout branch

## Execution

**Read and follow the full instructions:**
→ `core/commands/instructions/standard-loop/start-epic.md`

**Schema reference:**
→ `core/commands/schemas/start-epic.schema.json`
