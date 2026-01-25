---
description: Start a new development session with automatic stale session archiving
---

# Start Session

Initialize a new Claude Code development session with automatic cleanup of stale data.

**Use this when:** Starting work after Claude Code closed/crashed, or beginning a new day's work.

## Step 1: Check for Stale Session

Read `meta/session/CURRENT.md` and check:
1. **Started** date - is it a different day than today?
2. **This Session** table - does it have completed tasks?
3. **Active Task** - was there an unfinished task?

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

Archiving to: meta/session/archive/{YYYY-MM-DD}-session.md
```

## Step 2: Archive and Reset (If Stale)

### 2a. Archive the Session
Copy `meta/session/CURRENT.md` to `meta/session/archive/{date}-session.md`

If there's already a file for that date (multiple sessions same day), use:
`{date}-{N}.md` where N is the next available number (matching /end-session format).

### 2b. Reset CURRENT.md
Write a fresh session file:

```markdown
# Current Session

**Started:** {today's date: YYYY-MM-DD}
**Epic:** {from status/CURRENT.md}
**Branch:** {from git branch or status}

## Active Task
- **ID:** None (ready for next task)
- **Name:** -
- **Type:** -
- **Size:** -
- **Started:** -

## This Session (Running)

| Task | Tokens | Turns | Tools | Agent | Bugs Caught |
|------|--------|-------|-------|-------|-------------|

## Running Totals
- Tasks: 0 complete, 0 in progress
- Tokens: ~0k
- Context: ~0%
- Tool calls: 0

## Files Read This Session
(list files as you read them)

## Notes
(add significant learnings or context)
```

## Step 3: Show Session Status

Read `status/CURRENT.md` and display:

```
📋 Session Ready

Epic: EPIC-{N}-{NAME}
Feature: {current feature}
Branch: {branch name}

Progress: {completed}/{total} tasks
Next up: Task {X.X.X} - {title}

Blocking bugs: {count or "None"}
```

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

       Archiving to: meta/session/archive/2026-01-22-1.md
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
