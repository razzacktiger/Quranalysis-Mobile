# Tool Usage - Optimization Opportunities

## Identified Waste

| Issue | Occurrences | Wasted Tokens | Fix |
|-------|-------------|---------------|-----|
| Re-read file in context | - | - | Track reads |
| Grep then read whole file | - | - | Use grep -C context |
| Multiple small edits | - | - | Batch edits |
| Read before knowing needed | - | - | Grep first |

## Top Wasteful Patterns

### 1. Re-reading Files
Files read multiple times in same session when already in context.

**Tracking:** List files in session/CURRENT.md
**Fix:** Check list before reading

### 2. Over-reading
Reading entire file when only small section needed.

**Better approach:**
1. Grep for function/class
2. Read with -A/-B context
3. Or read with line range

### 3. Incremental Edits
Making 4 small edits instead of 1 larger edit.

**Cost:** Each edit ~200 tokens overhead
**Fix:** Plan changes, batch into single edit

### 4. Speculative Reads
Reading files that turn out to be unnecessary.

**Better approach:**
1. Grep to confirm relevance first
2. Use code-explorer for broad search

## Estimated Savings

| Improvement | Tokens/Session |
|-------------|----------------|
| Track reads | ~6k |
| Better grep usage | ~4k |
| Batch edits | ~2k |
| **Total** | **~12k (6%)** |

## How to Update

During session, note wasteful patterns.
Add to this file with specific examples.
