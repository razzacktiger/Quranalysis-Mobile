---
description: End development session with proper state preservation
---

# End Session

End a development session with metrics capture and state preservation.

## Step 1: Check Uncommitted Work
```bash
git status
```

If there are uncommitted changes:
- Ask user if they want to commit or stash
- If commit: follow /complete-task flow
- If stash: `git stash push -m "WIP: task X.X.X description"`

## Step 2: Capture Friction
Ask: "Any workflow friction this session?"

If yes:
- Add to `meta/IMPROVEMENT-BACKLOG.md`
- Note the issue and potential solution

If no: Continue

## Step 3: Archive Session
Archive the current session before aggregating:

```bash
# Create archive directory if needed
mkdir -p .claude/meta/session/archive

# Generate filename: YYYY-MM-DD-N.md (N = session number that day)
DATE=$(date +%Y-%m-%d)
N=1
while [ -f ".claude/meta/session/archive/${DATE}-${N}.md" ]; do
  N=$((N+1))
done
ARCHIVE_FILE=".claude/meta/session/archive/${DATE}-${N}.md"

# Copy current to archive
cp .claude/meta/session/CURRENT.md "$ARCHIVE_FILE"
```

Add archive header to the file:
```markdown
# Archived Session: {DATE}-{N}
**Archived:** {timestamp}
**Original Epic:** {epic from CURRENT.md}
```

## Step 4: Aggregate Metrics
From the archived session, aggregate to metrics files:

### Token Metrics
Add all session tasks to `meta/metrics/tokens/recent-tasks.md`.

### Efficiency Metrics
Add session summary to `meta/metrics/efficiency/sessions.md`:
```
| {date} | {epic} | {tasks} | {tokens} | {context%} | {turns} | {duration} | {notes} |
```

### Tool Metrics
Update `meta/metrics/tools/frequency.md`:
- Add tool call counts from session

### Quality Metrics
If bugs were caught:
- Update `meta/metrics/quality/bugs-by-stage.md`
- Update `meta/metrics/quality/bug-categories.md`

## Step 4: Check Signals
Auto-detect red flags:

### Red Flag Checks
- [ ] Context >70% before task 3?
- [ ] Same error 3+ times in session?
- [ ] Revision rate >1/task?
- [ ] Tasks taking >20k tokens average?

If red flags detected:
- Add to `meta/metrics/signals/red.md`
- Note the pattern and recommended action

### Yellow Flag Checks
- [ ] Context >50% at session end?
- [ ] Any task >15k tokens?
- [ ] Any revision requests?

If yellow flags:
- Add to `meta/metrics/signals/yellow.md`

## Step 5: Update Status
Update `status/CURRENT.md` with:
- Tasks completed this session
- Current progress
- Any blockers
- Next task

## Step 6: Calculate Session Stats
```
Session Summary:
- Tasks completed: X
- Total tokens: ~Xk
- Avg tokens/task: ~Xk
- Peak context: X%
- Bugs caught: X (at: {stage})
- Revisions: X
```

## Step 7: Push Changes (Optional)
Ask user if they want to push:
```bash
git push origin epic-X-name
```

## Step 8: Generate Session Summary
Provide summary:
```markdown
## Session Complete

**Epic:** EPIC-X-NAME
**Branch:** epic-x-name
**Archived To:** meta/session/archive/YYYY-MM-DD-N.md
**Tasks Completed:** X (task IDs)
**Bugs Fixed:** X (bug IDs, if any)
**Progress:** X/Y tasks (Z%)

**Metrics:**
- Tokens: ~Xk
- Avg/task: ~Xk
- Bugs caught: X

**Signals:**
- (any flags detected)

**Files Updated:**
- meta/session/archive/YYYY-MM-DD-N.md (archived)
- meta/metrics/efficiency/sessions.md (aggregated)
- status/CURRENT.md (progress)

**Next Task:** X.X.X - Description
**Blockers:** None / Description

Run `/clear` then `/next-task` or `/start-epic` to continue.
```

## Step 9: Reset Session File
Reset `meta/session/CURRENT.md` for next session:

```markdown
# Current Session

**Started:** (will be set by /start-epic or /next-task)
**Epic:** -
**Branch:** -

## Active Task
(none)

## This Session (Running)

| Task | Tokens | Turns | Tools | Agent | Bugs Caught |
|------|--------|-------|-------|-------|-------------|

## Running Totals
- Tasks: 0 complete
- Tokens: 0
- Tool calls: 0

## Files Read This Session
(none yet)

## Notes
(fresh session)
```

## Step 10: Remind About Context
Tell the user:
- "Session archived to `meta/session/archive/{filename}`"
- "Run `/clear` before starting next session"
- "Next session: `/start-epic X` or `/next-task`"

## Metrics Templates

### Session Row (efficiency/sessions.md)
```
| 01-20 | 4 | 5 | 45k | 62% | 12 | 2h | Good session |
```

### Red Flag Entry (signals/red.md)
```
| Context >70% early | Task 2 hit 72% | High | Reduce initial loading |
```

## Example Full Report
```
## Session Complete

**Epic:** EPIC-4-AI-CHAT
**Branch:** epic-4-ai-chat
**Tasks Completed:** 3 (4.1.1, 4.1.2, 4.1.3)
**Progress:** 3/13 tasks (23%)

**Metrics:**
- Tokens: ~38k
- Avg/task: ~12.7k
- Bugs caught: 1 (code-reviewer)

**Signals:**
- Yellow: Task 4.1.2 took 18k (L size, expected 15-25k)

**Next Task:** 4.1.4 - Create useAIChat Hook
**Blockers:** None

Run `/clear` then `/next-task` to continue.
```
