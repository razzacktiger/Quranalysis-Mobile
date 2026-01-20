---
description: Scan for code quality issues and refactoring opportunities
---

# Refactor Check

Scan codebase for quality issues and refactoring opportunities.

## When to Run
- End of epic
- Before complex features
- Periodic maintenance
- When technical debt feels high

## Input
$ARGUMENTS = scope (optional)
- "epic-N" - Current epic only
- "all" - Entire codebase
- "components" - Just components/
- Default: Current epic if active, else all

## Step 1: Determine Scope
Based on $ARGUMENTS, identify files to scan.

## Step 2: Run Code Reviewer
Launch code-reviewer agent with focus on quality:
- Code duplication
- Complexity (functions >50 lines)
- Unused exports
- Missing error handling
- Inconsistent patterns

## Step 3: Pattern Check
Scan for:

### Duplication
- Similar code blocks >10 lines
- Copy-paste patterns
- Candidates for abstraction

### Complexity
- Functions >50 lines
- Deeply nested logic (>3 levels)
- Complex conditionals

### Unused Code
- Unused exports
- Dead code paths
- Commented-out code

### TODO Comments
- Unresolved TODOs
- FIXME markers
- HACK notes

### Component Issues
- Components doing too much
- Props drilling
- Missing memoization

### Hook Issues
- Hooks with multiple concerns
- Missing dependencies
- Unnecessary re-renders

## Step 4: Generate Report
Create report with:

```markdown
# Refactor Check Report

**Scope:** {scope}
**Date:** {date}
**Files Scanned:** {count}

## High Priority (Fix Before Next Epic)

### {Issue Title}
- **Location:** {file:line}
- **Issue:** {description}
- **Suggestion:** {how to fix}
- **Effort:** S/M/L

## Medium Priority (Nice to Have)
...

## Low Priority (Future)
...

## Metrics
- Issues found: X
- High: X, Medium: X, Low: X
- Estimated fix effort: X hours
```

## Step 5: Record in Metrics
If patterns found, update:
- meta/metrics/quality/bug-categories.md
- meta/IMPROVEMENT-BACKLOG.md (if systemic)

## Step 6: Report
Show summary and ask:
"Found X issues (X high priority). Address any before continuing?"

## Issue Priority Guide

### High Priority
- Security issues
- Bug-prone patterns
- Blocking future work
- Performance issues

### Medium Priority
- Code duplication
- Missing tests for logic
- Inconsistent patterns

### Low Priority
- Style inconsistencies
- Minor refactoring opportunities
- Nice-to-have improvements

## Example Usage
```
User: /refactor-check epic-3
Agent: *Scans EPIC-3 files*
Agent: "Found 3 issues (1 high). High: StatsGrid has
       duplicated calculation logic. Fix now?"
```
