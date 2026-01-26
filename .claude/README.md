# Claude Code Workflow - Quranalysis Mobile

**Version:** 3.0.0 | [Changelog](meta/CHANGELOG.md)

## What's New in v3.0

This version introduces a **JSON-based state system** for efficient multi-agent querying:

- All dynamic state moved to `state/*.json` files
- Centralized state manager utility (`lib/state-manager.ts`)
- Hybrid command format (JSON schemas + markdown instructions)
- Learnings indexed for fast semantic search
- Backward-compatible with existing workflow commands

## Quick Start

1. `/clear` - Fresh session
2. `/start-epic N-name` - Begin epic (initializes session tracking)
3. `/next-task` - Continue work
4. `/complete-task` - Commit with review + metrics
5. `/end-session` - Archive session + aggregate metrics

## Directory Structure

```
.claude/
├── core/                           # Reusable workflow framework
│   ├── commands/                   # Command system
│   │   ├── schemas/                # JSON Schema definitions
│   │   └── instructions/           # Step-by-step guides
│   ├── schemas/                    # Core data schemas
│   ├── agents/                     # Agent framework
│   │   ├── types/
│   │   ├── workflows/
│   │   └── examples/
│   └── lib/                        # Utilities (state-manager)
│
├── project/                        # Project-specific content
│   ├── epics/                      # Active + archive
│   ├── standards/                  # Coding standards
│   ├── learnings/                  # Captured patterns
│   ├── specs/                      # Research docs
│   └── reference/                  # API, ENUMS, TYPES
│
├── state/                          # Queryable JSON state
│   ├── project.json                # Current work status
│   ├── session.json                # Active session metrics
│   ├── metrics.json                # Aggregated metrics
│   ├── tasks.json                  # All tasks across epics
│   ├── bugs.json                   # All bugs across features
│   ├── learnings-index.json        # Searchable learnings index
│   └── archive/                    # Archived sessions
├── status/                         # Human-readable views
├── meta/                           # Changelog, backlog
├── guides/                         # Workflow guides
├── templates/                      # Templates
└── workflow-audits/                # Workflow improvement docs
```

## State Files Reference

| File                         | Purpose                      | When to Read   |
| ---------------------------- | ---------------------------- | -------------- |
| `state/project.json`         | Current epic, task, progress | Session start  |
| `state/session.json`         | Active session metrics       | During work    |
| `state/tasks.json`           | All tasks with status        | Task selection |
| `state/bugs.json`            | All bugs with status         | Bug fixing     |
| `state/metrics.json`         | Aggregated metrics           | End of session |
| `state/learnings-index.json` | Searchable learnings         | When stuck     |

## Using the State Manager

The state manager (`core/lib/state-manager.ts`) provides typed functions for all state operations:

```typescript
import * as state from ".claude/core/lib/state-manager";

// Read state
const project = state.getProject();
const tasks = state.getTasks({ epic_id: "EPIC-5-PROFILE", status: "pending" });
const bugs = state.getOpenBugs("EPIC-5-PROFILE");

// Update state
state.updateTask("5.1.1", { status: "complete", completed_at: "2026-01-24" });
state.createBug({ id: "BUG-5.1.2", severity: 3, title: "Issue description" });

// Session management
state.startSession("EPIC-5-PROFILE", "epic-5-profile");
state.recordTaskCompletion({ task_id: "5.1.1", tokens: 3000, turns: 4 });
state.endSession(60); // duration in minutes

// Search learnings
const results = state.searchLearnings("dark mode");
const testingLearnings = state.getLearningsByCategory("testing");
const expoLearnings = state.getLearningsByTag("expo");

// Generic query (for multi-agent use)
const completedTasks = state.query("tasks", { status: "complete", type: "UI" });
```

## Command Reference

Commands use a hybrid format:

- **JSON Schema** (`core/commands/schemas/*.json`): Defines inputs, outputs, state changes
- **Instructions** (`core/commands/instructions/*.md`): Detailed execution steps

| Command             | Purpose                      | Schema                         |
| ------------------- | ---------------------------- | ------------------------------ |
| `/start-epic`       | Begin epic with branch setup | `start-epic.schema.json`       |
| `/next-task`        | Continue to next task        | `next-task.schema.json`        |
| `/complete-task`    | Commit with code review      | `complete-task.schema.json`    |
| `/end-session`      | Archive and aggregate        | `end-session.schema.json`      |
| `/add-bug`          | Log a bug                    | `add-bug.schema.json`          |
| `/fix-bug`          | Start fixing bugs            | `fix-bug.schema.json`          |
| `/agent-dispatch`   | Launch specialized agent     | `agent-dispatch.schema.json`   |
| `/research-tech`    | Research technology          | `research-tech.schema.json`    |
| `/spec-feature`     | Create feature spec          | `spec-feature.schema.json`     |
| `/create-epic`      | Convert spec to epic         | `create-epic.schema.json`      |
| `/refactor-check`   | Scan for quality issues      | `refactor-check.schema.json`   |
| `/improve-workflow` | Analyze and improve          | `improve-workflow.schema.json` |

## Context-Efficient Reading

**Session Start:** Read only `state/project.json` (~30 lines of JSON)

**By Task Type:**

- UI: `project/standards/components.md`, `project/standards/styling.md`
- API: `project/standards/api-patterns.md`
- Test: `project/standards/testing.md`
- DB: `project/reference/API-PATTERNS.md`

**When Stuck:** Query `state/learnings-index.json` by tag or category, then read specific learning file

## Workflows

| Workflow          | Guide                                                  | When to Use            |
| ----------------- | ------------------------------------------------------ | ---------------------- |
| **Continue Work** | `/start-epic` → `/next-task` (repeat) → `/end-session` | Daily development      |
| **Bug Fixing**    | `/add-bug` → `/start-epic N --bugs` → `/fix-bug`       | Dedicated bug sessions |
| **New Feature**   | `/research-tech` → `/spec-feature` → `/create-epic`    | Planning from scratch  |
| **Revise Epic**   | `guides/workflows/epic-revision-workflow.md`           | Restructure epic       |

## Migration from v2.x

If you have existing markdown state files:

1. The JSON state files contain migrated data from:
   - `status/CURRENT.md` → `state/project.json`
   - `meta/session/CURRENT.md` → `state/session.json`
   - `meta/metrics/**/*.md` → `state/metrics.json`
   - All `TASKS.md` files → `state/tasks.json`
   - All `BUGS.md` files → `state/bugs.json`

2. Original markdown files can be removed after verifying the migration

3. Commands now reference JSON state instead of markdown tables

## Multi-Agent Integration

The JSON state format enables:

- **Fast queries**: Filter tasks by epic, status, type, size
- **Schema validation**: All state files have JSON Schema definitions
- **Consistent access**: State manager utility works across agents
- **Searchable learnings**: Index by category, tag, or text search

Example queries agents can perform:

```typescript
// Get all pending UI tasks for current epic
state.getTasks({ epic_id: "EPIC-5-PROFILE", status: "pending", type: "UI" });

// Get bugs by severity
state.getBugs({ severity: [1, 2] }); // Critical and High

// Find relevant learnings
state.searchLearnings("validation"); // Text search
state.getLearningsByTag("zod"); // Tag lookup
```
