---
description: End development session with proper state preservation
---

# End Session

You are ending a development session. Follow these steps to preserve state:

## Step 1: Check Uncommitted Work
```bash
git status
```

If there are uncommitted changes:
- Ask user if they want to commit or stash
- If commit: follow complete-task flow
- If stash: `git stash push -m "WIP: task X.X.X description"`

## Step 2: Update STATUS.md
Update `.claude/STATUS.md` with:

### Current Sprint Tasks
- Update status of all tasks worked on
- Add accurate token estimates for completed tasks

### Session Metrics
```markdown
### Completed This Session
- Tasks: X
- Total Tokens: ~XXXX
- Files Created: X
- Files Modified: X
```

### Notes
Add any important context for next session:
- Current task in progress
- Any blockers encountered
- Decisions made
- Next steps

## Step 3: Push Changes (Optional)
Ask user if they want to push:
```bash
git push origin epic-X-name
```

## Step 4: Generate Session Summary
Provide summary:
- Tasks completed this session
- Current epic progress (X/Y tasks)
- Any blockers or notes
- Recommended next action

## Step 5: Remind About Context
Tell the user:
- "Run `/clear` before starting next session"
- "Next session: `/start-epic X` or `/next-task`"

## Example Session Summary

```
## Session Complete

**Epic:** EPIC-1-AUTH
**Branch:** epic-1-auth
**Tasks Completed:** 3 (1.1.1, 1.1.2, 1.1.3)
**Progress:** 3/8 tasks (37%)

**Next Task:** 1.2.1 - Login Screen UI
**Blockers:** None

Run `/clear` then `/next-task` to continue.
```

