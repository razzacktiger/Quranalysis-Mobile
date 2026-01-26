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

Read current `state/session.json` and archive it:

```bash
# Create archive directory if needed
mkdir -p .claude/state/archive

# Generate filename: session-YYYY-MM-DD-N.json
DATE=$(date +%Y-%m-%d)
N=1
while [ -f ".claude/state/archive/session-${DATE}-${N}.json" ]; do
  N=$((N+1))
done
ARCHIVE_FILE=".claude/state/archive/session-${DATE}-${N}.json"

# Copy current to archive
cp .claude/state/session.json "$ARCHIVE_FILE"
```

## Step 4: Update Aggregate Metrics

Update `state/metrics.json`:

### Add Session to Recent
Add to `sessions.recent` array (keep last 20):
```json
{
  "date": "{today}",
  "epic_id": "{from session}",
  "tasks_completed": {count},
  "tokens": {total},
  "context_percent": {peak},
  "turns": {sum of turns},
  "duration_minutes": {ask user or estimate},
  "notes": "{session highlights}"
}
```

### Recalculate Averages
Update `sessions.averages`:
```json
{
  "tasks_per_session": {recalculate from recent},
  "tokens_per_session": {recalculate},
  "tokens_per_task": {recalculate}
}
```

## Step 5: Check Signals

Auto-detect red flags:

### Red Flag Checks
- [ ] Context >70% before task 3?
- [ ] Same error 3+ times in session?
- [ ] Revision rate >1/task?
- [ ] Tasks taking >20k tokens average?

If red flags detected:
- Add to `state/metrics.json` `signals.red` array

### Yellow Flag Checks
- [ ] Context >50% at session end?
- [ ] Any task >15k tokens?
- [ ] Any revision requests?

If yellow flags:
- Add to `state/metrics.json` `signals.yellow` array

## Step 6: Update Project State

Update `state/project.json`:
- Update `progress` for the epic worked on
- Clear `active.task_id` if no work in progress
- Update any blockers resolved

## Step 7: Calculate Session Stats

Generate summary from `state/session.json`:
```
Session Summary:
- Tasks completed: X
- Total tokens: ~Xk
- Avg tokens/task: ~Xk
- Peak context: X%
- Bugs caught: X (at: {stage})
- Revisions: X
```

## Step 8: Push Changes (Optional)
Ask user if they want to push:
```bash
git push origin epic-X-name
```

## Step 9: Generate Session Summary

Provide summary:
```markdown
## Session Complete

**Epic:** EPIC-X-NAME
**Branch:** epic-x-name
**Archived To:** state/archive/session-YYYY-MM-DD-N.json
**Tasks Completed:** X (task IDs)
**Bugs Fixed:** X (bug IDs, if any)
**Progress:** X/Y tasks (Z%)

**Metrics:**
- Tokens: ~Xk
- Avg/task: ~Xk
- Bugs caught: X

**Signals:**
- (any flags detected)

**State Files Updated:**
- state/archive/session-{date}-{n}.json (archived)
- state/metrics.json (aggregated)
- state/project.json (progress)

**Next Task:** X.X.X - Description
**Blockers:** None / Description

Run `/clear` then `/next-task` or `/start-epic` to continue.
```

## Step 10: Reset Session State

Reset `state/session.json` for next session:
```json
{
  "$schema": "../schemas/session.schema.json",
  "started": null,
  "epic_id": null,
  "branch": null,
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

## Step 11: Remind About Context
Tell the user:
- "Session archived to `state/archive/{filename}`"
- "Run `/clear` before starting next session"
- "Next session: `/start-epic X` or `/next-task`"

## Example Full Report
```
## Session Complete

**Epic:** EPIC-4-AI-CHAT
**Branch:** epic-4-ai-chat
**Archived To:** state/archive/session-2026-01-24-1.json
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
