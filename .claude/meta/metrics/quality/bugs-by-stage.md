# Bug Detection By Stage

## Where Bugs Get Caught

| Stage | Bugs Found | Avg Fix Cost | % of Total |
|-------|------------|--------------|------------|
| Self-caught (impl) | 0 | ~1.2k | 0% |
| TypeScript | 0 | ~0.5k | 0% |
| code-reviewer | 4 | ~1.8k | 100% |
| Jest tests | 0 | ~1.5k | 0% |
| E2E tests | 0 | ~2.8k | 0% |
| Human QA | 0 | ~8k | 0% |

## Cost Analysis

| Stage | Bug Cost Formula | Total |
|-------|------------------|-------|
| Early (impl+TS) | bugs x 0.85k | - |
| Mid (reviewer+jest) | bugs x 1.65k | - |
| Late (E2E) | bugs x 2.8k | - |
| QA | bugs x 8k | - |

## Trend Over Epics

```
Bugs at Human QA:
EPIC-1: (not tracked)
EPIC-2: (not tracked)
EPIC-3: (not tracked)
EPIC-4: (tracking starts)
```

## ROI of Early Detection
- Bug at QA costs: ~8k tokens
- Bug at reviewer costs: ~1.8k tokens
- Savings per bug: ~6.2k tokens
- Reviewer cost: ~2.1k tokens
- Net savings per bug caught: ~4.1k tokens

## How to Update

When a bug is caught:
1. Note the stage
2. Note the fix cost
3. Update counts
