# Metrics System

## Recording Guide

**During Task:** Update `meta/session/CURRENT.md`
- Track tokens, turns, tools used
- Note files read (avoid redundant reads)
- Record bugs caught and by whom

**At /complete-task:** Agent records to:
- `tokens/recent-tasks.md` - Add row for task

**At /end-session:** Agent aggregates to:
- `tokens/by-size.md` - Update averages
- `tokens/by-type.md` - Update by task type
- `tools/frequency.md` - Update counts
- `efficiency/sessions.md` - Add session summary
- `signals/*.md` - Check for red flags

## Metrics Navigation

| Question | File |
|----------|------|
| Why did this task cost so much? | tokens/recent-tasks.md, tokens/by-type.md |
| What's our context budget? | tokens/context-breakdown.md |
| Are agents worth the cost? | tools/agents.md |
| Where are bugs from? | quality/bugs-by-stage.md |
| What patterns are wasteful? | tools/waste.md |
| What should we improve? | signals/recommendations.md |

## File Index

### Tokens
- `recent-tasks.md` - Last 20 tasks detailed
- `by-size.md` - S/M/L/XL averages
- `by-type.md` - UI/API/DB/Test averages
- `context-breakdown.md` - Where context goes

### Conversation
- `turns.md` - Turn analysis
- `revision-requests.md` - User corrections
- `red-flags.md` - Problematic patterns

### Tools
- `frequency.md` - Tool call counts
- `agents.md` - Agent usage + ROI
- `sequences.md` - Common tool patterns
- `waste.md` - Optimization opportunities

### Quality
- `bugs-by-stage.md` - When bugs caught
- `bug-categories.md` - Types of bugs
- `rework.md` - Revision analysis

### Efficiency
- `sessions.md` - Per-session metrics
- `epics.md` - Per-epic summaries
- `trends.md` - Historical trends

### Signals
- `green.md` - What's working
- `yellow.md` - Needs attention
- `red.md` - Action required
- `recommendations.md` - Prioritized improvements
