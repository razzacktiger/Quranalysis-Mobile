# Workflow Changelog

## [v3.0.1] - 2026-01-25

### Changed

- All 16 command instruction files updated to reference JSON state files
- Removed explicit references to deprecated markdown state files

### Removed

- 21 redundant markdown metrics files (data migrated to state/metrics.json)
- 5 session archive markdown files (session archives now JSON)
- 4 status archive markdown files (status now in state/project.json)

### Fixed

- Command instructions now consistently reference state/\*.json files
- No more conflicting references between JSON schemas and markdown instructions

---

## [v3.0.0] - 2026-01-25

### Added

- `state/` - JSON-based state storage for all dynamic data
  - `project.json` - Current work status (replaces status/CURRENT.md)
  - `session.json` - Active session metrics (replaces meta/session/CURRENT.md)
  - `tasks.json` - All tasks across all epics (replaces TASKS.md files)
  - `bugs.json` - All bugs across all features (replaces BUGS.md files)
  - `metrics.json` - Aggregated metrics (replaces meta/metrics/\*_/_.md)
  - `learnings-index.json` - Searchable learnings index
- `schemas/` - JSON Schema definitions for all state files
- `core/lib/state-manager.ts` - Centralized state access utility with typed functions
- `commands/schemas/` - JSON schemas for all 16 workflow commands
- Hybrid command format (JSON schema + markdown instructions)
- Multi-agent support with queryable JSON state
- Learnings search by category, tag, or text

### Changed

- All commands now read/write JSON state instead of markdown tables
- Command files reorganized: `commands/instructions/` for markdown
- README completely rewritten for v3.0 architecture
- State manager provides typed CRUD operations for all collections

### Removed

- `status/CURRENT.md` (migrated to state/project.json)
- `meta/session/CURRENT.md` (migrated to state/session.json)
- All `meta/metrics/**/*.md` files (migrated to state/metrics.json)
  - tokens/recent-tasks.md, by-size.md, by-type.md, context-breakdown.md
  - efficiency/sessions.md, epics.md, trends.md
  - tools/agents.md, frequency.md, sequences.md, waste.md
  - signals/red.md, yellow.md, green.md, recommendations.md
  - quality/bugs-by-stage.md, bug-categories.md, rework.md
  - conversation/turns.md, revision-requests.md, red-flags.md
- `meta/session/archive/*.md` (session archives now in state/archive/)
- `status/archive/*.md` (epic status now in state/project.json)
- All command instruction markdown references to old state files updated

### Preserved (Not Removed)

- Epic README.md files (contain specification information)
- TASKS.md files in epics (contain detailed acceptance criteria)
- BUGS.md files in epics (contain root cause analysis)
- All learnings/\*.md files (content files, indexed by learnings-index.json)
- All guides, standards, reference documentation

### Rationale

- **Multi-agent support**: JSON format enables consistent querying across Claude, Cursor, and custom scripts
- **Schema validation**: JSON Schemas ensure data integrity
- **Fast queries**: Filter tasks/bugs by any field without parsing markdown
- **Abstraction layer**: State manager centralizes all state operations
- **Searchable learnings**: Index enables semantic search by tag/category

### Migration Notes

- Data from markdown files has been migrated to JSON state files
- Original markdown files can be kept for reference or removed
- Commands automatically use new JSON format
- State manager utility available for custom integrations

## [v2.1.0] - 2026-01-22

### Added

- `/add-bug` - Log bugs to feature BUGS.md files
- `/fix-bug` - Dedicated bug-fixing workflow
- Bug severity levels (1-4) with completion blocking for 1-2
- BUGS.md template for per-feature bug tracking
- Session archiving to `meta/session/archive/YYYY-MM-DD-N.md`
- Overhead tracking column in recent-tasks.md
- Meta task type for workflow/docs work
- Duration estimation formula (turns \* 2.5 + 5 min)
- MANDATORY Completion Checklist in /complete-task and /fix-bug

### Changed

- `/complete-task` - Now handles both tasks and bugs, explicit file update reporting
- `/fix-bug` - Clarified: implements fix only, /complete-task handles commit
- `/end-session` - Archives session before reset, provides archive path
- `/start-epic` - Added `--bugs` flag for bug-fixing mode
- `/next-task` - Checks for blocking bugs before proceeding
- README - Added session management and metrics tracking sections

### Fixed

- Post-completion updates (learnings, session meta) no longer skipped
- Session file now properly archives instead of accumulating indefinitely

### Rationale

- Bug tracking: Organized method to track and fix bugs per feature
- Completion guarantees: Mandatory checklist ensures nothing is skipped
- Historical preservation: Session archives preserve work history
- Overhead visibility: Track the "completion tax" separately

## [v2.0.0] - 2026-01-20

### Added

- `guides/` - 7 modular workflow guides
- `standards/` - 8 modular coding standards
- `learnings/` - 8 categorized issue patterns
- `status/` - Modular status with archive
- `meta/` - Self-improvement system
- `meta/metrics/` - Comprehensive metrics tracking
- `/research-tech` - Technology evaluation skill
- `/spec-feature` - Feature specification skill
- `/create-epic` - Epic creation skill
- `/improve-workflow` - Self-improvement skill
- `/refactor-check` - Code quality skill
- Epic -> Feature -> Task hierarchy
- Archived epic reopening capability

### Changed

- `/complete-task` - Added code-reviewer, metrics recording
- `/end-session` - Added friction capture, metrics finalization
- `/next-task` - Added smart loading based on task type
- `/start-epic` - Added agent usage planning

### Removed

- `AGENT-WORKFLOW-GUIDE.md` (split into guides/)
- `CODE-STANDARDS.md` (split into standards/)
- `LEARNINGS.md` (split into learnings/)
- `STATUS.md` (replaced by status/ folder)

### Rationale

- Context reduction: ~25-30% savings
- Data-driven improvement: Comprehensive metrics
- Better organization: Hierarchical structure
- Quality gates: code-reviewer integration
- Self-improvement: Meta-workflow system
