---
description: Convert feature spec into epic with features and tasks
---

# Create Epic

Convert a feature specification into an epic with features and tasks.

## Input
$ARGUMENTS = "new N-name" OR "add-to EPIC-N" OR "reopen EPIC-N"

## Step 1: Read Spec
Read the relevant specs/FEATURE-{name}.md file.
If no spec exists, suggest /spec-feature first.

## Step 2: Design Architecture
Launch code-architect agent:
- Provide feature spec context
- Existing patterns to follow
- Request task breakdown

## Step 3: Group into Features
Organize tasks into logical features (3-7 tasks each).
Each feature should be:
- Cohesive (related tasks)
- Independently testable
- Has clear completion criteria

## Step 4: Size Tasks
For each task, assign size:
- **S:** Single file, straightforward
- **M:** 2-3 files, moderate complexity
- **L:** Multiple files, complex logic
- **XL:** Should be split further

## Step 5: Identify Markers
For each task, note:
- TDD required? (logic/validation)
- UI task? (consider /frontend-design)
- Dependencies on other tasks

## Step 6: Create/Update Epic

### If "new N-name":
Create `epics/active/EPIC-N-NAME/`:
- README.md (epic overview)
- features/N.1-name/TASKS.md
- features/N.2-name/TASKS.md
- etc.

**IMPORTANT - Canonical Structure:**
Use the subdirectory pattern (like EPIC-4):
```
EPIC-N-NAME/
├── README.md           # Epic overview, feature table
└── features/
    ├── N.1-name/
    │   ├── TASKS.md    # Task list for this feature
    │   └── BUGS.md     # (created by /add-bug if needed)
    └── N.2-name/
        └── TASKS.md
```

Do NOT use flat `FEATURE-N.X.md` files at root or a single root `TASKS.md`.
This structure enables `/start-epic`, `/next-task`, and `/fix-bug` to navigate consistently.

### If "add-to EPIC-N":
Add new FEATURE-N.X-name.md to existing epic folder.
Update README.md feature table.

### If "reopen EPIC-N":
Move from archive/ to active/.
Add new feature file.
Update README.md.

## Step 7: Update Status
Update status/CURRENT.md:
- Set active epic
- Update progress table

## Step 8: Record Metrics
Update meta/session/CURRENT.md

## Step 9: Report
Show summary:
- "Epic created/updated with X features, Y tasks"
- Feature breakdown with task counts
- "Ready for /start-epic N-name?"

## Epic README Template
```markdown
# EPIC-N: {Name}

**Status:** Not Started
**Priority:** {High/Medium/Low}

## Goal
{1-2 sentences}

## Features

| ID | Feature | Status | Tasks | Folder |
|----|---------|--------|-------|--------|
| N.1 | {name} | Not Started | X | [features/N.1-name](./features/N.1-name/) |
| N.2 | {name} | Not Started | X | [features/N.2-name](./features/N.2-name/) |

## Dependencies
- Requires: {epics}
- Research: {link if applicable}

## Definition of Done
- [ ] All features complete
- [ ] E2E tests pass
- [ ] Human QA approved
```

## Feature TASKS.md Template
File: `features/N.X-name/TASKS.md`
```markdown
# Feature N.X: {Name}

## Overview
{description}

## Tasks

| ID | Task | Size | Status | TDD | UI | Notes |
|----|------|------|--------|-----|----|----|
| N.X.1 | {name} | S | Not Started | - | - | - |
| N.X.2 | {name} | M | Not Started | Yes | - | - |

## Acceptance Criteria
- [ ] {criterion}

## Human QA
- [ ] {manual verification}
```

## Example Usage
```
User: /create-epic new 6-notifications
Agent: *Creates epics/active/EPIC-6-NOTIFICATIONS/*
```
