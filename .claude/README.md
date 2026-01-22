# Claude Code Workflow - Quranalysis Mobile

**Version:** 2.0.0 | [Changelog](meta/CHANGELOG.md)

## Quick Start
1. `/clear` - Fresh session
2. `/start-epic N-name` - Begin epic
3. `/next-task` - Continue work
4. `/complete-task` - Commit with review
5. `/end-session` - Save state

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
