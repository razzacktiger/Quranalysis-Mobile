---
description: End current session and archive metrics
---

# /end-session

Archive the current session and aggregate metrics.

## Parameters

| Param | Required | Description |
|-------|----------|-------------|
| `duration_minutes` | No | Override calculated duration |

## State Operations

**Reads:**
- `state/session.json` - Session data to archive

**Writes:**
- `state/session.json` → Reset for next session
- `state/metrics.json` → Aggregate session metrics
- `state/archive/session-{date}-{n}.json` → Archive session

## Metrics Aggregated

- Total tasks completed
- Total tokens used
- Average tokens per task
- Tool call distribution
- Files touched
- Bugs caught

## Execution

**Read and follow the full instructions:**
→ `core/commands/instructions/workflows/end-session.md`

**Schema reference:**
→ `core/commands/schemas/end-session.schema.json`
