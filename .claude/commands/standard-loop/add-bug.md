---
description: Add a bug to a feature's bug list for tracking and fixing
---

# Add Bug

Log a bug discovered during development to the appropriate feature's bug list.

## Input
$ARGUMENTS = optional description (e.g., "modal doesn't close on backdrop tap")

## Step 1: Gather Bug Information

If $ARGUMENTS provided, use as starting point. Otherwise, ask user for:

**Required:**
1. **Title:** Brief description of the bug
2. **Feature:** Which feature does this bug belong to? (e.g., 4.2)
3. **Severity:**
   - 1 (Critical): Crashes, data loss, security issues
   - 2 (High): Feature broken, blocks user flow
   - 3 (Medium): Feature degraded but usable
   - 4 (Low): Cosmetic, minor UX issues
4. **Description:** What is the bug?

**Optional (fill if known):**
5. **Found In:** Task where bug was discovered (e.g., Task 4.2.3)
6. **Reproduction Steps:** How to reproduce
7. **Files:** Suspected files involved

## Step 2: Generate Bug ID

Read the feature's BUGS.md file (if exists) to find the next bug ID.

**Format:** `BUG-{feature}.{sequence}`

Examples:
- First bug in Feature 4.2: `BUG-4.2.1`
- Third bug in Feature 4.1: `BUG-4.1.3`

## Step 3: Create or Update BUGS.md

**File location:** `epics/active/EPIC-X-NAME/features/X.X-name/BUGS.md`

If file doesn't exist, create from template at `templates/BUGS-TEMPLATE.md`.

### Add Bug Entry

Under "## Open Bugs", add:

```markdown
## BUG-{id}: {title}

**Severity:** {1-4} | **Status:** Open
**Found In:** {task or "Manual testing"} | **Found Date:** {today}
**Files:** `{files}`

### Description
{description}

### Reproduction Steps
1. {step}
2. {step}

### Expected Behavior
{expected}

### Actual Behavior
{actual}

### Notes
{notes}

---
```

## Step 4: Update Epic README (if critical/high)

If severity is 1 or 2, add a note to the epic's README.md under a "## Blockers" section:

```markdown
## Blockers
- BUG-4.2.1: Modal crash on rapid close (Severity: 1)
```

## Step 5: Update Session Tracking

Add to `meta/session/CURRENT.md` under Notes:
```
- Bug logged: BUG-X.X.X - {title} (Severity: X)
```

## Step 6: Report

Tell the user:
- Bug ID assigned
- Severity level and what it means
- File location
- If it blocks feature completion (severity 1-2)

**Example output:**
```
Logged BUG-4.2.3: Chat modal flicker on open

Severity: 3 (Medium) - Feature usable but degraded
Location: .claude/epics/active/EPIC-4-AI-CHAT/features/4.2-chat-ui/BUGS.md

This bug does NOT block feature completion.
To fix it later, use `/fix-bug 4.2` to see all bugs for that feature.
```

## Example Usage

```
User: /add-bug
Agent: What bug would you like to log?

User: The chat modal doesn't close when tapping the backdrop

Agent: Got it. A few questions:
1. Which feature? (e.g., 4.1, 4.2, 4.3)
2. Severity? (1=Critical, 2=High, 3=Medium, 4=Low)

User: 4.2, severity 3

Agent: *Creates BUGS.md entry*

Logged BUG-4.2.1: Chat modal doesn't close on backdrop tap

Severity: 3 (Medium) - Feature usable but degraded
Location: .claude/epics/active/EPIC-4-AI-CHAT/features/4.2-chat-ui/BUGS.md

This bug does NOT block feature completion.
```

## Severity Guidelines

| Severity | Examples |
|----------|----------|
| 1 - Critical | App crash, data corruption, auth bypass, infinite loop |
| 2 - High | Feature completely broken, can't complete core flow, API failures |
| 3 - Medium | Incorrect display, slow performance, wrong validation message |
| 4 - Low | Typo, minor alignment, color slightly off, edge case UI glitch |
