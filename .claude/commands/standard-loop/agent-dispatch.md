---
description: Dispatch an agent for a task with proper context and tracking
---

# Agent Dispatch

Dispatch a specialized agent for a task with focused context.

## Input
$ARGUMENTS = task ID (e.g., "4.1.2") or "next" for next task

## Step 1: Identify Task

If $ARGUMENTS is a task ID:
- Read the task spec from epic TASKS.md

If $ARGUMENTS is "next":
- Read status/CURRENT.md for current task
- Use that task ID

Extract:
- Task ID
- Task name
- Task size (S/M/L/XL)
- Task type (from markers or inference)
- File targets
- Acceptance criteria

## Step 2: Select Agent Type

Use dispatch rules from `.claude/agents/DISPATCH.md`:

| Task Type | Agent |
|-----------|-------|
| API, Hook, Prompt, Service | prompt-agent |
| UI, Component, Screen | ui-agent |
| Config, Setup | setup-agent |
| Test, E2E | test-agent |

## Step 3: Gather Context Files

Based on task type, identify:

**For prompt-agent:**
- Related existing code files
- Type definitions
- Validation patterns
- standards/api-patterns.md
- standards/typescript.md

**For ui-agent:**
- Similar components
- Design specs from task
- standards/components.md
- standards/styling.md

**For setup-agent:**
- app.json
- package.json
- .env.example
- learnings/common-mistakes.md

**For test-agent:**
- Implementation files to test
- Existing test patterns
- standards/testing.md

## Step 4: Check Dependencies

Read epic TASKS.md to verify:
- Are prerequisite tasks complete?
- Are required files/exports available?

If dependencies not met:
- Report to user
- Suggest completing dependencies first
- Or proceed with stub approach (user's choice)

## Step 5: Compose Agent Prompt

Use template from `.claude/agents/types/[agent-type].md`:

```markdown
# [Agent Type] Task: [ID] - [Name]

## Your Role
[From agent type template]

## Task Specification
[Paste full task spec from TASKS.md]

## Context Files to Read First
- [file1] - [why]
- [file2] - [why]
...

## Standards to Follow
[Relevant standards for this task type]

## CRITICAL: Report Format
You MUST end your response with a structured report.
See the format below - the orchestrator needs this to complete the workflow.

[Paste report format template sections]

## Workflow
1. READ: Read all context files listed above
2. PLAN: Outline your approach
3. CHECKPOINT: If anything is unclear, stop and ask
4. IMPLEMENT: Write the code
5. VERIFY: Self-review against acceptance criteria
6. REPORT: Complete structured report (REQUIRED)
```

## Step 6: Check for Parallel Opportunities

Look at epic execution order:
- Are there independent tasks that can run simultaneously?
- Do they have no file conflicts?

If parallel possible:
- Ask user: "Task [X] can run in parallel. Dispatch both?"
- If yes: compose both agent prompts

## Step 7: Update Session Tracking

Before dispatching, update `meta/session/CURRENT.md`:

```markdown
## Active Agents

| Agent ID | Task | Type | Started | Status |
|----------|------|------|---------|--------|
| (pending) | [task_id] | [agent-type] | [time] | Dispatching |
```

## Step 8: Dispatch Agent

```
Task tool:
- subagent_type: "general-purpose" (or "feature-dev:code-reviewer" for review)
- run_in_background: true
- description: "Task [ID] - [brief name]"
- prompt: [composed prompt from Step 5]
```

Capture:
- Agent ID (from response)
- Output file path

## Step 9: Update Tracking with Agent ID

Update `meta/session/CURRENT.md`:

```markdown
## Active Agents

| Agent ID | Task | Type | Started | Status |
|----------|------|------|---------|--------|
| [actual_id] | [task_id] | [agent-type] | [time] | Running |
```

Also note output file path for monitoring.

## Step 10: Report to User

```markdown
## Agent Dispatched: Task [ID]

**Agent Type:** [type]
**Agent ID:** [id]
**Output File:** [path]

**Context Loaded:**
- [file1]
- [file2]

**Monitor Progress:**
```bash
tail -50 [output_file_path]
```

**What's Next:**
- Agent will report when complete (or at checkpoint)
- I'll present results for your review
- You approve before any commits

[If parallel:] Also dispatched: Task [other_id]
```

## Parallel Dispatch

To dispatch multiple agents simultaneously:

1. Compose all prompts
2. Send single message with multiple Task tool calls
3. Track all agent IDs
4. Process completions as they arrive

```markdown
## Agents Dispatched

| Task | Agent Type | Agent ID | Status |
|------|------------|----------|--------|
| 4.1.2 | prompt-agent | abc123 | Running |
| 4.3.1 | setup-agent | def456 | Running |

Both running in parallel. Will report as each completes.
```

## Handling Dispatch Failures

If Task tool fails:
1. Report error to user
2. Options:
   - Retry dispatch
   - Fall back to direct implementation
   - Debug the issue

## Quick Reference

### Agent Type Selection
```
API/Hook/Prompt → prompt-agent
UI/Component → ui-agent
Config/Setup → setup-agent
Test/E2E → test-agent
Review → review-agent (feature-dev:code-reviewer)
```

### Required Prompt Sections
1. Role description
2. Task specification
3. Context files
4. Standards
5. Report format requirement
6. Workflow steps

### Files to Update
- meta/session/CURRENT.md (active agents table)
