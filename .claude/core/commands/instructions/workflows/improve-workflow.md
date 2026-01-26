---
description: Analyze metrics and improve workflow based on data
---

# Improve Workflow

Analyze workflow metrics and propose data-driven improvements.

## Step 1: Gather Data
Read these sources:
- `state/metrics.json` (primary metrics source)
- `meta/IMPROVEMENT-BACKLOG.md`

From `state/metrics.json`, extract:
- `signals.red` - active red flags
- `signals.yellow` - warning signals
- `signals.green` - positive patterns
- `sessions.recent` - recent session performance
- `sessions.averages` - baseline metrics
- `by_task_type` and `by_task_size` - efficiency data
- `quality` - bug patterns

## Step 2: Analyze Metrics

Check for issues:

### Token Analysis
From `state/metrics.json`:
- `by_task_size`: Are tasks exceeding budgets?
- `by_task_type`: Which task types cost most?
- `sessions.averages.tokens_per_task`: Trending up or down?

### Quality Analysis
From `state/metrics.json` `quality`:
- `bugs_by_stage`: Are bugs slipping through?
- `bugs_by_severity`: High severity bug rate?

### Efficiency Analysis
From `state/metrics.json` `sessions`:
- `averages.tasks_per_session`: Meeting targets?
- `averages.tokens_per_session`: Trending?

### Tool Analysis
From `state/metrics.json` `tools`:
- `agents`: Agent ROI positive?

## Step 3: Generate Insights
Compare current vs targets:
- Tasks/session: actual vs 5-8 target
- Context at start: actual vs <20% target
- Bugs at QA: actual vs 0 target
- Tokens/task: actual vs <10k target

## Step 4: Prioritize Improvements
Rank by:
- **Impact:** High/Medium/Low
- **Effort:** S/M/L
- **Confidence:** Data-backed?

## Step 5: Propose Changes
Ask user:
"Based on metrics, I recommend:
1. [High impact] ...
2. [Quick win] ...
3. [Data suggests] ...

Which should we implement?"

## Step 6: Implement Approved Changes
For each approved change:
1. Make changes to relevant files
2. Update meta/CHANGELOG.md
3. Update meta/VERSION.md if significant

## Step 7: Update State
- Clear resolved signals from `state/metrics.json`
- Add new baselines to `sessions.averages`
- Update `meta/IMPROVEMENT-BACKLOG.md`:
  - Mark implemented items as done
  - Add new ideas discovered

## Step 8: Report
"Workflow updated to vX.Y.Z"
Show:
- Changes made
- New baselines set
- Expected impact
- State files updated

## When to Run
- **Automatic trigger:** Red flag detected at /end-session
- **Periodic:** Every 3 epics
- **Manual:** User runs /improve-workflow

## Example Output
```
## Improvement Analysis

### Red Flags (from state/metrics.json)
- Revision rate 0.8/task (target: <0.3)

### Recommendations
1. [High] Enhance /spec-feature with UI placement questions
   - Impact: -50% revisions
   - Effort: S

2. [Medium] Add UI component templates
   - Impact: -20% tokens on UI tasks
   - Effort: M

### Implemented
- Added UI placement questions to spec-feature

### Updated
- state/metrics.json (cleared resolved signals)
- meta/CHANGELOG.md
- VERSION.md: v2.0.0 -> v2.0.1
```
