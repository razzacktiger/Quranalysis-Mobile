---
description: Dispatch a specialized agent for a task
---

# /agent-dispatch

Dispatch a specialized agent with focused context for a specific task.

## Parameters

| Param | Required | Description |
|-------|----------|-------------|
| `task_id` | Yes | Task ID to dispatch (e.g., "4.1.2") or "next" |

## Available Agent Types

| Type | Use For | Subagent |
|------|---------|----------|
| `prompt-agent` | API logic, hooks, services | `general-purpose` |
| `ui-agent` | React Native components | `general-purpose` |
| `setup-agent` | Config, packages, env | `general-purpose` |
| `test-agent` | E2E tests, unit tests | `general-purpose` |
| `review-agent` | Code review, quality | `feature-dev:code-reviewer` |

## State Operations

**Reads:**
- `state/session.json` - Current session
- `state/tasks.json` - Task details
- `state/project.json` - Epic context

**Writes:**
- `state/session.json` → Append to `active_agents`

## Agent References

- Dispatch rules: `core/agents/DISPATCH.md`
- Agent types: `core/agents/types/*.md`
- Report format: `core/agents/workflows/report-format.md`
- Orchestrator: `core/agents/workflows/orchestrator.md`

## Execution

**Read and follow the full instructions:**
→ `core/commands/instructions/standard-loop/agent-dispatch.md`

**Schema reference:**
→ `core/commands/schemas/agent-dispatch.schema.json`
