# Red Signals - Action Required

## Current Red Signals

| Signal | Evidence | Priority | Action |
|--------|----------|----------|--------|
| - | - | - | - |

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

(Specific incidents requiring immediate attention)

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
