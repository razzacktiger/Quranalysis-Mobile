# Workflow Changelog

## [v2.1.0] - 2026-01-22

### Added
- `/add-bug` - Log bugs to feature BUGS.md files
- `/fix-bug` - Dedicated bug-fixing workflow
- Bug severity levels (1-4) with completion blocking for 1-2
- BUGS.md template for per-feature bug tracking
- Session archiving to `meta/session/archive/YYYY-MM-DD-N.md`
- Overhead tracking column in recent-tasks.md
- Meta task type for workflow/docs work
- Duration estimation formula (turns * 2.5 + 5 min)
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
