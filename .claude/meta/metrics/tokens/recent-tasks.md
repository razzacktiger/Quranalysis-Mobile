# Token Metrics - Recent Tasks

Last 20 tasks with full breakdown.

| Date | Task | Epic | Size | Type | Tokens | Turns | Tools | Agent | Overhead | Notes |
|------|------|------|------|------|--------|-------|-------|-------|----------|-------|
| 01-21 | 4.1.1 | 4 | M | API | 15k | 12 | 35 | code-reviewer | ~2k | Firebase AI setup, polyfill needed |
| 01-21 | 4.1.2 | 4 | L | API | 18k | 15 | 25 | prompt-agent | ~1k | Session extraction, parallel with 4.3.1 |
| 01-21 | 4.3.1 | 4 | M | Setup | 3k | 5 | 12 | setup-agent | ~1k | expo-speech-recognition, parallel with 4.1.2 |
| 01-21 | 4.1.3 | 4 | L | API | 8k | 6 | 10 | direct | ~1k | Mistake extraction, combined schema, 7 tests pass |
| 01-22 | BUG-3.1 | 3 | M | Bug | 8k | 6 | 15 | direct | ~3k | Dashboard heatmap date format mismatch |
| 01-22 | meta:workflow | - | M | Meta | 12k | 8 | 20 | direct | - | Bug tracking system, workflow checklists |

## Task Types

| Type | Description | Examples |
|------|-------------|----------|
| API | Backend/service code | Hooks, API clients, prompts |
| UI | Components, screens | React Native components |
| Setup | Configuration | Firebase, libraries |
| Test | Testing | E2E, unit tests |
| Bug | Bug fix | BUG-X.X.X entries |
| Meta | Workflow/docs | Status updates, learnings, workflow improvements |

## Overhead Column

Tracks the "completion tax" - tokens spent on:
- Running /complete-task checklist
- Updating status/CURRENT.md
- Updating meta/session/CURRENT.md
- Adding to learnings/*.md
- Updating BUGS.md (for bugs)

**Target:** Overhead should be <20% of task tokens

## Summary Stats
- Average task: ~10k tokens
- Average overhead: ~2k tokens (~20%)
- Highest: 18k (4.1.2 - L size prompt work)
- Lowest: 3k (4.3.1 - setup task)

## How to Update

At /complete-task, add a row:
```
| 01-22 | 4.2.5 | 4 | M | Test | 10k | 8 | 20 | test-agent | ~2k | E2E tests for chat |
```

Fields:
- Date: MM-DD
- Task: Task ID or BUG-X.X.X or meta:description
- Epic: Epic number (- for meta tasks)
- Size: S/M/L/XL
- Type: API/UI/Setup/Test/Bug/Meta
- Tokens: Total tokens (k)
- Turns: Number of conversation turns
- Tools: Tool calls
- Agent: Agent used (or "direct" for no agent)
- Overhead: Tokens for completion work (~Xk)
- Notes: Brief description
