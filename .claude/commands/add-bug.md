---
description: Log a new bug to the bug tracker
---

# /add-bug

Log a bug discovered during development.

## Parameters

| Param | Required | Description |
|-------|----------|-------------|
| `feature_id` | Yes | Feature the bug belongs to (e.g., "4.1") |
| `title` | Yes | Brief bug description |
| `severity` | Yes | 1=Critical, 2=High, 3=Medium, 4=Low |

## State Operations

**Reads:**
- `state/bugs.json` - Existing bugs (for ID generation)

**Writes:**
- `state/bugs.json` → Append new bug entry

## Bug Schema

```json
{
  "id": "BUG-{feature}.{n}",
  "feature_id": "{feature_id}",
  "epic_id": "{epic_id}",
  "title": "{title}",
  "severity": {1-4},
  "status": "open",
  "created_at": "{ISO timestamp}",
  "description": "{detailed description}"
}
```

## Execution

**Read and follow the full instructions:**
→ `core/commands/instructions/standard-loop/add-bug.md`

**Schema reference:**
→ `core/commands/schemas/add-bug.schema.json`
