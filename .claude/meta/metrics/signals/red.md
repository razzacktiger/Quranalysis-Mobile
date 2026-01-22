# Red Signals - Action Required

## Current Red Signals

| Signal | Evidence | Priority | Action |
|--------|----------|----------|--------|
| Context exhaustion during bug fixes | Task 4.2.3: 6 bugs found during testing required extensive fixing, exhausted context mid-task | High | Split bug-fix sessions; test earlier; use code-reviewer proactively |

## Red Flag Thresholds

| Metric | Red When | Action |
|--------|----------|--------|
| Tasks per session | < 2 | Review blockers |
| Tokens per task | > 20k avg | Split tasks |
| Revision rate | > 1/task | Improve specs urgently |
| Bugs at QA | > 2/epic | Mandatory code-reviewer |
| Context at start | > 35% | Reduce loaded docs |
| Same error 3x | In one session | Stop, check learnings |

## Active Incidents

### 2026-01-22: Task 4.2.3 Context Exhaustion

**Task:** 4.2.3 - Confirmation Screen (Size: L)
**Bug Count:** 6 bugs discovered during user testing

| # | Bug Type | Description | Cause |
|---|----------|-------------|-------|
| 1 | Business Logic | isReadyToSave only checked portions, not mistakes | Incomplete requirement analysis |
| 2 | Business Logic | Subcategory picker allowed invalid category combinations | Missing validation mapping |
| 3 | UX/Logic | Couldn't edit "Unknown" mistake portion to correct surah | Missing editable prop |
| 4 | Integration | pages_read DB constraint violation (requires >= 1) | Default value mismatch |
| 5 | Data Handling | Session timestamp captured date only, not time | Wrong date format function |
| 6 | Code Quality | console.log statements left in production code | Missed cleanup |

**Root Causes:**
- Testing happened after full implementation, not incrementally
- No code-reviewer agent run before user testing
- Complex UI task (4 new components) with many edge cases

**Recommended Actions:**
1. Run code-reviewer agent after implementing each component (not just at end)
2. Test business logic incrementally during implementation
3. Consider splitting L-size UI tasks into smaller chunks
4. Add DB constraint checks to learnings

## Resolution History

| Signal | Date Added | Date Resolved | Resolution |
|--------|------------|---------------|------------|
| - | - | - | - |

## Escalation Protocol

1. Red signal detected at /end-session
2. Add to Current Red Signals
3. Create action item in IMPROVEMENT-BACKLOG.md
4. Address before next session if possible
5. Move to yellow when improving
6. Move to green when resolved

## How to Update

At /end-session:
1. Check all red thresholds
2. Add any new red signals
3. Update resolution progress
4. Escalate if not improving
