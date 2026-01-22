# Standard Agent Workflow

All agents follow this workflow unless specified otherwise.

## Phases

```
┌─────────────────────────────────────────────────────────────┐
│ 1. CONTEXT                                                   │
│    Read task spec + all context files                        │
│    Understand existing patterns                              │
│    Time: ~10% of task                                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. PLAN                                                      │
│    Outline implementation approach                           │
│    Identify files to create/modify                           │
│    List potential blockers                                   │
│    Time: ~10% of task                                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. CHECKPOINT (if needed)                                    │
│    Report questions or ambiguities                           │
│    Wait for orchestrator input                               │
│    Time: Variable (may pause)                                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. IMPLEMENT                                                 │
│    Write code following standards                            │
│    Create all required files                                 │
│    Time: ~60% of task                                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. VERIFY                                                    │
│    Self-review against checklist                             │
│    Run typecheck if possible                                 │
│    Time: ~10% of task                                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. REPORT                                                    │
│    Summarize changes made                                    │
│    List files modified                                       │
│    Note any issues or concerns                               │
│    Time: ~10% of task                                        │
└─────────────────────────────────────────────────────────────┘
```

## Phase Details

### 1. CONTEXT Phase

**Purpose:** Build complete understanding before writing code.

**Actions:**
- Read task specification thoroughly
- Read all listed context files
- Note existing patterns (naming, structure, style)
- Identify dependencies and imports needed

**Output:** Mental model of what exists and what's needed

### 2. PLAN Phase

**Purpose:** Design approach before implementation.

**Actions:**
- List files to create/modify
- Outline structure of each file
- Identify shared types/interfaces
- Note order of implementation
- Flag potential issues

**Output:** Implementation roadmap

### 3. CHECKPOINT Phase

**Purpose:** Get human input when needed.

**Triggers:** (See [checkpoints.md](./checkpoints.md))
- Ambiguous requirements
- Multiple valid approaches
- Missing dependencies
- Scope concerns

**Actions:**
- Document specific questions
- Provide options if applicable
- Wait for orchestrator response

**Output:** Clarification or approval to proceed

### 4. IMPLEMENT Phase

**Purpose:** Write the actual code.

**Actions:**
- Create/modify files in planned order
- Follow all standards
- Add testIDs to interactive elements
- Include error handling
- Write JSDoc for complex functions

**Guidelines:**
- One concern per file
- Match existing code style
- No TODO comments (fix it now)
- No console.log debugging

**Output:** Working implementation

### 5. VERIFY Phase

**Purpose:** Self-check before reporting.

**Actions:**
- Review against task acceptance criteria
- Check imports are correct
- Verify no TypeScript errors (mental check)
- Ensure all edge cases handled
- Run quality checklist

**Checklist:**
```
[ ] All acceptance criteria met
[ ] No TypeScript errors expected
[ ] Error states handled
[ ] Loading states handled
[ ] testIDs added
[ ] Follows existing patterns
[ ] No hardcoded values
```

**Output:** Confidence in implementation

### 6. REPORT Phase

**Purpose:** Communicate results to orchestrator.

**Include:**
1. **Files Created/Modified** - list with descriptions
2. **Key Decisions** - choices made and rationale
3. **Exports Added** - new public API
4. **Issues Found** - concerns or edge cases
5. **Testing Notes** - how to verify
6. **Status** - COMPLETE / NEEDS_INPUT / BLOCKED

**Format:**
```markdown
## Task [ID] Report

### Status: COMPLETE

### Files Modified
- `path/file.ts` - [description]

### Key Decisions
- [Decision]: [Rationale]

### Testing Notes
- [How to verify this works]

### Concerns
- [Any issues to watch for]
```

## Agent Communication

### To Orchestrator
- Clear status updates
- Specific questions (not vague)
- Options when multiple approaches exist
- Honest assessment of completion

### From Orchestrator
- Answers to questions
- Approval to proceed
- Redirections if off-track
- Additional context if needed

## Error Handling

### When Stuck
1. Document what's blocking
2. Report with NEEDS_INPUT status
3. Provide specific question
4. Wait for orchestrator

### When Wrong Path
1. Stop implementation
2. Report with BLOCKED status
3. Explain issue discovered
4. Wait for orchestrator decision

### When Requirements Change
1. Note the change
2. Assess impact on work done
3. Report with status update
4. Proceed with new direction
