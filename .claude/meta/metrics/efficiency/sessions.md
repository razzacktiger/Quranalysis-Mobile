# Per-Session Metrics

## Recent Sessions

| Date | Epic | Tasks | Tokens | Context% | Turns | Duration | Notes |
|------|------|-------|--------|----------|-------|----------|-------|
| 01-21 | 4 | 1 | 15k | ~25% | 12 | ~45m | Setup session, Firebase config + user account setup time |
| 01-21 | 4 | 1+meta | 40k | ~50% | 20 | ~1.5h | Task 4.1.1 + agent orchestration system design |
| 01-24 | 4 | 1+meta | ~8k | ~10% | 15 | ~30m | Task 4.3.4 + /start-session workflow, EPIC-4 complete, PR #7 |

## Session Averages

| Metric | Value | Target |
|--------|-------|--------|
| Tasks per session | - | 5-8 |
| Tokens per session | - | < 150k |
| Max context reached | - | < 70% |
| Avg tokens per task | - | < 10k |

## Session Efficiency

| Rating | Criteria |
|--------|----------|
| Excellent | 6+ tasks, <120k tokens, no blockers |
| Good | 4-5 tasks, <150k tokens |
| Fair | 3 tasks, or context issues |
| Poor | <3 tasks, or major blockers |

## Session History

(Add notable sessions with lessons learned)

## Duration Tracking

**Session-level:** User provides at /end-session (actual wall-clock time)

**Per-task estimate:** Use turns as proxy
- ~2-3 min per turn for focused work
- 10 turns ≈ 20-30 min
- Add 5 min for /complete-task overhead

**Formula:** `duration_minutes ≈ turns * 2.5 + 5`

## How to Update

At /end-session:
1. Ask user for session duration (or estimate from turns)
2. Add row to Recent Sessions
3. Recalculate averages
4. Note any lessons learned
