---
description: Continue to the next task in the current epic
---

# Next Task

You are continuing work on the current epic. Follow these steps:

## Step 1: Read Status
Read `.claude/STATUS.md` to identify:
- Current epic
- Last completed task
- Any blockers noted

## Step 2: Read Epic
Read the current epic file to find the next task.

## Step 3: Check Task Requirements
For the next task, identify:
- Acceptance criteria
- Files to create/modify
- Dependencies (verify they're complete)
- Test commands
- Whether TDD is required (marked with ⚠️ TDD)

## Step 4: Implement
If TDD required:
1. Write tests first
2. Run tests (should fail)
3. Implement code
4. Run tests (should pass)

If not TDD:
1. Implement following acceptance criteria
2. Run specified tests

## Step 5: Report Results
Tell the user:
- Task ID completed
- Tests run and results
- Any issues encountered

Then wait for approval before committing.

## On Failure
After 1st failure: Assess if human-required (env vars, API keys, design decisions)
- If yes: Ask immediately
- If no: Check LEARNINGS.md, try again

After 2nd failure: Research using Context7 or web

After 3rd failure: Stop and ask human

## Standards
Follow `.claude/CODE-STANDARDS.md` for all code.
