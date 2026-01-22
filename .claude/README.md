# Claude Code Workflow - Quranalysis Mobile

**Version:** 2.1.0 | [Changelog](meta/CHANGELOG.md)

## Quick Start
1. `/clear` - Fresh session
2. `/start-epic N-name` - Begin epic (initializes session tracking)
3. `/next-task` - Continue work
4. `/complete-task` - Commit with review + **mandatory checklist** (status, metrics, learnings)
5. `/end-session` - Archive session + aggregate metrics

## Directory Index

| Folder | Purpose | When to Read |
|--------|---------|--------------|
| [guides/](guides/) | Workflow guides | Session start, debugging |
| [standards/](standards/) | Coding standards | Before implementing |
| [learnings/](learnings/) | Issue patterns | When stuck |
| [status/](status/) | Project status | Session start |
| [epics/](epics/) | Epic/Feature/Task specs | Task implementation |
| [specs/](specs/) | Feature specs & research | Planning new features |
| [meta/](meta/) | Metrics & self-improvement | End of session |
| [commands/](commands/) | Skill definitions | Reference |
| [reference/](reference/) | Types, enums, patterns | Implementation |

## Context-Efficient Reading

**Session Start:** Read only status/CURRENT.md (~30 lines)

**By Task Type:**
- UI: standards/components.md, standards/styling.md
- API: standards/api-patterns.md
- Test: standards/testing.md
- DB: reference/API-PATTERNS.md

**When Stuck:** learnings/index.md -> specific category

## Skills Reference

| Skill | Purpose |
|-------|---------|
| /start-epic | Begin epic with branch setup |
| /start-epic N --bugs | Start bug-fixing mode for an epic |
| /next-task | Continue to next task |
| /complete-task | Commit with code review |
| /add-bug | Log a bug for tracking |
| /fix-bug | Start fixing bugs for a feature |
| /end-session | Save state and metrics |
| /research-tech | Research technology options |
| /spec-feature | Create feature specification |
| /create-epic | Convert spec to epic |
| /improve-workflow | Analyze and improve workflow |
| /refactor-check | Scan for code quality issues |
| /run-workflow | Execute a saved workflow |

## Common Workflows

| Workflow | Guide | When to Use |
|----------|-------|-------------|
| **Revise Epic** | [guides/epic-revision-workflow.md](guides/epic-revision-workflow.md) | Reconsider technologies, restructure epic |
| **New Feature** | /research-tech → /spec-feature → /create-epic | Planning from scratch |
| **Continue Work** | /start-epic → /next-task (repeat) → /end-session | Daily development |
| **Bug Fixing** | /add-bug → /start-epic N --bugs → /fix-bug → /complete-task | Dedicated bug sessions |
| **Ad-hoc Bug** | /add-bug → (fix immediately or defer) | Found bug during development |

### Loading a Workflow

In a new session after `/clear`:
```
Read guides/epic-revision-workflow.md and help me revise EPIC-4
```

## Session Management

**Session = one Claude conversation (until `/clear`)**

| File | Purpose | Lifecycle |
|------|---------|-----------|
| `status/CURRENT.md` | Project state (epic, task, progress) | Persists across sessions |
| `meta/session/CURRENT.md` | Current conversation metrics | Resets on `/end-session` |
| `meta/session/archive/` | Archived sessions | One file per session |

**Flow:**
```
/start-epic → Init CURRENT.md
    ↓
Work → Rows added to session table
    ↓
/complete-task → Commit + update metrics + capture learnings
    ↓
/end-session → Archive to YYYY-MM-DD-N.md → Reset CURRENT.md
    ↓
/clear → Ready for next session
```

## Metrics Tracking

| Metric | Tracked In | Per-Task | Per-Session |
|--------|------------|----------|-------------|
| Tokens | recent-tasks.md | ✅ | ✅ |
| Turns | recent-tasks.md | ✅ | ✅ |
| Overhead | recent-tasks.md | ✅ | - |
| Duration | sessions.md | estimate | ✅ (user provides) |
| Bugs caught | session/CURRENT.md | ✅ | ✅ |

**Overhead:** The "completion tax" - tokens spent on /complete-task checklist (~1-3k)

**Duration estimate:** `turns * 2.5 + 5 min`
