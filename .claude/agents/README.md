# Agent Orchestration System

A hierarchical multi-agent system for executing epic tasks with isolated context, parallel execution, and full workflow integration.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR SESSION                          │
│  Responsibilities:                                               │
│  - Dispatch agents with focused context                          │
│  - Review agent outputs with user                                │
│  - Handle git commits, status updates, metrics                   │
│  - Coordinate parallel execution                                 │
│  - Maintain epic-level context only                              │
└──────────────────────────┬──────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
   ┌─────────┐       ┌─────────┐        ┌─────────┐
   │ AGENT 1 │       │ AGENT 2 │        │ AGENT 3 │
   │ Task X  │       │ Task Y  │        │ Task Z  │
   │         │       │         │        │         │
   │ Returns │       │ Returns │        │ Returns │
   │ Report  │       │ Report  │        │ Report  │
   └─────────┘       └─────────┘        └─────────┘
   Fresh context     Fresh context      Fresh context
   ~5-10k tokens     ~5-10k tokens      ~5-10k tokens
```

## Key Principle: Separation of Concerns

| Responsibility | Who Handles | Why |
|---------------|-------------|-----|
| **Implementation** | Agents | Isolated context, focused work |
| **Git commits** | Orchestrator | Consistent commit messages, user approval |
| **Status updates** | Orchestrator | Single source of truth |
| **Metrics recording** | Orchestrator | Centralized tracking |
| **Code review** | Orchestrator (dispatches review-agent) | After implementation, before commit |
| **User approval** | Orchestrator | User reviews before any permanent changes |

## Agent Types

| Type | Use For | Subagent Type | Reference |
|------|---------|---------------|-----------|
| [prompt-agent](./types/prompt-agent.md) | API logic, prompts, hooks, services | `general-purpose` | Backend work |
| [ui-agent](./types/ui-agent.md) | React Native components, screens | `general-purpose` | Frontend work |
| [setup-agent](./types/setup-agent.md) | Config, packages, environment | `general-purpose` | Configuration |
| [test-agent](./types/test-agent.md) | E2E tests, unit tests | `general-purpose` | Test coverage |
| [review-agent](./types/review-agent.md) | Code review, quality checks | `feature-dev:code-reviewer` | Quality gate |

## Workflow Overview

See [workflows/orchestrator.md](./workflows/orchestrator.md) for complete details.

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. DISPATCH                                                      │
│    Orchestrator sends agent with task spec + context             │
│    Agent runs in background                                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. AGENT EXECUTES                                                │
│    Agent: READ → PLAN → CHECKPOINT? → IMPLEMENT → VERIFY         │
│    Returns: Structured Report (see workflows/report-format.md)   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. USER REVIEW                                                   │
│    Orchestrator shows summary to user                            │
│    User: Approve | Request Changes | Reject                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. ORCHESTRATOR COMPLETES                                        │
│    On approval:                                                  │
│    ├── Run code-reviewer (for M/L/XL tasks)                      │
│    ├── Git commit with proper message                            │
│    ├── Update status/CURRENT.md                                  │
│    ├── Update TASKS.md (mark complete)                           │
│    ├── Update meta/session/CURRENT.md                            │
│    ├── Update meta/metrics/*                                     │
│    └── Add to learnings/* (if applicable)                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. NEXT TASK                                                     │
│    Dispatch next agent OR /end-session                           │
└─────────────────────────────────────────────────────────────────┘
```

## Integration with Existing Commands

| Command | How It Integrates |
|---------|-------------------|
| `/start-epic` | Unchanged - initializes session, orchestrator takes over |
| `/complete-task` | Replaced by orchestrator workflow when using agents |
| `/next-task` | Orchestrator dispatches next agent |
| `/end-session` | Unchanged - aggregates all agent metrics |

## Report Format

Agents must return a structured report. See [workflows/report-format.md](./workflows/report-format.md).

Key sections:
- **Status**: COMPLETE / NEEDS_INPUT / BLOCKED
- **Files Changed**: For git commit
- **Metrics**: Tokens, tools, files read
- **Review Flag**: Whether code-reviewer should run
- **Learnings**: Patterns discovered (for orchestrator to record)

## User Interaction Points

### During Agent Execution
- Read agent output file anytime: `tail -100 [output_file]`
- Agents run with `run_in_background: true`

### At Checkpoints
- Agent pauses for ambiguous decisions
- Orchestrator relays your input via `resume`

### After Agent Completes
1. Orchestrator shows summary
2. You approve or request changes
3. If changes needed: orchestrator resumes agent with feedback
4. If approved: orchestrator handles git/status/metrics

## Benefits

| Benefit | How Achieved |
|---------|--------------|
| **Context isolation** | Each agent starts fresh (~5-10k tokens) |
| **Parallel execution** | Independent tasks run simultaneously |
| **Quality maintenance** | Full model attention per task |
| **Workflow consistency** | Orchestrator handles all status/git/metrics |
| **User control** | Approval required before commits |
| **Metrics integrity** | Centralized recording in orchestrator |

## File Structure

```
.claude/agents/
├── README.md              # This file
├── DISPATCH.md            # Agent selection rules
├── types/                 # Agent type definitions
│   ├── prompt-agent.md
│   ├── ui-agent.md
│   ├── setup-agent.md
│   ├── test-agent.md
│   └── review-agent.md
├── workflows/
│   ├── standard.md        # Agent execution workflow
│   ├── checkpoints.md     # Checkpoint protocol
│   ├── report-format.md   # Structured report format
│   └── orchestrator.md    # Orchestrator workflow
└── examples/
    └── epic-4-feature-4.1.md  # Example prompts
```

## Quick Reference

### Dispatch an Agent
```
Task tool:
- subagent_type: "general-purpose"
- run_in_background: true
- prompt: [agent prompt with task spec]
```

### Check Agent Progress
```bash
tail -50 [output_file_path]
# or
Read tool on output file
```

### Resume Agent with Input
```
Task tool:
- resume: [agent_id]
- prompt: "Your clarification here"
```

### Complete Task After Approval
Orchestrator runs the workflow from [workflows/orchestrator.md](./workflows/orchestrator.md)
