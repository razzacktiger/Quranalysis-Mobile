---
description: Start fixing a logged bug
---

# /fix-bug

Start working on a bug from the bug tracker.

## Parameters

| Param | Required | Description |
|-------|----------|-------------|
| `bug_id` | No | Specific bug ID (e.g., "BUG-4.1.1") |
| `feature_id` | No | Fix bugs for a feature (e.g., "4.1") |

## State Operations

**Reads:**
- `state/bugs.json` - Find bug(s) to fix
- `state/session.json` - Current session

**Writes:**
- `state/bugs.json` → Update bug status to `in_progress`
- `state/session.json` → Set active bug

## Logic

- If `bug_id` provided: fix that specific bug
- If `feature_id` provided: show all open bugs for that feature
- If neither: show all open bugs ordered by severity

## Execution

**Read and follow the full instructions:**
→ `core/commands/instructions/standard-loop/fix-bug.md`

**Schema reference:**
→ `core/commands/schemas/fix-bug.schema.json`
