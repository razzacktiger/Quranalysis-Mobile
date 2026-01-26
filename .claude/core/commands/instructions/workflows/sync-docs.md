---
description: Verify and update cross-references across all documentation
---

# Sync Docs

Verify and update all cross-references in .claude documentation. Run this after structural changes (epic refactoring, feature additions, etc.) or periodically to catch drift.

## When to Run

- After refactoring epic/feature structure
- After archiving or creating epics
- After significant workflow changes
- When you suspect references are stale
- As part of `/end-session` if structural changes were made

## Step 1: Scan Current Structure

Build an inventory of the actual structure:

```bash
# List all epics (active and archived)
find .claude/epics -name "README.md" -type f

# List all features
find .claude/epics -type d -name "features" -exec ls {} \;
```

Create a mental map:
```
epics/
├── active/
│   ├── EPIC-4-AI-CHAT/
│   └── EPIC-5-PROFILE/
└── archive/
    ├── EPIC-0-SETUP/
    ├── EPIC-1-AUTH/
    ├── EPIC-2-SESSIONS/
    └── EPIC-3-DASHBOARD/
```

## Step 2: Check REQUIREMENTS.md

Read `.claude/REQUIREMENTS.md` and verify:

### Epic Links Section
Look for the "Epics (in order)" or similar section. Verify each link:

**Expected format:**
```markdown
### Epics (in order)
| Epic | Status | Location |
|------|--------|----------|
| EPIC-0: Setup | Archived | [epics/archive/EPIC-0-SETUP/](./epics/archive/EPIC-0-SETUP/) |
| EPIC-4: AI Chat | Complete | [epics/active/EPIC-4-AI-CHAT/](./epics/active/EPIC-4-AI-CHAT/) |
| EPIC-5: Profile | Not Started | [epics/active/EPIC-5-PROFILE/](./epics/active/EPIC-5-PROFILE/) |
```

**Check for:**
- [ ] Links point to existing directories
- [ ] Status matches epic README status
- [ ] No references to old flat file paths (e.g., `./epics/EPIC-0-SETUP.md`)

### Quick Links Section
Verify all document paths in the Quick Links table exist.

### Update if needed
Fix any broken links or outdated paths.

## Step 3: Check .claude/README.md

Read `.claude/README.md` and verify:

### Directory Index
- [ ] All listed folders exist
- [ ] Descriptions are accurate
- [ ] No missing important directories

### State Files Reference
- [ ] All state files listed in `state/` section exist
- [ ] Schema references are correct
- [ ] Examples are up-to-date

### Skills Reference
- [ ] All listed skills exist in commands/
- [ ] No deprecated skills listed

## Step 4: Verify State Consistency

Check `state/project.json` against reality:
- [ ] `progress` epic counts match actual task counts in `state/tasks.json`
- [ ] `active.epic_id` points to a real epic
- [ ] `blockers` reference valid bug IDs (if any)

Check `state/tasks.json`:
- [ ] All `epic_id` values reference existing epics
- [ ] All `feature_id` values are valid
- [ ] Task counts per epic match `state/project.json` progress totals

Check `state/bugs.json`:
- [ ] All `epic_id` and `feature_id` values are valid
- [ ] Open bugs with severity 1-2 are reflected in project blockers

## Step 5: Check Epic READMEs

For each epic README, verify:

### Feature Table
```markdown
| ID | Feature | Status | Tasks |
|----|---------|--------|-------|
| N.1 | Name | Status | X |
```

**Check:**
- [ ] Task counts match what's in `state/tasks.json` for that feature
- [ ] Status reflects actual completion state

## Step 6: Check specs/ References

If `specs/` folder exists with research or feature specs:
- [ ] Any epic references in specs point to correct locations
- [ ] Research docs referenced in epic READMEs exist

## Step 7: Generate Report

Provide a summary:

```markdown
## Sync Docs Report

**Scanned:** {timestamp}

### Files Checked
- .claude/REQUIREMENTS.md
- .claude/README.md
- {N} epic READMEs
- state/project.json
- state/tasks.json
- state/bugs.json

### Issues Found
- [ ] {file}: {issue description}
- [ ] {file}: {issue description}

### Fixed
- {file}: {what was fixed}

### Manual Review Needed
- {item requiring human decision}

### Status
✅ All references valid | ⚠️ {N} issues found and fixed | ❌ {N} issues need attention
```

## Step 8: Update Changelog (if fixes made)

If any references were updated, add entry to `meta/CHANGELOG.md`:

```markdown
## [Unreleased]

### Fixed
- Updated stale references in REQUIREMENTS.md (epic paths)
- Fixed task count mismatch in EPIC-X README
- Synced state/project.json progress with state/tasks.json
```

## Quick Checklist

For a quick manual check without full scan:

```markdown
## Reference Quick Check

### Critical Paths
- [ ] REQUIREMENTS.md epic links work
- [ ] README.md folder references valid
- [ ] state/project.json epic reference correct
- [ ] Active epic READMEs have accurate task counts

### State Consistency
- [ ] state/tasks.json epic_ids are valid
- [ ] state/bugs.json epic_ids are valid
- [ ] state/project.json progress matches task counts

### Common Drift Points
- Epic paths after archiving (active/ → archive/)
- Task counts after adding/completing tasks
- Bug severity updates not reflected in project blockers
- Skill references after command renames
```

## Integration with Other Commands

This command is called by:
- `/end-session` (optional, if structural changes made)
- `/improve-workflow` (as part of health check)

This command should be run after:
- `/create-epic`
- Archiving an epic
- Major refactoring
