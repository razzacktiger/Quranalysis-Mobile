# Yellow Signals - Needs Attention

## Current Yellow Signals

| Signal | Evidence | Action |
|--------|----------|--------|
| - | - | - |

## Metrics Approaching Limits

| Metric | Target | Current | Warning At |
|--------|--------|---------|------------|
| Tasks per session | 5-8 | - | < 4 |
| Tokens per task | < 10k | - | > 12k |
| Revision rate | < 0.3 | - | > 0.5 |
| Context at start | < 20% | - | > 25% |

## Patterns to Watch

### Increasing Token Usage
**Watch for:** Average tokens/task increasing over time
**Action:** Review recent tasks, identify causes

### Rising Revision Rate
**Watch for:** More "no I meant..." responses
**Action:** Improve specs, ask more questions

### Frequent Context Issues
**Watch for:** Sessions hitting 70%+ early
**Action:** Review what's being loaded

## How to Update

At /end-session:
1. Check metrics against warning thresholds
2. Add new yellow signals
3. Move to green when resolved
4. Move to red if worsening
