---
description: Analyze metrics and improve workflow based on data
---

# Improve Workflow

Analyze workflow metrics and propose data-driven improvements.

## Step 1: Gather Data
Read these files:
- meta/IMPROVEMENT-BACKLOG.md
- meta/metrics/signals/red.md
- meta/metrics/signals/yellow.md
- meta/metrics/signals/recommendations.md
- meta/metrics/efficiency/trends.md
- status/archive/*.md (recent epics)

## Step 2: Analyze Metrics
Check for issues:

### Token Analysis
- tokens/by-size.md: Are tasks exceeding budgets?
- tokens/by-type.md: Which task types cost most?
- tokens/context-breakdown.md: Where is context going?

### Quality Analysis
- quality/bugs-by-stage.md: Are bugs slipping through?
- quality/rework.md: High rework rate?

### Conversation Analysis
- conversation/turns.md: Too many turns?
- conversation/revision-requests.md: High revision rate?

### Tool Analysis
- tools/agents.md: Agent ROI positive?
- tools/waste.md: Avoidable waste identified?

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
Use AskUserQuestion:
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

## Step 7: Update Backlog
- Mark implemented items as done
- Add new ideas discovered
- Update baselines in metrics

## Step 8: Report
"Workflow updated to vX.Y.Z"
Show:
- Changes made
- New baselines set
- Expected impact

## When to Run
- **Automatic trigger:** Red flag detected at /end-session
- **Periodic:** Every 3 epics
- **Manual:** User runs /improve-workflow

## Example Output
```
## Improvement Analysis

### Red Flags
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
- meta/CHANGELOG.md
- VERSION.md: v2.0.0 -> v2.0.1
```
