---
description: Create a new epic from a feature specification
---

# /create-epic

Convert a feature specification into a structured epic with tasks.

## Parameters

| Param | Required | Description |
|-------|----------|-------------|
| `spec_file` | Yes | Path to the spec file (e.g., "specs/RESEARCH-voice-input.md") |
| `epic_number` | Yes | Epic number to assign |

## State Operations

**Reads:**
- `state/project.json` - Existing epics
- Spec file content

**Writes:**
- `state/project.json` → Register new epic
- `state/tasks.json` → Add all tasks from epic
- Create epic folder structure in `project/epics/active/`

## Output Structure

```
project/epics/active/EPIC-{N}-{NAME}/
├── README.md
└── features/
    └── {N}.{M}-{feature-name}/
        └── TASKS.md
```

## Execution

**Read and follow the full instructions:**
→ `core/commands/instructions/standard-loop/create-epic.md`

**Schema reference:**
→ `core/commands/schemas/create-epic.schema.json`
