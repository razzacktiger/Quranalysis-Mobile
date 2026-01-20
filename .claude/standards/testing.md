# Testing Standards

## Testing Pyramid

```
                    ┌─────────────┐
                    │  Human QA   │  Manual verification
                    │  (Visual)   │  Feel, animations, UX
                    ├─────────────┤
                    │   E2E       │  Maestro tests
                    │  (Flows)    │  Full user journeys
                ┌───┴─────────────┴───┐
                │    Integration      │  Hooks + API together
                │   (Feature-level)   │  (Covered by E2E)
            ┌───┴─────────────────────┴───┐
            │         Unit Tests          │  Jest
            │   (Logic, Utils, Schemas)   │  Pure functions
        ┌───┴─────────────────────────────┴───┐
        │            Type Checking            │  TypeScript
        │         (Every file, always)        │  Compile-time
        └─────────────────────────────────────┘
```

## TDD Required Tasks

| Task Type | Why TDD | Example |
|-----------|---------|---------|
| Validation schemas | Edge cases matter | `sessionSchema` |
| Calculation utils | Math must be correct | `calculateStreak` |
| Data transformers | Shape must match | `transformSession` |
| AI parsing logic | Structured output | `parseAIResponse` |

## TDD Pattern

```typescript
// Step 1: Write test FIRST
describe('calculateStreak', () => {
  it('returns 0 for empty sessions', () => {
    expect(calculateStreak([])).toEqual({ current: 0, best: 0 });
  });

  it('counts consecutive days', () => {
    const sessions = [
      { created_at: '2025-01-15' },
      { created_at: '2025-01-14' },
    ];
    expect(calculateStreak(sessions).current).toBe(2);
  });
});

// Step 2: Run test - should FAIL
// Step 3: Implement function
// Step 4: Run test - should PASS
```

## Unit Test Structure

```typescript
// stats.test.ts
import { calculateStreak, calculateAverage } from './stats';

describe('calculateStreak', () => {
  it('returns 0 for empty sessions', () => {
    expect(calculateStreak([])).toEqual({ current: 0, best: 0 });
  });

  it('counts consecutive days correctly', () => {
    const sessions = [
      { created_at: '2025-01-15' },
      { created_at: '2025-01-14' },
      { created_at: '2025-01-13' },
    ];
    expect(calculateStreak(sessions)).toEqual({ current: 3, best: 3 });
  });

  it('breaks streak on gap', () => {
    const sessions = [
      { created_at: '2025-01-15' },
      { created_at: '2025-01-13' }, // Gap on 14th
    ];
    expect(calculateStreak(sessions)).toEqual({ current: 1, best: 1 });
  });
});
```

## E2E Test Structure (Maestro)

```yaml
# Pattern: One behavior per test file
appId: com.quranalysis.mobile
name: Sessions - Create Basic Session
---
# Setup
- launchApp

# Action
- tapOn: "Add Session"
- inputText:
    id: "duration-input"
    text: "30"
- tapOn: "Create Session"

# Assertion
- assertVisible: "Session created"
```

## Test File Organization

```
lib/
├── utils/
│   ├── stats.ts
│   └── stats.test.ts      # Co-located unit test
├── validation/
│   ├── session.ts
│   └── session.test.ts    # Co-located unit test

tests/
└── e2e/
    ├── auth/
    │   ├── login.yaml
    │   └── logout.yaml
    ├── sessions/
    │   ├── create-basic.yaml
    │   └── list.yaml
    └── dashboard/
        └── main.yaml
```

## What E2E Covers (Integration Points)

| Integration Point | Covered By |
|-------------------|------------|
| Form -> API -> Database | `create-session.yaml` |
| Auth -> Protected Routes | `login.yaml`, `logout.yaml` |
| API -> State -> UI | `session-list.yaml` |
| Chat -> AI API -> Extraction | `session-extraction.yaml` |

## What E2E Cannot Cover (Need Unit Tests)

| Logic Type | Test With |
|------------|-----------|
| Calculation correctness | Unit test (`stats.test.ts`) |
| Validation edge cases | Unit test (`session.test.ts`) |
| Date/time logic | Unit test |
| Error message formatting | Unit test |

## When to Add More Tests

**Add unit tests when:**
- [ ] Function has conditional logic (if/else, switch)
- [ ] Function does math or calculations
- [ ] Function transforms data shapes
- [ ] Function has edge cases (empty, null, boundaries)

**Add E2E tests when:**
- [ ] New user flow is added
- [ ] Critical path changes
- [ ] Bug is found in production (regression test)

## Jest Setup for React Native

```javascript
// jest.setup.js
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock API modules BEFORE imports in test files:
jest.mock('@/lib/api/sessions', () => ({
  fetchSessions: jest.fn(),
}));
```
