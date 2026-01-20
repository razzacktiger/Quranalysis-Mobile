---
description: Complete current task with commit and status update
---

# Complete Task

Complete a task after user approval with code review, commit, and metrics.

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
```bash
git add -A
git commit -m "feat(epic-X): Task X.X.X - Brief description

- List key changes
- Include files modified

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**Commit message guidelines:**
- Use conventional commits: `feat`, `fix`, `refactor`, `test`, `docs`
- Include epic reference in scope
- Keep subject line under 72 characters

## Step 4: Record Metrics
Update `meta/session/CURRENT.md`:

### Task Row
Add row to "This Session" table:
```
| {task_id} | {est_tokens}k | {turns} | {tool_calls} | {agent_used} | {bugs_caught} |
```

### Running Totals
- Increment tasks completed
- Update token estimate
- Note any bugs caught and by whom

### Files Read
Update files read list (for avoiding redundant reads)

## Step 5: Update Status
Update `status/CURRENT.md`:
- Mark completed task as done
- Update current task to next

Update epic feature file:
- Mark task row as complete

## Step 6: Update Metrics (Detailed)
Add row to `meta/metrics/tokens/recent-tasks.md`:
```
| {date} | {task_id} | {epic} | {size} | {type} | {input} | {output} | {total} | {turns} | {tools} | {agent} | {notes} |
```

## Step 7: Check for Learnings
If you encountered and solved any issues:
- Add pattern to appropriate `learnings/*.md` file
- Include: problem, solution, and when to apply

## Step 8: Report
Tell the user:
- Commit hash
- Code review results (if ran)
- Updated metrics
- Any learnings added
- Any bugs caught (and by whom)

Then suggest: "Ready for the next task? Use `/next-task`"

## Example STATUS.md Update

```markdown
| ID | Task | Size | Status | Tests | Notes |
|----|------|------|--------|-------|-------|
| 4.1.1 | Setup Gemini API | M | Complete | typecheck | - |
```

## Example Session Row

```markdown
| 4.1.1 | 12k | 3 | 8 | reviewer | 1 (type error) |
```

## Code Review Checklist
When running code-reviewer, check for:
- [ ] TypeScript types correct
- [ ] Error handling in place
- [ ] Loading states handled
- [ ] testID attributes on interactive elements
- [ ] No console.log statements
- [ ] Follows existing patterns
- [ ] No security issues
