---
description: Complete current task with commit and status update
---

# Complete Task

Complete a task or bug fix after user approval with code review, commit, and metrics.

## Step 0: Detect Task or Bug

Check `state/session.json` to determine if completing:
- **Task:** `active_task.id` has task ID (e.g., "4.2.3")
- **Bug:** `active_task.id` has bug ID (e.g., "BUG-4.2.3")

If completing a bug, follow the bug-specific steps marked with [BUG].

## Step 1: Verify Approval
Confirm the user has approved the implementation.

## Step 2: Code Review (For M/L/XL tasks)
If task size >= M OR task modified >3 files:
1. Launch code-reviewer agent:
   - Check for bugs
   - Check security issues
   - Check adherence to standards/quality-checklist.md
   - Check for common mistakes from learnings/

2. If issues found:
   - Fix them
   - Re-run tests
   - Report fixes made
   - Then proceed

## Step 3: Create Commit

### For Tasks:
```bash
git add -A
git commit -m "feat(epic-X): Task X.X.X - Brief description

- List key changes
- Include files modified

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### [BUG] For Bug Fixes:
```bash
git add -A
git commit -m "fix(epic-X): BUG-X.X.X - Brief description

- Root cause: {what caused the bug}
- Fix: {what was changed}

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**Commit message guidelines:**
- Use conventional commits: `feat`, `fix`, `refactor`, `test`, `docs`
- Tasks use `feat`, bugs always use `fix`
- Include epic reference in scope
- Keep subject line under 72 characters

## Step 4: Record Metrics

### Update `state/session.json`:
Add to `completed_tasks` array:
```json
{
  "task_id": "{task_id}",
  "tokens": {estimated_tokens},
  "turns": {turn_count},
  "tools": {tool_calls},
  "agent": "{agent_used or null}",
  "bugs_caught": {count}
}
```

Update `totals`:
```json
{
  "tasks_completed": {increment},
  "tokens": {add task tokens + overhead},
  "tool_calls": {add}
}
```

Clear `active_task` to null.

### Note overhead:
The completion process itself costs ~1-3k tokens. Include in estimates.

## Step 5: Update Task/Bug Status

### For Tasks:
Update `state/tasks.json` - find task by id and set:
```json
{
  "status": "complete",
  "completed_at": "{today's date}",
  "metrics": {
    "tokens": {total},
    "turns": {count},
    "tools": {count},
    "agent": "{agent or null}",
    "overhead": {overhead_tokens}
  }
}
```

Update `state/project.json`:
- Increment `progress[epic_id].completed`

### [BUG] For Bug Fixes:
Update `state/bugs.json` - find bug by id and set:
```json
{
  "status": "fixed",
  "fixed_date": "{today's date}",
  "fix_summary": "{brief description of fix}",
  "root_cause": "{what caused the bug}"
}
```

Update `state/metrics.json`:
- Increment `quality.bugs_by_stage[found_in]`
- Increment `quality.bugs_by_severity[severity]`

## Step 6: Update Aggregate Metrics
Update `state/metrics.json`:

Add/update `by_task_type[type]`:
- Increment `count`
- Recalculate `avg_tokens` and `avg_turns`

Add/update `by_task_size[size]`:
- Increment `count`
- Recalculate `avg_tokens`

If agent was used, update `tools.agents[agent_name]`:
- Increment `uses`
- Add `bugs_caught` if any
- Recalculate `avg_tokens`

## Step 7: Check for Learnings
If you encountered and solved any issues:
- Add entry to `state/learnings-index.json`
- Update the appropriate `learnings/*.md` file
- Include: problem, solution, and when to apply

## Step 8: Report

### For Tasks:
Tell the user:
- Commit hash
- Code review results (if ran)
- State files updated: `state/session.json`, `state/tasks.json`, `state/project.json`
- Learnings added (if any, with filename)
- Any bugs caught (and by whom)

Then suggest: "Ready for the next task? Use `/next-task`"

### [BUG] For Bug Fixes:
Tell the user:
- Bug ID and title
- Commit hash
- Root cause summary (1 line)
- State files updated:
  - `state/bugs.json` - status set to fixed
  - `state/session.json` - metrics recorded
  - `state/metrics.json` - quality metrics updated
  - `learnings/*.md` - if pattern added (specify file)
- Remaining open bugs for this feature (if any)
- If feature is now unblocked (no more critical/high bugs)

Then suggest:
- If more blocking bugs: "More blocking bugs remain. Fix next with `/fix-bug {feature}`"
- If only non-blocking bugs: "Feature unblocked! Non-blocking bugs can be fixed later."
- If no bugs left: "All bugs fixed for this feature!"

## Code Review Checklist
When running code-reviewer, check for:
- [ ] TypeScript types correct
- [ ] Error handling in place
- [ ] Loading states handled
- [ ] testID attributes on interactive elements
- [ ] No console.log statements
- [ ] Follows existing patterns
- [ ] No security issues

---

## MANDATORY Completion Checklist

**STOP. Before reporting to user, verify ALL items are done:**

### 1. Commit Created
- [ ] `git add -A && git commit` executed
- [ ] Commit message follows convention

### 2. Session State Updated (`state/session.json`)
- [ ] Added entry to `completed_tasks` array
- [ ] Updated `totals` section
- [ ] Cleared `active_task`
- [ ] Added to `notes` if significant learnings discovered

### 3. Task/Bug Status Updated
- [ ] `state/tasks.json` - task marked complete with metrics
- [ ] OR `state/bugs.json` - bug marked fixed with root cause
- [ ] `state/project.json` - progress incremented

### 4. Metrics Updated (`state/metrics.json`)
- [ ] `by_task_type` updated
- [ ] `by_task_size` updated
- [ ] `tools.agents` updated (if agent used)

### 5. Learnings Captured (if root cause found)
- [ ] **ASK:** "Did I discover a reusable pattern or fix a non-obvious issue?"
- [ ] If YES: Add to `learnings/*.md` and update `state/learnings-index.json`

### 6. Epic Completion (if this was the last task)
If all tasks in the epic are now complete (check `state/tasks.json`):
- [ ] Update `state/project.json` progress status to "complete"
- [ ] Note in session

**Only report to user after ALL applicable items are checked.**
