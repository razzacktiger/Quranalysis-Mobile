---
description: Research a technology before implementing
---

# /research-tech

Research a technology, library, or approach before implementation.

## Parameters

| Param | Required | Description |
|-------|----------|-------------|
| `topic` | Yes | Technology or topic to research |

## State Operations

**Reads:**
- `state/learnings-index.json` - Check existing learnings

**Writes:**
- Create research doc: `project/specs/RESEARCH-{topic}.md`
- Optionally add to learnings

## Output Format

```markdown
# Research: {topic}

## Summary
[Key findings]

## Options Evaluated
| Option | Pros | Cons |
|--------|------|------|

## Recommendation
[Recommended approach with reasoning]

## Implementation Notes
[Specific details for implementation]

## References
[Links to docs, examples]
```

## Execution

**Read and follow the full instructions:**
→ `core/commands/instructions/standard-loop/research-tech.md`

**Schema reference:**
→ `core/commands/schemas/research-tech.schema.json`
