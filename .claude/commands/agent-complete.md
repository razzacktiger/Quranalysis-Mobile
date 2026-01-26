---
description: Handle agent completion and integrate results
---

# /agent-complete

Process agent results, run code review, and complete the workflow.

## Parameters

| Param | Required | Description |
|-------|----------|-------------|
| `agent_id` | No | Specific agent ID to process (defaults to most recent) |

## State Operations

**Reads:**
- `state/session.json` - Active agents list
- Agent output file

**Writes:**
- `state/session.json` → Remove from `active_agents`, update metrics
- `state/tasks.json` → Update task status if approved

## Workflow

1. Read agent's structured report
2. Present summary to user
3. If approved: trigger code review (for M/L/XL)
4. Git commit with proper message
5. Update all status files
6. Record metrics

## Execution

**Read and follow the full instructions:**
→ `core/commands/instructions/standard-loop/agent-complete.md`

**Schema reference:**
→ `core/commands/schemas/agent-complete.schema.json`
