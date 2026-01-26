---
description: Run a predefined workflow
---

# /run-workflow

Execute a predefined multi-step workflow.

## Parameters

| Param | Required | Description |
|-------|----------|-------------|
| `workflow_name` | Yes | Name of workflow to run |

## Available Workflows

| Workflow | Description |
|----------|-------------|
| `daily-start` | Full session initialization |
| `feature-complete` | Finish a feature with tests and review |
| `bug-sweep` | Find and fix all bugs in a feature |
| `epic-review` | Review epic progress and plan next steps |

## Execution

**Read and follow the full instructions:**
→ `core/commands/instructions/workflows/run-workflow.md`

**Schema reference:**
→ `core/commands/schemas/run-workflow.schema.json`
