# Bug Detection By Stage

## Where Bugs Get Caught

| Stage | Bugs Found | Avg Fix Cost | % of Total |
|-------|------------|--------------|------------|
| Self-caught (impl) | - | ~1.2k | - |
| TypeScript | - | ~0.5k | - |
| code-reviewer | - | ~1.8k | - |
| Jest tests | - | ~1.5k | - |
| E2E tests | - | ~2.8k | - |
| Human QA | - | ~8k | - |

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
