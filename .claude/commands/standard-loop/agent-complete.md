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

1. Launch review-agent:
   ```
   Task tool:
   - subagent_type: "feature-dev:code-reviewer"
   - prompt: "Review these files for Task [ID]: [file list]
              Original requirements: [from TASKS.md]
              Check: bugs, security, standards compliance"
   ```

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

# Commit with agent's suggested message (or modified)
git commit -m "$(cat <<'EOF'
[commit message from report]
EOF
)"
```

Get commit hash for reporting.

## Step 6: Update Status Files

### status/CURRENT.md

Update current task:
```markdown
- **Task:** [next task ID] - [next task name]
```

Update progress if needed.

### Epic TASKS.md

Mark task complete:
```markdown
**Status:** ✅ Complete
```

Or check acceptance criteria:
```markdown
- [x] Criteria 1
- [x] Criteria 2
```

## Step 7: Update Session Tracking

### meta/session/CURRENT.md

**Add row to "This Session" table:**
```markdown
| [task_id] | [tokens]k | [turns] | [tools] | [agent-type] | [bugs_caught] |
```

Example:
```markdown
| 4.1.2 | ~10k | 1 | 15 | prompt-agent | 0 |
```

**Update "Running Totals":**
```markdown
- Tasks: [X] complete, [Y] in progress
- Tokens: ~[total]k
- Tool calls: [total]
```

**Update "Files Read This Session":**
Add files the agent read (from report metrics).

**Update "Active Agents" (if tracking):**
Remove completed agent from active list.

## Step 8: Update Metrics Files

### meta/metrics/tokens/recent-tasks.md

Add row:
```markdown
| [date] | [task_id] | [epic] | [size] | [type] | [input] | [output] | [total] | [turns] | [tools] | [agent-type] | [notes] |
```

Example:
```markdown
| 01-21 | 4.1.2 | 4 | L | prompt | ~8k | ~2k | ~10k | 1 | 15 | prompt-agent | Session extraction |
```

### meta/metrics/tools/agents.md

Add row:
```markdown
| [date] | [task_id] | [agent-type] | [tokens] | [tools] | [checkpoints] | [review_issues] |
```

Example:
```markdown
| 01-21 | 4.1.2 | prompt-agent | ~10k | 15 | 0 | 0 |
```

### meta/metrics/quality/bugs-by-stage.md (if bugs found)

If code review found issues:
```markdown
| [date] | [task] | [stage] | [count] | [categories] |
| 01-21 | 4.1.2 | code-review | 1 | type-safety |
```

## Step 9: Record Learnings (If Any)

If agent reported learnings:

1. Identify appropriate file:
   - `learnings/common-mistakes.md` for general issues
   - `learnings/react-native.md` for RN-specific
   - `learnings/typescript.md` for TS patterns
   - etc.

2. Append pattern:
   ```markdown
   ## [Pattern Title]

   **Symptom:** [what goes wrong]
   **Cause:** [why it happens]
   **Fix:** [how to fix]
   **Prevention:** [how to avoid in future]
   ```

## Step 10: Report Completion

```markdown
## Task [ID] Complete ✓

**Commit:** [hash]
**Files:** [count] created/modified
**Metrics:** ~[X]k tokens, [Y] tools
**Code Review:** [Passed/N/A] ([X] issues found)
**Learnings:** [count] added

**Next Task:** [ID] - [name]
**Dependencies:** [any tasks now unblocked]

---
Ready to dispatch next agent? Or /end-session to finish.
```

## Parallel Task Handling

If multiple agents completed:

1. Process each report sequentially
2. Each goes through Steps 3-9
3. Batch the status/metrics updates if efficient
4. Report all completions together

## Error Handling

### Git Commit Fails
- Check for conflicts
- Show error to user
- Options: resolve manually, retry, rollback

### Missing Report Sections
- Ask user if they have the info
- Or resume agent to complete report

### Metrics File Doesn't Exist
- Create with headers if missing
- Or skip that metric (note in report)

## Integration Notes

This command replaces `/complete-task` when:
- Task was implemented by an agent
- Agent returned structured report

Use standard `/complete-task` when:
- You implemented the task directly (not via agent)
- Agent workflow not in use

The two can coexist in the same session.
