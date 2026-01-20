# Common Tool Sequences

## Efficient Patterns

### Find and Edit
```
1. Grep (find location)
2. Read (with context)
3. Edit (targeted change)
```
**Tokens:** ~1200
**Use for:** Small, targeted changes

### Explore and Implement
```
1. code-explorer agent
2. Read (relevant files)
3. Edit/Write
4. code-reviewer agent
```
**Tokens:** ~8000
**Use for:** Unfamiliar code areas

### TDD Pattern
```
1. Write (test file)
2. Bash (run tests - fail)
3. Write (implementation)
4. Bash (run tests - pass)
```
**Tokens:** ~3000
**Use for:** Logic-heavy tasks

## Inefficient Patterns (Avoid)

### Over-reading
```
BAD:
1. Read (entire file)
2. Edit (small change)
3. Read (same file again)

BETTER:
1. Grep (find section)
2. Read (with -A/-B context)
3. Edit
```

### Scatter-shot Search
```
BAD:
1. Grep "pattern1"
2. Grep "pattern2"
3. Grep "pattern3"
4. Read file1
5. Read file2

BETTER:
1. code-explorer agent
   (searches multiple patterns, returns summary)
```

## How to Update

Note patterns during implementation.
Add efficient patterns as discovered.
