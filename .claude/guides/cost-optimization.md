# Cost Optimization Strategies

## Token Cost Reference (2025-2026)

| Model | Input (per 1M) | Output (per 1M) |
|-------|----------------|-----------------|
| Opus 4.5 | $15 | $75 |
| Sonnet 4 | $3 | $15 |
| Haiku 3.5 | $0.80 | $4 |

## Strategy: Right-Size Your Model

```
Task Type               -> Model Choice
───────────────────────────────────────
Complex architecture    -> Opus
Feature implementation  -> Sonnet
Simple edits/fixes      -> Haiku
Code review             -> Sonnet
Documentation           -> Haiku
```

## Strategy: Minimize Input Tokens

1. **Trim MCPs** - Disable unused servers
2. **Fresh sessions** - Don't accumulate history
3. **Specific file reads** - Read only what's needed
4. **Use glob/grep first** - Find before reading
5. **Modular docs** - Load only relevant standards

## Strategy: Reduce Iterations

1. **Clear requirements** - Ambiguity causes rework
2. **Provide examples** - Show don't tell
3. **Run tests early** - Catch issues in task 1, not task 10
4. **Use status files** - Don't repeat context

## Estimated Project Costs

| Project Size | Optimized | Unoptimized |
|--------------|-----------|-------------|
| Small (10 tasks) | $15-30 | $50-100 |
| Medium (50 tasks) | $70-120 | $200-400 |
| Large (100+ tasks) | $150-300 | $500-1000 |

## Cost-Saving Checklist

- [ ] Disabled unnecessary MCP servers
- [ ] Using appropriate model for task complexity
- [ ] Starting fresh sessions per epic/feature
- [ ] Using external state files
- [ ] Providing specific, unambiguous prompts
- [ ] Running tests early and often
- [ ] Loading only relevant documentation modules
