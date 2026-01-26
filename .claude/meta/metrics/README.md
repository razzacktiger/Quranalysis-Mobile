# Metrics System (v3.0)

**IMPORTANT: Metrics are now stored in `state/metrics.json`**

This directory structure is preserved for historical reference but all active metrics data is managed through the JSON state file.

## Current System

All metrics are stored in: `.claude/state/metrics.json`

### Accessing Metrics

```typescript
// Via state-manager (recommended)
import {
  getMetrics,
  updateMetrics,
  recordTaskMetrics,
  addSignal,
} from "../../core/lib/state-manager";

// Get all metrics
const metrics = getMetrics();

// Record task completion
recordTaskMetrics("4.1.2", {
  tokens: 10000,
  turns: 5,
  tools: 15,
  agent: "prompt-agent",
  overhead: 2000,
});

// Add a signal
addSignal("yellow", "Context >50% at session end");
```

### Schema Reference

See `.claude/schemas/metrics.schema.json` for the full schema definition.

### Key Data Points

- **sessions.recent**: Last 20 session summaries
- **sessions.averages**: Rolling averages for benchmarking
- **by_task_type**: Performance by task type (UI, API, Test, Setup)
- **by_task_size**: Performance by task size (S, M, L, XL)
- **tools.agents**: Agent usage and effectiveness
- **quality**: Bug tracking by stage and severity
- **signals**: Red/yellow/green indicators

## Legacy Structure (Archived)

The original markdown-based metrics system used these directories:

- `tokens/` - Token usage tracking
- `efficiency/` - Session efficiency metrics
- `tools/` - Tool usage patterns
- `signals/` - Red/yellow/green flags
- `quality/` - Bug and rework tracking
- `conversation/` - Conversation metrics

All this data has been migrated to `state/metrics.json`.

## Migration Notes

If you need to add new metrics:

1. Update `core/schemas/metrics.schema.json` with new fields
2. Update `core/lib/state-manager.ts` with accessor functions
3. Update command instructions to use new metrics

Do NOT create new markdown files in this directory.
