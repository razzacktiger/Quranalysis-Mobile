# Code Quality Checklist

## Before Committing

- [ ] TypeScript compiles without errors (`npm run typecheck`)
- [ ] No `any` types (unless absolutely necessary with comment)
- [ ] All components have testID props
- [ ] Hooks follow naming convention (use*)
- [ ] No console.log statements (use proper logging)
- [ ] Error states handled in UI
- [ ] Loading states handled in UI

## Component Checklist

- [ ] Props interface defined
- [ ] Default props provided where sensible
- [ ] testID on interactive elements
- [ ] Accessible labels where needed
- [ ] Memoization for expensive operations
- [ ] Error boundary consideration

## API Integration Checklist

- [ ] Types match database schema
- [ ] Errors handled and displayed
- [ ] Loading states shown
- [ ] Optimistic updates where appropriate
- [ ] Cache invalidation on mutations

## Common Anti-Patterns to Avoid

### Component Anti-Patterns

```typescript
// BAD: Prop drilling through many levels
<GrandParent user={user}>
  <Parent user={user}>
    <Child user={user}>  // Use context instead

// BAD: Giant components
function SessionScreen() {
  // 500 lines of code...
}  // Split into smaller components

// BAD: Business logic in components
function SessionCard() {
  const streak = sessions.filter(s => /* complex logic */);  // Move to hook/util
}
```

### State Anti-Patterns

```typescript
// BAD: Storing derived state
const [filteredSessions, setFilteredSessions] = useState([]);
// GOOD: Derive in render or useMemo

// BAD: Mutating state directly
sessions.push(newSession);
// GOOD: Create new array
setSessions([...sessions, newSession]);
```

## Agent-Specific Guidelines

### When Implementing Tasks

1. **Read first, edit second** - Always read existing code patterns before writing
2. **Match existing style** - Follow patterns already in the codebase
3. **One concern per file** - Don't create monolithic files
4. **Test after each change** - Run typecheck and tests frequently

### File Modification Rules

```
DO:
- Add testID to new interactive elements
- Export types from module index files
- Update imports when moving files
- Add JSDoc for complex functions

DON'T:
- Remove existing testIDs
- Change export patterns without updating imports
- Add console.log for debugging (remove before commit)
- Create duplicate type definitions
```

### When Stuck

1. Check learnings/ for similar issues
2. Check existing code for patterns
3. Use Context7 for library documentation
4. Ask for clarification rather than guessing

### Quality Gates

Before marking task complete:
```bash
# Must pass
npm run typecheck
npm test -- --related

# Should run
npx expo start --ios  # Visual verification
maestro test tests/e2e/relevant-test.yaml  # E2E verification
```

## Pre-Epic-Completion Bug Sweep

Before marking an epic complete:

1. Run all E2E tests for the epic
2. Manual smoke test all new features
3. Verify all form inputs have proper validation
4. Check error states and edge cases
5. Review any "TODO" comments added during development
6. Fix all High/Medium bugs discovered
7. Document Low bugs in Bugs Epic if deferring
