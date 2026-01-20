# Conversation Metrics - Turns

## Turn Statistics

| Metric | Value | Trend | Target |
|--------|-------|-------|--------|
| Avg turns per task | - | - | < 3 |
| Turns to first working code | - | - | < 2 |
| Revision requests per task | - | - | < 0.5 |
| Clarification questions per task | - | - | < 0.5 |

## Turn Breakdown by Outcome

| Turn Type | Frequency | Avg Token Cost | Avoidable? |
|-----------|-----------|----------------|------------|
| Implementation | - | - | No |
| Bug fix (self-caught) | - | - | Partially |
| User revision request | - | - | Yes - better specs |
| Clarification Q&A | - | - | Yes - clearer reqs |
| Test adjustment | - | - | Partially |

## Turns by Task Size

| Size | Avg Turns | Expected |
|------|-----------|----------|
| S | - | 1-2 |
| M | - | 2-4 |
| L | - | 4-6 |
| XL | - | 6-8 |

## How to Update

At /end-session, calculate averages from session tasks.
