# Meta - Workflow Self-Improvement

## Quick Access

| Need              | Location                                                        |
| ----------------- | --------------------------------------------------------------- |
| Current session   | `meta/session/CURRENT.md` (view) or `state/session.json` (data) |
| What's working    | `state/metrics.json` → `signals.green`                          |
| Action needed     | `state/metrics.json` → `signals.red`                            |
| Improvement ideas | `IMPROVEMENT-BACKLOG.md`                                        |

## Metrics Navigation

| Question                   | Read                                                  |
| -------------------------- | ----------------------------------------------------- |
| Why did task cost so much? | `state/metrics.json` → `by_task_type`, `by_task_size` |
| Are agents worth it?       | `state/metrics.json` → `tools.agents`                 |
| Where are bugs from?       | `state/metrics.json` → `quality.bugs_by_stage`        |
| What should we improve?    | `state/metrics.json` → `signals`                      |

## Data Flow

```
state/project.json  ──→  status/CURRENT.md (human-readable view)
state/session.json  ──→  meta/session/CURRENT.md (human-readable view)
state/metrics.json  ──→  All metrics data consolidated
state/tasks.json    ──→  Task definitions and status
state/bugs.json     ──→  Bug tracking
```

## Recording

- During task: Agent updates `state/session.json`
- /complete-task: Aggregates to `state/metrics.json`
- /end-session: Finalizes session, checks signals
- /improve-workflow: Reads signals, proposes changes

## Improvement Triggers

- Automatic: Red flags detected in `state/metrics.json` → `signals.red`
- Periodic: Every 3 epics
- Manual: `/improve-workflow`

## CLI Tool

Use `core/lib/state-cli.js` for programmatic state access:

```bash
node core/lib/state-cli.js get-status          # View current status
node core/lib/state-cli.js regenerate-views    # Refresh CURRENT.md files
```
