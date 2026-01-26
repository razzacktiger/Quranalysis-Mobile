---
description: Start a new epic with branch setup and first task identification
---

# Start Epic

Begin work on an epic with proper setup and context loading.

## Input
$ARGUMENTS = epic identifier (e.g., "4-ai-chat")

**Optional flags:**
- `--bugs` or `bugs` - Start bug-fixing mode instead of tasks
- `--severity N` - Filter bugs by severity (1-4) in bug mode

## Step 1: Read Current State
Read `state/project.json` to understand current progress.

## Step 2: Read Epic File
Read `epics/active/EPIC-$ARGUMENTS/README.md` for epic overview.
If not found, check `epics/archive/` and offer to reopen.

## Step 3: Check for Known Issues
Read relevant learnings based on epic type:
- If API work: `learnings/typescript.md`, `learnings/auth.md`
- If UI work: `learnings/react-native.md`, `learnings/forms.md`
- If testing: `learnings/testing.md`
- Always check: `learnings/common-mistakes.md`

Or use: Query `state/learnings-index.json` by tags for relevant entries.

## Step 4: Create Branch
```bash
git checkout main
git pull origin main
git checkout -b epic-$ARGUMENTS
```

## Step 5: Identify First Task (or Bug)

### Normal Mode (Tasks):
Query `state/tasks.json` for first pending task in this epic:
```typescript
// Filter: epic_id matches, status = 'pending', order by feature_id then id
```

### Bug Mode (`--bugs` flag):
Query `state/bugs.json` for open bugs in this epic:
```typescript
// Filter: epic_id matches, status = 'open', order by severity (1 first)
```

Display bug summary:
```
## EPIC-X Bug Summary

| Feature | Open Bugs | Blocking | Non-blocking |
|---------|-----------|----------|--------------|
| 4.1 | 2 | 1 | 1 |
| 4.2 | 3 | 2 | 1 |

Total: 5 open bugs (3 blocking)

Highest priority: BUG-4.2.1 (Critical) - Modal crash
```

## Step 6: Plan Agent Usage
Review tasks in `state/tasks.json` for this epic and note:
- Tasks with type="UI" -> will use /frontend-design
- Tasks with TDD flag -> write tests first
- Tasks with size="L" or "XL" -> consider code-architect
- All M+ tasks -> use code-reviewer at /complete-task

Report: "This epic has:
- X UI tasks (will use frontend-design)
- Y TDD tasks (test-first)
- Z complex tasks (may need architect)"

## Step 7: Initialize Session Tracking
Update `state/session.json`:
```json
{
  "started": "{ISO timestamp}",
  "epic_id": "EPIC-$ARGUMENTS",
  "branch": "epic-$ARGUMENTS",
  "active_task": {
    "id": "{first task id}",
    "name": "{task name}",
    "type": "{UI/API/Test}",
    "size": "{S/M/L/XL}",
    "started_at": "{ISO timestamp}"
  },
  "active_agents": [],
  "completed_tasks": [],
  "totals": {
    "tasks_completed": 0,
    "tokens": 0,
    "context_percent": 0,
    "tool_calls": 0
  },
  "files_read": [],
  "notes": []
}
```

## Step 8: Update Project State
Update `state/project.json`:
```json
{
  "active": {
    "epic_id": "EPIC-$ARGUMENTS",
    "feature_id": "{first feature}",
    "task_id": "{first task}",
    "branch": "epic-$ARGUMENTS",
    "session_started": "{today's date}"
  }
}
```

## Step 9: Report

### Normal Mode:
Tell the user:
- Epic name and goal
- Branch created
- First task ID and brief description
- Agent usage plan
- Any relevant learnings found
- **Bug summary:** "X open bugs across features (Y blocking)" if any bugs exist

Then ask: "Ready to begin Task X.X.X?"

### Bug Mode:
Tell the user:
- Epic name
- Branch status
- Bug summary table (by feature)
- Highest priority bug details
- Files involved

Then ask: "Ready to fix BUG-X.X.X?"

## Standards
Follow `.claude/standards/` for all implementation.
Load only relevant standard files based on task type.

## Example Usage

### Normal Mode
```
User: /start-epic 4-ai-chat
Agent: *Creates branch, reads epic, initializes session*
Agent: "Starting EPIC-4: AI Chatbot
       Branch: epic-4-ai-chat
       First task: 4.1.1 - Research & Setup Gemini API Client

       This epic has:
       - 5 UI tasks (will use frontend-design)
       - 0 TDD tasks
       - 2 research tasks (4.1.1, 4.3.1)

       Bug summary: 3 open bugs (2 blocking)

       Ready to begin Task 4.1.1?"
```

### Bug Mode
```
User: /start-epic 4-ai-chat --bugs
Agent: *Reads epic, queries state/bugs.json*
Agent: "EPIC-4: AI Chatbot - Bug Fixing Mode

       | Feature | Open | Blocking |
       |---------|------|----------|
       | 4.1 | 1 | 0 |
       | 4.2 | 2 | 2 |

       Total: 3 open bugs (2 blocking)

       Highest priority:
       BUG-4.2.1 (Critical): Modal crash on rapid close
       Files: components/ai/ChatModal.tsx

       Ready to fix BUG-4.2.1?"
```
