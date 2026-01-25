---
description: Start fixing bugs for a feature
---

# Fix Bug

Begin a bug-fixing session for a feature. Lists all open bugs sorted by severity and guides through fixing them.

## Input
$ARGUMENTS = feature ID (e.g., "4.2") or specific bug ID (e.g., "BUG-4.2.1")

## Step 1: Load Bug List

If $ARGUMENTS is a feature ID (e.g., "4.2"):
- Read `epics/active/EPIC-X-NAME/features/X.X-name/BUGS.md`
- List all Open bugs sorted by severity (1 first, 4 last)

If $ARGUMENTS is a specific bug ID (e.g., "BUG-4.2.1"):
- Find and load that specific bug

If no BUGS.md exists:
- Report "No bugs tracked for Feature X.X"
- Suggest `/add-bug` to log new bugs

## Step 2: Display Bug Summary

Show user the bug dashboard:

```
## Feature 4.2 - Chat UI: Open Bugs

| ID | Title | Severity | Status |
|----|-------|----------|--------|
| BUG-4.2.1 | Modal crash on rapid close | 1 (Critical) | Open |
| BUG-4.2.2 | Keyboard covers input | 2 (High) | Open |
| BUG-4.2.3 | Flicker on open | 3 (Medium) | Open |

Blocking bugs (must fix before feature complete): 2
Non-blocking bugs: 1

Which bug would you like to fix? (Enter ID or "highest" for most severe)
```

## Step 3: Load Bug Details

Once user selects a bug, read full bug details:
- Description
- Reproduction steps
- Expected vs actual behavior
- Files involved
- Notes

## Step 4: Check Learnings

Based on bug type, load relevant learnings:
- UI bugs: `learnings/react-native.md`
- API bugs: `learnings/typescript.md`, `learnings/auth.md`
- Form bugs: `learnings/forms.md`
- Always: `learnings/common-mistakes.md`

## Step 5: Initialize Bug Fix Session

Update `meta/session/CURRENT.md`:

```markdown
## Active Bug Fix
- **Bug ID:** BUG-X.X.X
- **Title:** {title}
- **Severity:** {severity}
- **Feature:** {feature}
- **Started:** {timestamp}
```

## Step 6: Plan Fix

Based on bug details:
1. Identify root cause hypothesis
2. List files to examine/modify
3. Propose fix approach

Ask user: "Ready to investigate? I'll start by examining {file}."

## Step 7: Execute Fix

Follow standard development flow:
1. Read relevant files
2. Identify issue
3. Implement fix
4. Verify fix works

## Step 8: Verify Fix Ready

Before presenting fix to user for approval, verify:
- [ ] Root cause identified and documented
- [ ] Fix implemented
- [ ] `npm run typecheck` passes
- [ ] Reproduction steps no longer reproduce bug
- [ ] No console errors
- [ ] Regression test added (if applicable)

## Step 9: Report & Hand Off to /complete-task

Present the fix to the user:
- What the root cause was
- What was changed to fix it
- Files modified
- Remaining bugs for this feature (if any)

**Example output:**
```
## Bug Fix Ready for Review

**Bug:** BUG-4.2.1 - Modal crash on rapid close
**Root Cause:** Close handler fired multiple times without debounce
**Fix:** Added 300ms debounce to close handler

**Files Modified:**
- components/ai/ChatModal.tsx

**Verification:**
- ✅ Typecheck passes
- ✅ Bug no longer reproduces
- ✅ No console errors

**Remaining bugs for Feature 4.2:**
- Blocking: 1 (BUG-4.2.2)
- Non-blocking: 1

Ready to commit? Run `/complete-task` to finalize.
```

**IMPORTANT:** Do NOT commit or update metrics here. The `/complete-task` command handles:
- Creating the commit
- Updating BUGS.md (move to Fixed, add commit hash)
- Updating epic README (remove from blockers if listed)
- Updating session metrics
- Capturing learnings

## Example Usage

### Fix highest priority bug
```
User: /fix-bug 4.2
Agent: *Reads BUGS.md, shows bug list*
Agent: "Feature 4.2 has 3 open bugs. 2 are blocking.
        Starting with BUG-4.2.1 (Critical): Modal crash on rapid close"
```

### Fix specific bug
```
User: /fix-bug BUG-4.2.3
Agent: *Loads specific bug*
Agent: "BUG-4.2.3: Flicker on open (Severity: 3)
        Files: components/ai/ChatModal.tsx
        Ready to investigate?"
```

## Integration with /start-epic

When using `/start-epic X-name --bugs` or `/start-epic X-name bugs`:
- Instead of showing tasks, show bug summary
- Start with highest severity bug
- Follow this workflow

## Workflow Summary

```
/fix-bug 4.2
    ↓
Select bug → Load details → Check learnings
    ↓
Plan fix → Execute fix → Verify ready (Step 8)
    ↓
Report to user (Step 9)
    ↓
User runs /complete-task → Commit, metrics, BUGS.md update
```

**Key:** `/fix-bug` handles discovery and implementation. `/complete-task` handles finalization.
