# Command System

Quick reference for all workflow commands.

## Standard Loop Commands

| Command         | Description             | Schema                                                                   | Instructions                                                                                 |
| --------------- | ----------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| /start-session  | Initialize session      | [schemas/start-session.schema.json](schemas/start-session.schema.json)   | [instructions/standard-loop/start-session.md](instructions/standard-loop/start-session.md)   |
| /next-task      | Get next pending task   | [schemas/next-task.schema.json](schemas/next-task.schema.json)           | [instructions/standard-loop/next-task.md](instructions/standard-loop/next-task.md)           |
| /complete-task  | Commit work with review | [schemas/complete-task.schema.json](schemas/complete-task.schema.json)   | [instructions/standard-loop/complete-task.md](instructions/standard-loop/complete-task.md)   |
| /add-bug        | Log a new bug           | [schemas/add-bug.schema.json](schemas/add-bug.schema.json)               | [instructions/standard-loop/add-bug.md](instructions/standard-loop/add-bug.md)               |
| /fix-bug        | Fix a logged bug        | [schemas/fix-bug.schema.json](schemas/fix-bug.schema.json)               | [instructions/standard-loop/fix-bug.md](instructions/standard-loop/fix-bug.md)               |
| /create-epic    | Create new epic         | [schemas/create-epic.schema.json](schemas/create-epic.schema.json)       | [instructions/standard-loop/create-epic.md](instructions/standard-loop/create-epic.md)       |
| /start-epic     | Begin epic work         | [schemas/start-epic.schema.json](schemas/start-epic.schema.json)         | [instructions/standard-loop/start-epic.md](instructions/standard-loop/start-epic.md)         |
| /agent-dispatch | Dispatch agent for task | [schemas/agent-dispatch.schema.json](schemas/agent-dispatch.schema.json) | [instructions/standard-loop/agent-dispatch.md](instructions/standard-loop/agent-dispatch.md) |
| /agent-complete | Handle agent completion | [schemas/agent-complete.schema.json](schemas/agent-complete.schema.json) | [instructions/standard-loop/agent-complete.md](instructions/standard-loop/agent-complete.md) |
| /refactor-check | Check code quality      | [schemas/refactor-check.schema.json](schemas/refactor-check.schema.json) | [instructions/standard-loop/refactor-check.md](instructions/standard-loop/refactor-check.md) |
| /research-tech  | Research technology     | [schemas/research-tech.schema.json](schemas/research-tech.schema.json)   | [instructions/standard-loop/research-tech.md](instructions/standard-loop/research-tech.md)   |
| /spec-feature   | Specify a feature       | [schemas/spec-feature.schema.json](schemas/spec-feature.schema.json)     | [instructions/standard-loop/spec-feature.md](instructions/standard-loop/spec-feature.md)     |

## Workflow Commands

| Command           | Description             | Schema                                                                       | Instructions                                                                             |
| ----------------- | ----------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| /end-session      | End current session     | [schemas/end-session.schema.json](schemas/end-session.schema.json)           | [instructions/workflows/end-session.md](instructions/workflows/end-session.md)           |
| /improve-workflow | Improve workflow system | [schemas/improve-workflow.schema.json](schemas/improve-workflow.schema.json) | [instructions/workflows/improve-workflow.md](instructions/workflows/improve-workflow.md) |
| /run-workflow     | Run a workflow          | [schemas/run-workflow.schema.json](schemas/run-workflow.schema.json)         | [instructions/workflows/run-workflow.md](instructions/workflows/run-workflow.md)         |
| /sync-docs        | Sync documentation      | [schemas/sync-docs.schema.json](schemas/sync-docs.schema.json)               | [instructions/workflows/sync-docs.md](instructions/workflows/sync-docs.md)               |

## Architecture

```
commands/
├── README.md              # This file - command index
├── schemas/               # JSON Schema definitions with x-workflow metadata
│   └── *.schema.json      # Command parameter definitions
├── instructions/          # Step-by-step execution guides
│   ├── standard-loop/     # Core development commands
│   └── workflows/         # Meta/workflow commands
└── standard-loop/         # Legacy instruction files (deprecated)
```

### Schema Format

All command schemas follow JSON Schema draft-07 with a custom `x-workflow` extension:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "command:<name>",
  "title": "<name>",
  "description": "...",
  "type": "object",
  "properties": { ... },
  "required": [...],
  "x-workflow": {
    "aliases": ["/command-name"],
    "requires": { "params": [], "optional_params": [], "state": [] },
    "state_reads": ["state/*.json"],
    "state_writes": [{ "file": "...", "action": "...", "fields": [...] }],
    "instructions": "commands/instructions/.../*.md"
  }
}
```

### State Files

All runtime data is stored in `../../state/*.json`:

| File                   | Purpose                                      |
| ---------------------- | -------------------------------------------- |
| `project.json`         | Active work context, blockers, epic progress |
| `session.json`         | Current session tracking                     |
| `tasks.json`           | Task definitions and status                  |
| `bugs.json`            | Bug tracking                                 |
| `metrics.json`         | Aggregated metrics and signals               |
| `learnings-index.json` | Index of captured learnings                  |

### CLI Access

Use the state CLI for programmatic access:

```bash
# Task operations
node core/lib/state-cli.js get-task <id>
node core/lib/state-cli.js list-tasks [--epic EPIC-ID] [--status pending]

# Session operations
node core/lib/state-cli.js start-session <epic-id> <branch>
node core/lib/state-cli.js end-session

# View regeneration
node core/lib/state-cli.js regenerate-views
```
