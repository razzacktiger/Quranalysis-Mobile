---
description: Sync documentation with current state
---

# /sync-docs

Synchronize documentation files with the current JSON state.

## Parameters

| Param | Required | Description |
|-------|----------|-------------|
| `target` | No | Specific doc to sync (tasks, bugs, status) |

## State Operations

**Reads:**
- `state/tasks.json`
- `state/bugs.json`
- `state/project.json`
- `state/metrics.json`

**Writes:**
- `status/CURRENT.md` - Human-readable status view
- `project/epics/*/features/*/TASKS.md` - Task views
- `project/epics/*/features/*/BUGS.md` - Bug views

## Sync Rules

- JSON is source of truth
- MD files are generated views
- Only sync explicitly requested or all if no target

## Execution

**Read and follow the full instructions:**
→ `core/commands/instructions/workflows/sync-docs.md`

**Schema reference:**
→ `core/commands/schemas/sync-docs.schema.json`
