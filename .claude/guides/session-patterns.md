# Session Management Patterns

## Pattern A: Epic-Based Sessions (Recommended)

```
Session 1: Epic/Feature A
├── /clear (fresh start)
├── /start-epic N-name
├── Complete tasks in epic
├── /end-session
└── End session

Session 2: Continue or New Epic
├── /clear
├── /start-epic or /next-task
├── Continue work
└── Repeat...
```

**Why this works:**
- Fresh context prevents bloat
- External status file maintains continuity
- Human review between sessions
- Predictable token costs per session

## Pattern B: Task-Based Sessions (For Complex Tasks)

```
Session per complex task:
├── /clear
├── Read only the relevant task spec
├── Research if needed (Context7, web search)
├── Implement
├── Test
└── Update status, end session
```

**When to use:**
- Tasks marked "RESEARCH FIRST"
- Integration tasks (OAuth, APIs)
- Tasks with many unknowns

## Pattern C: Continuous Session (For Small Fixes)

```
Single session for multiple small tasks:
├── Fix bug A
├── Fix bug B
├── Add small feature C
├── /compact if needed
└── Continue until natural break
```

**When to use:**
- Bug fixes
- Small enhancements
- Code review responses

## Session Hygiene

```
DO:
- Start fresh for new features
- Update status after each session
- Disable unused MCPs
- Use specific file paths
- Provide acceptance criteria

DON'T:
- Let context exceed 120k
- Use Ralph for research tasks
- Leave sessions without status update
- Use vague prompts
- Skip testing between tasks
```
