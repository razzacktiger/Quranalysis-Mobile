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

## Step 6: Create Epic Structure

### If "new N-name":
Create `epics/active/EPIC-N-NAME/`:
- README.md (epic overview)

**IMPORTANT - Canonical Structure:**
Use the subdirectory pattern (like EPIC-4):
```
EPIC-N-NAME/
└── README.md           # Epic overview, feature table
```

Tasks are stored in `state/tasks.json`, not in separate TASKS.md files.

### Add tasks to state/tasks.json
For each task in the epic:
```json
{
  "id": "N.X.Y",
  "epic_id": "EPIC-N-NAME",
  "feature_id": "N.X",
  "name": "{task name}",
  "size": "S|M|L|XL",
  "type": "UI|API|Setup|Test",
  "status": "pending",
  "files": ["{files to create/modify}"],
  "deps": ["{dependency task ids}"],
  "acceptance_criteria": ["{criteria}"]
}
```

## Step 7: Update Project State
Update `state/project.json`:

Add to `progress`:
```json
{
  "EPIC-N-NAME": {
    "status": "active",
    "completed": 0,
    "total": {task count}
  }
}
```

## Step 8: Record Metrics
Update `state/session.json` notes with epic creation.

## Step 9: Update Cross-References

### Update REQUIREMENTS.md
Add or update the epic entry in the Epics table:

```markdown
| EPIC-N: Name | Not Started | [epics/active/EPIC-N-NAME/](./epics/active/EPIC-N-NAME/) |
```

### Update .claude/README.md (if needed)
If this is a new epic type or changes the directory structure, verify the Directory Index is accurate.

## Step 10: Report
Show summary:
- "Epic created with X features, Y tasks"
- "Tasks added to state/tasks.json"
- "state/project.json updated"
- "REQUIREMENTS.md updated with epic link"
- "Ready for /start-epic N-name?"

## Epic README Template
```markdown
# EPIC-N: {Name}

**Status:** Not Started
**Priority:** {High/Medium/Low}

## Goal
{1-2 sentences}

## Features

| ID | Feature | Status | Tasks |
|----|---------|--------|-------|
| N.1 | {name} | Not Started | X |
| N.2 | {name} | Not Started | X |

## Dependencies
- Requires: {epics}
- Research: {link if applicable}

## Definition of Done
- [ ] All features complete
- [ ] E2E tests pass
- [ ] Human QA approved
```

Note: Task details are stored in `state/tasks.json` and can be queried:
```typescript
state.getTasks({ epic_id: 'EPIC-N-NAME', feature_id: 'N.1' });
```

## Example Usage
```
User: /create-epic new 6-notifications
Agent: *Creates epics/active/EPIC-6-NOTIFICATIONS/README.md*
Agent: *Adds tasks to state/tasks.json*
Agent: *Updates state/project.json*
```
