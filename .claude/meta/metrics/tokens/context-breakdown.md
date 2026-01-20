# Context Consumption Breakdown

## Where Context Goes (Average Session)

| Category | % | Est. Tokens | Reducible? |
|----------|---|-------------|------------|
| System + Tools | ~15% | ~30k | No (fixed) |
| Standards/Guides | ~8% | ~16k | Yes (modular) |
| Learnings | ~4% | ~8k | Yes (modular) |
| File Reads | ~18% | ~36k | Partially |
| Conversation | ~35% | ~70k | Grows with turns |
| Agent Responses | ~12% | ~24k | Depends on usage |
| Buffer | ~8% | ~16k | Reserved |

## Improvement from Modularization

| Metric | Before (v1) | After (v2) | Savings |
|--------|-------------|------------|---------|
| Standards/Guides | ~22% | ~8% | 14% |
| Learnings | ~8% | ~4% | 4% |
| **Total** | ~30% | ~12% | **18%** |

## Top File Reads (Last 5 Sessions)

| File | Total Reads | Total Tokens | Redundant? |
|------|-------------|--------------|------------|
| - | - | - | - |

## Recommendations

(Add based on actual usage patterns)

## How to Update

Track files read in meta/session/CURRENT.md during session.
Aggregate to this file at /end-session.
