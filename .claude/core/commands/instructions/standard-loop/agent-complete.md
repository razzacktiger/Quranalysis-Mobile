---
description: Complete an agent's task with commit, status update, and metrics
---

# Agent Complete

Process an agent's report and complete the task workflow. This is the agent-based equivalent of `/complete-task`.

## Input
$ARGUMENTS = agent output or report (can be empty if just completed)

## Step 1: Parse Agent Report

Extract from the agent's structured report:

```
Status: COMPLETE | NEEDS_INPUT | BLOCKED
Files Changed: [list with actions and line counts]
Exports Added: [list]
Metrics: tokens, tools, files read
Code Review Flag: Yes/No
Commit Message: [suggested message]
Learnings: [if any]
```

If report is malformed or missing sections, ask user for clarification.

## Step 2: Handle Non-Complete Status

**If NEEDS_INPUT:**
- Present the agent's question to user
- Get user response
- Resume agent: `Task tool with resume: [agent_id]`
- Return (workflow continues when agent completes)

**If BLOCKED:**
- Present blocker to user
- Options: retry, manual intervention, skip task
- Handle based on user choice

**If COMPLETE:** Continue to Step 3

## Step 3: User Approval

Present summary to user:

```markdown
## Agent Report: Task [ID]

**Summary:** [from report]
**Files:** [count] changed
**Exports:** [list key exports]
**Metrics:** ~[X]k tokens, [Y] tools

**Code Review:** [Needed/Not needed]
**Commit Message:**
[suggested message]

---
Approve this task? (approve/review/changes/reject)
```

Wait for user response:
- **approve**: Continue to Step 4
- **review**: Show files with Read tool, then re-ask
- **changes**: Get feedback, resume agent with changes
- **reject**: Mark task as failed, discuss alternatives

## Step 4: Code Review (If Flagged)

If agent flagged "Review needed: Yes":

1. Launch review-agent (code-reviewer subagent)
2. Wait for review report
3. **If APPROVE:** Continue to Step 5
4. **If NEEDS_CHANGES:**
   - Show issues to user
   - Resume implementation agent with fixes
   - Re-review after fixes
5. **If BLOCK:**
   - Show critical issues to user
   - Must fix before proceeding

## Step 5: Git Commit

```bash
# Stage files from agent report
git add [files from report]

# Verify staged files match report
git status

# Commit with agent's suggested message
git commit -m "[commit message from report]"
```

Get commit hash for reporting.

## Step 6: Update Task Status

Update `state/tasks.json` - find task by id and set:
```json
{
  "status": "complete",
  "completed_at": "{today}",
  "metrics": {
    "tokens": {from report},
    "turns": 1,
    "tools": {from report},
    "agent": "{agent-type}",
    "overhead": {completion overhead}
  }
}
```

Update `state/project.json`:
- Increment `progress[epic_id].completed`
- Update `active.task_id` to null or next task

## Step 7: Update Session Tracking

Update `state/session.json`:

**Add to `completed_tasks` array:**
```json
{
  "task_id": "[task_id]",
  "tokens": {from report},
  "turns": 1,
  "tools": {tool count},
  "agent": "[agent-type]",
  "bugs_caught": {count from review}
}
```

**Update `totals`:**
- Increment `tasks_completed`
- Add tokens to total
- Add tools to total

**Remove from `active_agents`:**
Remove the completed agent entry.

**Add to `files_read`:**
Add files the agent read (from report metrics).

## Step 8: Update Metrics

Update `state/metrics.json`:

**Add/update `by_task_type[type]`:**
- Increment `count`
- Recalculate `avg_tokens` and `avg_turns`

**Add/update `by_task_size[size]`:**
- Increment `count`
- Recalculate `avg_tokens`

**Update `tools.agents[agent_name]`:**
- Increment `uses`
- Add `bugs_caught` if any from review
- Recalculate `avg_tokens`

## Step 9: Record Learnings (If Any)

If agent reported learnings:

1. Identify appropriate file:
   - `learnings/common-mistakes.md` for general issues
   - `learnings/react-native.md` for RN-specific
   - `learnings/typescript.md` for TS patterns

2. Append pattern to markdown file

3. Update `state/learnings-index.json`:
   - Add entry to `entries` array
   - Update `by_category` and `by_tag` indexes

## Step 10: Report Completion

```markdown
## Task [ID] Complete ✓

**Commit:** [hash]
**Files:** [count] created/modified
**Metrics:** ~[X]k tokens, [Y] tools
**Code Review:** [Passed/N/A] ([X] issues found)
**Learnings:** [count] added

**State Updated:**
- state/tasks.json - task marked complete
- state/session.json - metrics recorded
- state/metrics.json - aggregates updated

**Next Task:** [ID] - [name]
**Dependencies:** [any tasks now unblocked]

---
Ready to dispatch next agent? Or /end-session to finish.
```

## Parallel Task Handling

If multiple agents completed:

1. Process each report sequentially
2. Each goes through Steps 3-9
3. Batch the state updates if efficient
4. Report all completions together

## Error Handling

### Git Commit Fails
- Check for conflicts
- Show error to user
- Options: resolve manually, retry, rollback

### Missing Report Sections
- Ask user if they have the info
- Or resume agent to complete report

## Integration Notes

This command replaces `/complete-task` when:
- Task was implemented by an agent
- Agent returned structured report

Use standard `/complete-task` when:
- You implemented the task directly (not via agent)
- Agent workflow not in use

The two can coexist in the same session.
