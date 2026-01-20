# Quick Start Guide

## Session Workflow (Copy-Paste Ready)

```bash
# 1. START SESSION
/clear

# 2. START EPIC
/start-epic N-name

# 3. TASK LOOP
Claude: implements -> runs tests -> reports
You say: "Approved, commit this" or "Fix [issue]"
You say: "/next-task"

# 4. CHECK CONTEXT (every 3-5 tasks)
/context
# If >70%: wrap up. If >85%: end session now.

# 5. END SESSION
/end-session
/clear

# 6. EPIC COMPLETE (after Human QA passes)
"Merge epic-{n}-{name} to main and delete branch"
```

## Command Cheat Sheet

| Action | Command/Prompt |
|--------|----------------|
| Fresh start | `/clear` |
| Check context | `/context` |
| Start epic | `/start-epic N-name` |
| Approve task | "Approved, commit this" |
| Fix issue | "Fix [specific issue], re-run tests" |
| Next task | `/next-task` |
| End session | `/end-session` |
| Merge when done | "Merge to main and delete branch" |

## Testing Quick Reference

| Test Type | Command | When to Run |
|-----------|---------|-------------|
| **TypeCheck** | `npm run typecheck` | Every task |
| **Unit Tests** | `npm test` | Tasks with `.test.ts` files |
| **Visual Check** | `npx expo start --ios` | UI tasks |
| **E2E Tests** | `maestro test tests/e2e/X.yaml` | End of feature |

## TDD Required For
- Validation schemas (Zod)
- Calculation utils (stats, streaks)
- Data transformation functions
- AI prompt parsing logic

## TDD Pattern
```
1. Write failing tests first
2. Run tests (confirm they fail)
3. Implement code
4. Run tests (confirm they pass)
5. Refactor if needed
```

## Per-Task Testing Pattern
```
Types/Utils tasks     -> typecheck + unit test (TDD if logic-heavy)
Hook tasks            -> typecheck only
Component tasks       -> typecheck + visual check
Screen tasks          -> typecheck + visual check
E2E test tasks        -> run the maestro test
Feature complete      -> run ALL maestro tests for that feature
Epic complete         -> Human QA + all epic maestro tests
```

## Git Branching (Per Epic)

```
main
├── epic-0-setup      # Branch per epic
├── epic-1-auth
├── epic-2-sessions
└── ...

# Start epic:  branch created automatically by /start-epic
# End epic:    "Merge epic-{n}-name to main" (after Human QA)
```
