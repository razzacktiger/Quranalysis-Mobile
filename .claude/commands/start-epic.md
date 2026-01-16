---
description: Start a new epic with branch setup and first task identification
---

# Start Epic

You are starting a new epic. Follow these steps exactly:

## Step 1: Read Current State
Read `.claude/STATUS.md` to understand current progress.

## Step 2: Read Epic File
Read `.claude/epics/EPIC-$ARGUMENTS.md` for full task details.

## Step 3: Check for Known Issues
Read `.claude/LEARNINGS.md` and check if there are relevant patterns for this epic type.

## Step 4: Create Branch
```bash
git checkout main
git pull origin main
git checkout -b epic-$ARGUMENTS
```

## Step 5: Identify First Task
Find the first incomplete task in the epic.

## Step 6: Report
Tell the user:
- Epic name and goal
- Branch created
- First task ID and brief description
- Any relevant learnings found

Then ask: "Ready to begin Task X.X.X?"

## Standards
Follow `.claude/CODE-STANDARDS.md` for all implementation.

## Example Usage
User types: `/start-epic 1-auth`
You read EPIC-1-AUTH.md, create branch epic-1-auth, identify Task 1.1.1
