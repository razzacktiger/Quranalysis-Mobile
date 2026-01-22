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

## Step 8: Complete Bug Fix

After user approves fix:

1. **Update BUGS.md:**
   - Move bug entry from "## Open Bugs" to "## Fixed Bugs"
   - Update status: `**Status:** Fixed`
   - Add: `**Fixed Date:** {today}` | `**Fixed In:** {commit}`

2. **Create Commit:**
   ```bash
   git add -A
   git commit -m "fix(epic-X): BUG-X.X.X - {title}

   - {description of fix}

   Co-Authored-By: Claude <noreply@anthropic.com>"
   ```

3. **Update Session Metrics:**
   Add to session table with "BUG" marker:
   ```
   | BUG-4.2.1 | ~5k | 3 | 8 | - | - |
   ```

4. **Remove from Epic Blockers:**
   If bug was listed in epic README blockers, remove it.

## Step 9: Report

Tell the user:
- Bug fixed and committed
- Commit hash
- Remaining bugs for this feature (if any)
- If feature is now unblocked

**Example output:**
```
Fixed BUG-4.2.1: Modal crash on rapid close

Commit: abc1234
Fix: Added debounce to close handler

Feature 4.2 bug status:
- Blocking bugs remaining: 1 (BUG-4.2.2)
- Non-blocking bugs: 1

Feature 4.2 is still blocked. Fix BUG-4.2.2 next?
```

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

## Bug Fix Checklist (Before Reporting to User)

Verify these before presenting fix to user for approval:
- [ ] Root cause identified and documented
- [ ] Fix implemented
- [ ] `npm run typecheck` passes
- [ ] Reproduction steps no longer reproduce bug
- [ ] No console errors
- [ ] Regression test added (if applicable)

**Then report to user:**
- What the root cause was
- What was changed to fix it
- Files modified

**After user approval:** Prompt them to run `/complete-task` which will:
- Create the commit
- Update BUGS.md (move to Fixed, add commit hash)
- Update epic README (remove from blockers)
- Update session metrics
- Capture learnings
