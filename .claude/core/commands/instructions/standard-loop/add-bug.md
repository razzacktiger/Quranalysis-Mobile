---
description: Add a bug to the bugs collection for tracking and fixing
---

# Add Bug

Log a bug discovered during development to the bugs collection.

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

Query `state/bugs.json` to find the next bug ID for this feature.

**Format:** `BUG-{feature}.{sequence}`

Examples:
- First bug in Feature 4.2: `BUG-4.2.1`
- Third bug in Feature 4.1: `BUG-4.1.3`

Count existing bugs with matching `feature_id` to determine sequence number.

## Step 3: Add to Bugs Collection

Update `state/bugs.json` - add to `bugs` array:

```json
{
  "id": "BUG-{feature}.{sequence}",
  "epic_id": "{current epic from state/project.json}",
  "feature_id": "{feature}",
  "severity": {1-4},
  "status": "open",
  "title": "{title}",
  "description": "{description}",
  "found_in": "{task or 'human_qa' or 'implementation'}",
  "found_date": "{today YYYY-MM-DD}",
  "fixed_date": null,
  "files": ["{file1}", "{file2}"],
  "root_cause": null,
  "fix_summary": null
}
```

## Step 4: Update Metrics (if critical/high)

If severity is 1 or 2, add blocker to `state/project.json`:
```json
{
  "blockers": [
    {
      "description": "BUG-4.2.1: Modal crash on rapid close",
      "severity": "critical",
      "created_at": "{today}"
    }
  ]
}
```

## Step 5: Update Session Tracking

Update `state/session.json` - add to `notes` array:
```
"Bug logged: BUG-X.X.X - {title} (Severity: X)"
```

## Step 6: Report

Tell the user:
- Bug ID assigned
- Severity level and what it means
- Stored in `state/bugs.json`
- If it blocks feature completion (severity 1-2)

**Example output:**
```
Logged BUG-4.2.3: Chat modal flicker on open

Severity: 3 (Medium) - Feature usable but degraded
Stored in: state/bugs.json

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

Agent: *Updates state/bugs.json*

Logged BUG-4.2.1: Chat modal doesn't close on backdrop tap

Severity: 3 (Medium) - Feature usable but degraded
Stored in: state/bugs.json

This bug does NOT block feature completion.
```

## Severity Guidelines

| Severity | Examples |
|----------|----------|
| 1 - Critical | App crash, data corruption, auth bypass, infinite loop |
| 2 - High | Feature completely broken, can't complete core flow, API failures |
| 3 - Medium | Incorrect display, slow performance, wrong validation message |
| 4 - Low | Typo, minor alignment, color slightly off, edge case UI glitch |
