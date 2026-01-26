# Orchestrator Workflow

Complete workflow for the orchestrator session to handle agent outputs and maintain the development workflow.

## Overview

The orchestrator is responsible for:
1. Dispatching agents with focused context
2. Presenting agent results to the user
3. Handling git commits, status updates, and metrics
4. Coordinating parallel execution
5. Integrating with existing `/complete-task` and `/end-session` workflows

## Phase 1: Dispatch Agent

### 1.1 Select Agent Type

Use [DISPATCH.md](../DISPATCH.md) to choose:
- `prompt-agent` for API/hooks/prompts
- `ui-agent` for components/screens
- `setup-agent` for config/packages
- `test-agent` for E2E/unit tests

### 1.2 Compose Agent Prompt

Include:
1. Task specification from TASKS.md
2. Context files to read
3. Standards to follow
4. Report format requirement

```markdown
[Agent prompt header from types/[agent-type].md]

## Task Specification
[Paste from TASKS.md]

## Context Files
- [file1] - [why needed]
- [file2] - [why needed]

## Standards
- [relevant standard]

## IMPORTANT: Report Format
You MUST end your response with a structured report following this format:
[Paste from workflows/report-format.md]
```

### 1.3 Launch Agent

```
Task tool:
- subagent_type: "general-purpose" (or appropriate type)
- run_in_background: true
- prompt: [composed prompt]
- description: "Task X.X.X - [brief name]"
```

### 1.4 Track Dispatch

Update `meta/session/CURRENT.md`:
```markdown
## Active Agents

| Agent ID | Task | Type | Started | Status |
|----------|------|------|---------|--------|
| abc123 | 4.1.2 | prompt-agent | 14:30 | Running |
| def456 | 4.3.1 | setup-agent | 14:30 | Running |
```

## Phase 2: Monitor Agents

### 2.1 Check Progress

```bash
# Read agent output
tail -100 [output_file_path]

# Or use Read tool on output file
```

### 2.2 Handle Checkpoints

If agent reports NEEDS_INPUT:

1. Read the checkpoint question from agent output
2. Present to user:
   ```
   Agent 4.1.2 needs input:

   Question: [agent's question]
   Options: [if provided]

   What should I tell the agent?
   ```
3. Resume agent with user's answer:
   ```
   Task tool:
   - resume: [agent_id]
   - prompt: "User response: [answer]"
   ```

### 2.3 Wait for Completion

Agent will return with structured report when done.

## Phase 3: Present Results to User

### 3.1 Parse Agent Report

Extract from report:
- Status (COMPLETE/NEEDS_INPUT/BLOCKED)
- Files changed
- Summary
- Review flag
- Commit message

### 3.2 Show Summary

```markdown
## Agent Complete: Task 4.1.2

**Status:** COMPLETE
**Summary:** Created session extraction schema and prompt

**Files Changed:**
- lib/validation/ai.ts (Created, +95 lines)
- lib/api/prompts.ts (Created, +145 lines)

**Exports Added:**
- sessionExtractionSchema, SessionExtraction, extractSession

**Metrics:**
- ~10k tokens, 15 tool calls

**Code Review:** Needed (L size)

**Suggested Commit:**
feat(epic-4): Task 4.1.2 - Session extraction prompt

---
**Options:**
1. Approve - proceed with code review and commit
2. Review code - show me the files first
3. Request changes - tell agent to fix something
4. Reject - discard and try different approach
```

### 3.3 Handle User Response

**If "Approve":** → Phase 4
**If "Review code":** Show relevant files with Read tool, then re-prompt
**If "Request changes":** Resume agent with feedback
**If "Reject":** Mark as failed, consider alternative approach

## Phase 4: Complete Task (On Approval)

This replaces `/complete-task` when using agent workflow.

### 4.1 Code Review (if flagged)

If agent flagged "Review needed: Yes":

```
Launch review-agent:
- subagent_type: "feature-dev:code-reviewer"
- prompt: Review files [list from agent report]
```

**If issues found:**
1. Present to user
2. If critical: Resume implementation agent with fixes
3. If minor: Note for future, proceed

### 4.2 Git Commit

```bash
# Stage files from agent report
git add [files from report section 3]

# Commit with message from report section 11
git commit -m "$(cat <<'EOF'
[commit message from agent report]
EOF
)"
```

### 4.3 Update Status Files

**status/CURRENT.md:**
```markdown
- **Task:** [next task] (was [completed task])
```

**Epic TASKS.md:**
Mark task as complete:
```markdown
**Status:** ✅ Complete
```
Or update acceptance criteria checkboxes.

### 4.4 Update Session Tracking

**meta/session/CURRENT.md:**

Add row to "This Session" table:
```markdown
| [task_id] | [tokens]k | [turns] | [tools] | [agent-type] | [bugs_caught] |
```

Update "Running Totals":
```markdown
- Tasks: [X] complete, [Y] in progress
- Tokens: [total]k
- Tool calls: [total]
```

Update "Files Read This Session":
```markdown
- [files agent read]
```

### 4.5 Update Metrics

**meta/metrics/tokens/recent-tasks.md:**
```markdown
| [date] | [task_id] | [epic] | [size] | [type] | [input] | [output] | [total] | [turns] | [tools] | [agent-type] | [notes] |
```

**meta/metrics/tools/agents.md:**
```markdown
| [date] | [task_id] | [agent-type] | [tokens] | [tools] | [checkpoints] | [review_issues] |
```

### 4.6 Record Learnings (if any)

If agent reported learnings:

Append to appropriate `learnings/*.md`:
```markdown
## [Pattern Name]

**Symptom:** [problem description]
**Cause:** [root cause]
**Fix:** [solution]
**Prevention:** [how to avoid]
```

### 4.7 Report Completion

```markdown
## Task 4.1.2 Complete

**Commit:** [hash]
**Files:** 2 created
**Metrics:** ~10k tokens, 15 tools
**Code Review:** Passed (0 issues)
**Learnings:** 1 added to common-mistakes.md

**Next:** Task 4.1.3 - Mistake Extraction Prompt
Ready to dispatch next agent?
```

## Phase 5: Next Task

### 5.1 Identify Next Task

From epic TASKS.md, find next incomplete task considering:
- Dependencies (previous tasks complete?)
- Parallel opportunities (can run multiple?)

### 5.2 Dispatch or End

**If more tasks:** Return to Phase 1
**If epic complete:** Proceed to Phase 6
**If session ending:** Run `/end-session`

## Phase 6: End Session

Follow existing `/end-session` workflow:

1. Check uncommitted work
2. Capture friction
3. Finalize metrics
4. Check signals (red/yellow flags)
5. Update status
6. Calculate session stats
7. Push changes (optional)
8. Generate summary

### Agent-Specific Additions

When ending a session that used agents:

**meta/metrics/tools/agents.md** - Session summary:
```markdown
## Session [date]

| Task | Agent Type | Tokens | Tools | Checkpoints | Review Issues |
|------|------------|--------|-------|-------------|---------------|
| 4.1.2 | prompt-agent | 10k | 15 | 0 | 0 |
| 4.3.1 | setup-agent | 4k | 8 | 0 | 0 |

**Totals:**
- Agents dispatched: 2
- Total agent tokens: ~14k
- Parallel execution: Yes (saved ~20%)
- Checkpoints: 0
- Review issues: 0
```

## Parallel Execution

### When to Parallelize

Tasks can run in parallel when:
- No file dependencies between them
- Different features/areas
- Setup tasks alongside implementation

### How to Parallelize

1. Launch multiple agents in same message:
   ```
   [Task tool call 1 - background]
   [Task tool call 2 - background]
   ```

2. Track both in session:
   ```markdown
   | abc123 | 4.1.2 | prompt-agent | 14:30 | Running |
   | def456 | 4.3.1 | setup-agent | 14:30 | Running |
   ```

3. Process completions as they arrive
4. Each completion goes through Phase 3-4 independently

### Handling Dependencies

If Task B depends on Task A:
1. Wait for Task A to complete Phase 4
2. Then dispatch Task B with updated context

## Error Handling

### Agent Failed

If agent returns BLOCKED or errors:
1. Present error to user
2. Options:
   - Retry with clarification
   - Dispatch different agent type
   - Handle manually (break agent workflow)

### Commit Failed

If git commit fails:
1. Check for conflicts
2. Resolve manually if needed
3. Retry commit

### Review Found Critical Issues

If code-reviewer finds critical bugs:
1. Present to user
2. Resume implementation agent with fix request
3. Re-review after fix
4. Only commit when clean

## Quick Reference

### Orchestrator Checklist Per Task

```
□ Dispatch agent with proper prompt
□ Track in session file
□ Monitor for checkpoints
□ Present results to user
□ Get user approval
□ Run code review (if needed)
□ Git commit
□ Update status/CURRENT.md
□ Update TASKS.md
□ Update meta/session/CURRENT.md
□ Update meta/metrics/*
□ Record learnings (if any)
□ Report completion
□ Identify next task
```

### Files Orchestrator Updates

| File | When | What |
|------|------|------|
| meta/session/CURRENT.md | Each task | Metrics row, totals, files read |
| status/CURRENT.md | Each task | Current task, progress |
| TASKS.md | Each task | Mark complete |
| meta/metrics/tokens/recent-tasks.md | Each task | Full metrics row |
| meta/metrics/tools/agents.md | Each task | Agent-specific metrics |
| learnings/*.md | If learning found | New pattern |
