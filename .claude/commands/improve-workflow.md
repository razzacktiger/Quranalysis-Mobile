---
description: Analyze and improve the workflow system
---

# /improve-workflow

Analyze workflow effectiveness and propose improvements.

## Parameters

| Param | Required | Description |
|-------|----------|-------------|
| `focus` | No | Area to focus on (commands, agents, state, metrics) |

## State Operations

**Reads:**
- `state/metrics.json` - Historical metrics
- `state/learnings-index.json` - Captured patterns
- `workflow-audits/*.md` - Previous audits
- `meta/IMPROVEMENT-BACKLOG.md` - Pending improvements

**Writes:**
- `workflow-audits/AUDIT-{date}.md` - New audit findings
- `meta/IMPROVEMENT-BACKLOG.md` - Add new items

## Analysis Areas

1. Command usage patterns
2. Agent effectiveness
3. Context efficiency
4. Common friction points
5. Missing automations

## Execution

**Read and follow the full instructions:**
→ `core/commands/instructions/workflows/improve-workflow.md`

**Schema reference:**
→ `core/commands/schemas/improve-workflow.schema.json`
