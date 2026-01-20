# Context Budget Management

## Understanding Your Context Window

```
┌─────────────────────────────────────────────────────────────┐
│                 CONTEXT BREAKDOWN (200k max)                │
├─────────────────────────────────────────────────────────────┤
│ System Prompt        │ ~3k   │ Fixed, unavoidable          │
│ System Tools         │ ~17k  │ Built-in Claude Code tools  │
│ MCP Tools            │ 0-30k │ VARIABLE - optimize this!   │
│ Skills/Agents        │ ~1k   │ Usually small               │
│ Messages             │ ~var  │ Your actual conversation    │
│ Autocompact Buffer   │ ~45k  │ Reserved for summarization  │
├─────────────────────────────────────────────────────────────┤
│ WORKING SPACE        │ ~100k │ What you actually have      │
└─────────────────────────────────────────────────────────────┘
```

## Check Your Context

```bash
/context  # Shows current breakdown
/cost     # Shows token/cost usage (if available)
```

## Context Optimization Checklist

- [ ] Disable MCP servers not needed for current task
- [ ] Start fresh sessions (`/clear`) for new epics/features
- [ ] Use `/compact` if mid-task and running low
- [ ] Keep sessions under ~120k to avoid auto-compaction mid-thought
- [ ] Use external files (STATUS.md) for cross-session state

## MCP Server Management

| Server Type | When to Enable | Token Cost |
|-------------|----------------|------------|
| Database (Supabase) | Backend projects | ~4-5k |
| Payments (Stripe) | E-commerce only | ~5k |
| Design (Figma) | Design-to-code only | ~5k |
| Vector DB (Pinecone) | AI/RAG projects only | ~4k |
| Docs (Context7) | When learning new libs | ~1k |

### Rule of Thumb

```
Tokens saved = (Disabled MCPs) x ~4k average
15k saved = ~7.5% more working context
```

## Modular Documentation Benefits

This workflow uses modular docs to reduce context:
- Only load guides relevant to current task
- Standards split by type (UI, API, testing)
- Learnings categorized for targeted lookup

**Before:** Loading all docs = ~40-50% context
**After:** Load only needed = ~15-20% context
