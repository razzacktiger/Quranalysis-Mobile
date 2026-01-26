---
description: Start fixing bugs for a feature
---

# Fix Bug

Begin a bug-fixing session for a feature. Lists all open bugs sorted by severity and guides through fixing them.

## Input
$ARGUMENTS = feature ID (e.g., "4.2") or specific bug ID (e.g., "BUG-4.2.1")

## Step 1: Load Bug List

Query `state/bugs.json`:

If $ARGUMENTS is a feature ID (e.g., "4.2"):
```typescript
// Filter: feature_id matches, status = 'open'
// Order by: severity (1 first, 4 last)
```

If $ARGUMENTS is a specific bug ID (e.g., "BUG-4.2.1"):
```typescript
// Filter: id matches exactly
```

If no matching bugs found:
- Report "No open bugs for Feature X.X"
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

Once user selects a bug, read full bug details from `state/bugs.json`:
- `title`
- `description`
- `files`
- `found_in`
- Any notes

## Step 4: Check Learnings

Query `state/learnings-index.json` based on bug type:
- UI bugs: by tag "react-native"
- API bugs: by tags "typescript", "auth"
- Form bugs: by tag "forms"
- Always: by category "common-mistakes"

## Step 5: Initialize Bug Fix Session

Update `state/session.json`:
```json
{
  "active_task": {
    "id": "BUG-X.X.X",
    "name": "{bug title}",
    "type": "Bug",
    "size": "M",
    "started_at": "{ISO timestamp}"
  }
}
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
- Remaining bugs for this feature (query `state/bugs.json`)

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

**IMPORTANT:** Do NOT commit or update state here. The `/complete-task` command handles:
- Creating the commit
- Updating `state/bugs.json` (set status to fixed, add root_cause, fix_summary)
- Removing from blockers in `state/project.json` if listed
- Updating `state/session.json` metrics
- Capturing learnings

## Example Usage

### Fix highest priority bug
```
User: /fix-bug 4.2
Agent: *Queries state/bugs.json*
Agent: "Feature 4.2 has 3 open bugs. 2 are blocking.
        Starting with BUG-4.2.1 (Critical): Modal crash on rapid close"
```

### Fix specific bug
```
User: /fix-bug BUG-4.2.3
Agent: *Loads specific bug from state/bugs.json*
Agent: "BUG-4.2.3: Flicker on open (Severity: 3)
        Files: components/ai/ChatModal.tsx
        Ready to investigate?"
```

## Workflow Summary

```
/fix-bug 4.2
    ↓
Query state/bugs.json → Select bug → Check learnings
    ↓
Plan fix → Execute fix → Verify ready (Step 8)
    ↓
Report to user (Step 9)
    ↓
User runs /complete-task → Commit, state updates
```

**Key:** `/fix-bug` handles discovery and implementation. `/complete-task` handles finalization.
