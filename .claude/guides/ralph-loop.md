# Ralph Loop Decision Framework

## What is Ralph Loop?

An iterative automation technique where:
1. Same prompt fed repeatedly to Claude
2. Claude sees previous work in files
3. Iterates until completion signal (`<promise>DONE</promise>`)

## When to Use Ralph Loop

| Scenario | Use Ralph? | Why |
|----------|------------|-----|
| Repetitive component creation | YES | Mechanical, clear completion |
| Large refactoring | YES | Many similar changes |
| Research tasks | NO | Needs human judgment |
| Complex integrations | NO | Debugging needs oversight |
| Learning new APIs | NO | Exploration is non-linear |
| UI/UX work | NO | Subjective quality |

## Ralph Loop Cost Analysis

```
Per iteration overhead:
├── Tool definitions: ~30-50k (every time!)
├── Prompt + context: ~10-20k
├── File operations: ~5-10k
└── Total: ~50-80k per iteration

If task takes 3 iterations:
= 150-240k tokens = $3-6 per task (Opus)

Compare to single-shot:
= 50-80k tokens = $1-2 per task
```

## Ralph Loop Syntax

```bash
# Basic usage
/ralph-loop "Your task description. Output <promise>TASK-DONE</promise> when complete."

# With options
/ralph-loop "Task description" --max-iterations 10 --completion-promise "DONE"

# Cancel if stuck
/cancel-ralph
```

## Good Ralph Prompts

```markdown
# Specific, mechanical, verifiable
/ralph-loop "Create TypeScript interfaces for User, Session, and Mistake
types as specified in types/README.md. Run `npm run typecheck` after each.
Output <promise>TYPES-DONE</promise> when all pass."

# Batch similar tasks
/ralph-loop "Add testID props to all components in components/forms/
following the pattern: {componentName}-{elementType}.
Output <promise>TESTIDS-DONE</promise> when all 12 components updated."
```

## Bad Ralph Prompts

```markdown
# Too vague
/ralph-loop "Make the app better"

# Requires judgment
/ralph-loop "Design a good authentication flow"

# No clear completion
/ralph-loop "Fix all the bugs"
```
