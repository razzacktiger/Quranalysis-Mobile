# Agent Usage Analysis

## Usage Summary

| Agent | Invocations | Avg Tokens | Total Cost | Value Score |
|-------|-------------|------------|------------|-------------|
| code-reviewer | 1 | ~2.1k | 2.1k | High (4 bugs) |
| code-explorer | 0 | ~3.8k | 0 | - |
| code-architect | 0 | ~2.9k | 0 | - |
| frontend-design | 0 | ~4.2k | 0 | - |

## ROI Analysis

### code-reviewer
- **Investment:** 2.1k tokens
- **Bugs caught:** 4
- **Cost if found at QA:** 32k (8k per bug)
- **Net savings:** ~29.9k tokens
- **Quality benefit:** Caught missing error handling, config validation, code duplication, missing docs
- **Verdict:** Essential for M/L/XL tasks

### code-explorer
- **Investment:** - tokens
- **Wrong implementations avoided:** -
- **Net savings:** -
- **Verdict:** Use for unfamiliar areas only

### frontend-design
- **Investment:** - tokens
- **Revision requests avoided:** -
- **Quality benefit:** Higher UI polish
- **Verdict:** Use for user-facing components

### code-architect
- **Investment:** - tokens
- **Benefit:** Better structure for complex features
- **Verdict:** Use for L/XL tasks

## Recommendations

(Add based on actual usage data)

## How to Update

Track agent invocations in session/CURRENT.md.
Update ROI calculations at /end-session.
