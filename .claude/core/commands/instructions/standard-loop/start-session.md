---
description: Start a new development session with automatic stale session archiving
---

# Start Session

Initialize a new Claude Code development session with automatic cleanup of stale data.

**Use this when:** Starting work after Claude Code closed/crashed, or beginning a new day's work.

## Step 1: Check for Stale Session

Read `state/session.json` and check:
1. **started** date - is it a different day than today?
2. **completed_tasks** array - does it have entries?
3. **active_task** - was there an unfinished task?

### If Session is Fresh (same day, no completed tasks)
```
Session is fresh (started today with no prior tasks).
Ready to continue.
```
Skip to Step 3.

### If Session is Stale
```
⚠️ Found stale session from {date}:
- Tasks completed: {count}
- Last active task: {task_id or "None (completed)"}
- Tokens used: {running total}

Archiving to: state/archive/session-{YYYY-MM-DD}-{N}.json
```

## Step 2: Archive and Reset (If Stale)

### 2a. Archive the Session
Copy `state/session.json` to `state/archive/session-{date}-{N}.json`

If there's already a file for that date (multiple sessions same day), use:
`session-{date}-{N}.json` where N is the next available number.

### 2b. Reset session.json
Write a fresh session:

```json
{
  "$schema": "../schemas/session.schema.json",
  "started": "{today ISO timestamp}",
  "epic_id": "{from state/project.json active.epic_id}",
  "branch": "{from git branch or state/project.json}",
  "active_task": null,
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

## Step 3: Show Session Status

Read `state/project.json` and display:

```
📋 Session Ready

Epic: EPIC-{N}-{NAME}
Feature: {current feature}
Branch: {branch name}

Progress: {completed}/{total} tasks
Next up: Task {X.X.X} - {title}

Blocking bugs: {count or "None"}
```

Query `state/tasks.json` for next pending task.
Query `state/bugs.json` for blocking bugs (severity 1-2, status open).

## Step 4: Offer Next Actions

```
What would you like to do?

1. `/next-task` - Continue with the next task
2. `/fix-bug {feature}` - Fix blocking bugs first
3. `/research-tech {topic}` - Research before implementing
4. `/refactor-check` - Scan for code quality issues

Or describe what you want to work on.
```

## Example Usage

```
User: /start-session
Agent: ⚠️ Found stale session from 2026-01-22:
       - Tasks completed: 4
       - Last active task: 4.3.4 (completed)
       - Tokens used: ~31k

       Archiving to: state/archive/session-2026-01-22-1.json
       Session reset for today.

       📋 Session Ready

       Epic: EPIC-4-AI-CHAT
       Feature: 4.3 - Voice Input
       Branch: epic-4-ai-chat

       Progress: 13/13 tasks (Epic complete!)
       Next up: Start EPIC-5 or merge to main

       Blocking bugs: None

       What would you like to do?
       1. `/start-epic 5` - Begin EPIC-5: Profile
       2. `/next-task` - (No more tasks in EPIC-4)
       3. Merge epic-4-ai-chat to main
```

## Notes

- This command is idempotent - running it multiple times on the same day just shows status
- Archived sessions preserve the full context for retrospectives
- Token counts help track efficiency over time
- Always run this at the start of a new coding session
