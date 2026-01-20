---
description: Start a new epic with branch setup and first task identification
---

# Start Epic

Begin work on an epic with proper setup and context loading.

## Input
$ARGUMENTS = epic identifier (e.g., "4-ai-chat")

## Step 1: Read Current State
Read `status/CURRENT.md` to understand current progress.

## Step 2: Read Epic File
Read `epics/active/EPIC-$ARGUMENTS/README.md` for epic overview.
If not found, check `epics/archive/` and offer to reopen.

## Step 3: Check for Known Issues
Read relevant learnings based on epic type:
- If API work: `learnings/typescript.md`, `learnings/auth.md`
- If UI work: `learnings/react-native.md`, `learnings/forms.md`
- If testing: `learnings/testing.md`
- Always check: `learnings/common-mistakes.md`

## Step 4: Create Branch
```bash
git checkout main
git pull origin main
git checkout -b epic-$ARGUMENTS
```

## Step 5: Identify First Task
Find the first incomplete task in the epic's feature files.
Read the relevant FEATURE-*.md file.

## Step 6: Plan Agent Usage
Review all tasks in epic and note:
- Tasks marked "UI" -> will use /frontend-design
- Tasks marked "TDD" -> write tests first
- Tasks sized "L/XL" -> consider code-architect
- All M+ tasks -> use code-reviewer at /complete-task

Report: "This epic has:
- X UI tasks (will use frontend-design)
- Y TDD tasks (test-first)
- Z complex tasks (may need architect)"

## Step 7: Initialize Session Tracking
Create/reset `meta/session/CURRENT.md`:
```markdown
# Current Session

**Started:** {timestamp}
**Epic:** EPIC-$ARGUMENTS
**Branch:** epic-$ARGUMENTS

## Active Task
- **ID:** {first task}
- **Name:** {task name}
- **Type:** {UI/API/DB/Test}
- **Size:** {S/M/L}
- **Started:** {timestamp}

## This Session (Running)

| Task | Tokens | Turns | Tools | Agent | Bugs Caught |
|------|--------|-------|-------|-------|-------------|

## Running Totals
- Tasks: 0 complete, 1 in progress
- Tokens: 0 (input: 0, output: 0)
- Context: (check with /context)
- Tool calls: 0

## Files Read This Session
(track as you read files)

## Notes
```

## Step 8: Update Status
Update `status/CURRENT.md`:
- Set active epic
- Set current task
- Set branch name

## Step 9: Report
Tell the user:
- Epic name and goal
- Branch created
- First task ID and brief description
- Agent usage plan
- Any relevant learnings found

Then ask: "Ready to begin Task X.X.X?"

## Standards
Follow `.claude/standards/` for all implementation.
Load only relevant standard files based on task type.

## Example Usage
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

       Ready to begin Task 4.1.1?"
```
