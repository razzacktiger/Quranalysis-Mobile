---
description: Scan code for quality issues and refactoring opportunities
---

# /refactor-check

Analyze code for quality issues, patterns violations, and refactoring needs.

## Parameters

| Param | Required | Description |
|-------|----------|-------------|
| `scope` | No | Scope to check: "feature", "epic", or file path |

## State Operations

**Reads:**
- `state/project.json` - Current context
- `project/standards/*.md` - Standards to check against
- `state/learnings-index.json` - Common mistakes

**Writes:**
- None (read-only analysis)

## Checks Performed

1. TypeScript errors/warnings
2. Standards compliance
3. Code duplication
4. Missing error handling
5. Accessibility (for UI)
6. Test coverage gaps
7. Common mistakes from learnings

## Execution

**Read and follow the full instructions:**
→ `core/commands/instructions/standard-loop/refactor-check.md`

**Schema reference:**
→ `core/commands/schemas/refactor-check.schema.json`
