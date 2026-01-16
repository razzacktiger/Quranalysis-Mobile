---
description: Complete current task with commit and status update
---

# Complete Task

You are completing a task after user approval. Follow these steps:

## Step 1: Verify Approval
Confirm the user has approved the implementation.

## Step 2: Create Commit
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

## Step 3: Update STATUS.md
Update `.claude/STATUS.md`:
- Mark completed task as ✅ Complete
- Add actual token estimate
- Update "Completed This Session" metrics
- Update cumulative metrics

## Step 4: Check for Learnings
If you encountered and solved any issues:
- Add pattern to `.claude/LEARNINGS.md`
- Include: problem, solution, and when to apply

## Step 5: Report
Tell the user:
- Commit hash
- Updated metrics
- Any learnings added

Then ask: "Ready for the next task? Use `/next-task`"

## Example STATUS.md Update

```markdown
| ID | Task | Size | Status | Tests | Tokens | Notes |
|----|------|------|--------|-------|--------|-------|
| 0.1.1 | Initialize Expo | S | ✅ Complete | typecheck | ~450 | - |
```

