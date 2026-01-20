# Epic Revision Workflow

How to reconsider technologies, frameworks, or implementation approach for an existing epic.

## When to Use
- Reconsidering technology choices before starting an epic
- Pivoting approach mid-epic based on new information
- Major refactoring of epic structure

---

## Quick Command Sequence

```bash
# 1. Research alternatives
/research-tech "topic 1"
/research-tech "topic 2"

# 2. Review research, then re-specify the feature
/spec-feature "feature description"

# 3. Update the epic with new approach
/create-epic add-to EPIC-N
# OR for major restructure:
/create-epic new N-name

# 4. Begin implementation
/start-epic N-name
```

---

## Phase 1: Research (`/research-tech`)

**Run for each technology decision:**
```
/research-tech Gemini API React Native Expo
/research-tech voice transcription React Native Expo
```

### What Happens

| Step | Action | Tools/Agents |
|------|--------|--------------|
| 1 | WebSearch for current (2026) options | `WebSearch` |
| 2 | Query docs for top candidates | Context7 MCP |
| 3 | Analyze against codebase | **code-explorer agent** |
| 4 | Create research document | `Write` |
| 5 | Record metrics | `Edit` on `meta/session/CURRENT.md` |

### Files Read
- `lib/` (existing patterns)
- `package.json` (current dependencies)
- `app.json` / `app.config.js` (Expo config)

### Files Created
- `specs/RESEARCH-{topic}.md`

### Research Output Structure
```markdown
# Research: {Topic}

## Date
{current date}

## Question
{what we're trying to solve}

## Options Evaluated

### Option 1: {name}
- **Pros:**
- **Cons:**
- **Pricing:**
- **Expo Compatible:** Yes/No
- **Integration Effort:** S/M/L

### Option 2: {name}
...

## Recommendation
{chosen option with rationale}

## Integration Notes
{specific steps for this codebase}
```

---

## Phase 2: Specify Feature (`/spec-feature`)

**Run after research is complete:**
```
/spec-feature AI chatbot for session logging
```

### What Happens

| Step | Action | Tools/Agents |
|------|--------|--------------|
| 1 | Parse feature description | Claude reasoning |
| 2 | Explore codebase | **code-explorer agent** |
| 3 | Ask clarifying questions | `AskUserQuestion` |
| 4 | Check existing research | `Read` on `specs/RESEARCH-*.md` |
| 5 | Determine epic placement | `AskUserQuestion` |
| 6 | Generate spec | `Write` |

### Files Read
- `specs/RESEARCH-*.md` (from Phase 1)
- `lib/api/*.ts` (existing API patterns)
- `types/*.ts` (existing types)
- `components/` (existing UI patterns)

### Agent: code-explorer Analyzes
- Components with similar patterns
- Existing hooks in `lib/hooks/`
- API patterns in `lib/api/`
- State management patterns

### Typical Questions Asked
1. Scope: MVP vs full feature?
2. UI: Where should it appear?
3. Integration: Auto-save or confirm?
4. Priority: What's essential?

### Files Created
- `specs/FEATURE-{name}.md`

---

## Phase 3: Create/Update Epic (`/create-epic`)

**Run after spec is approved:**
```
/create-epic add-to EPIC-4
```
or for major restructure:
```
/create-epic new 4-ai-chat
```

### What Happens

| Step | Action | Tools/Agents |
|------|--------|--------------|
| 1 | Read feature spec | `Read` |
| 2 | Design architecture | **code-architect agent** |
| 3 | Group into features | Claude reasoning |
| 4 | Size tasks (S/M/L/XL) | Claude reasoning |
| 5 | Identify markers (TDD, UI) | Claude reasoning |
| 6 | Create/update epic files | `Write` / `Edit` |
| 7 | Update status | `Edit` on `status/CURRENT.md` |

### Files Read
- `specs/FEATURE-{name}.md` (the spec)
- `specs/RESEARCH-*.md` (technology decisions)
- `epics/active/EPIC-N-*/README.md` (existing epic)
- `epics/active/EPIC-N-*/TASKS.md` (existing tasks)
- `standards/components.md` (task sizing reference)
- `standards/api-patterns.md` (API task structure)

### Agent: code-architect Outputs
- Recommended file structure
- Task breakdown with dependencies
- Suggested implementation order
- Risk areas identified

### Files Modified/Created
- `epics/active/EPIC-N-*/README.md`
- `epics/active/EPIC-N-*/FEATURE-*.md`
- `epics/active/EPIC-N-*/TASKS.md`
- `status/CURRENT.md`

---

## Phase 4: Start Implementation (`/start-epic`)

**Run when ready to implement:**
```
/start-epic 4-ai-chat
```

### What Happens

| Step | Action | Tools/Agents |
|------|--------|--------------|
| 1 | Read current status | `Read` |
| 2 | Read epic file | `Read` |
| 3 | Load relevant learnings | `Read` (smart loading) |
| 4 | Create branch | `Bash` (git) |
| 5 | Identify first task | `Read` |
| 6 | Plan agent usage | Claude reasoning |
| 7 | Initialize session | `Write` on `meta/session/CURRENT.md` |

### Smart Loading (by task type)

**API tasks:**
- `standards/api-patterns.md`
- `standards/typescript.md`
- `learnings/typescript.md`

**UI tasks:**
- `standards/components.md`
- `standards/styling.md`
- `learnings/react-native.md`

**Always:**
- `learnings/common-mistakes.md`

### Agent Usage Plan Output
```
This epic has:
- X API tasks (will use code-reviewer on M/L)
- Y UI tasks (will use frontend-design)
- Z TDD tasks (test-first)
```

---

## Visual Flow

```
┌──────────────────────────────────────────────────────┐
│  /research-tech                                      │
│  Tools: WebSearch, Context7, code-explorer           │
│  Creates: specs/RESEARCH-*.md                        │
└──────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────┐
│  /spec-feature                                       │
│  Tools: code-explorer, AskUserQuestion               │
│  Creates: specs/FEATURE-*.md                         │
└──────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────┐
│  /create-epic                                        │
│  Tools: code-architect                               │
│  Modifies: epics/active/EPIC-N-*/                    │
└──────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────┐
│  /start-epic N-name                                  │
│  Creates: Branch, session tracking                   │
└──────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────┐
│  /next-task (repeat)                                 │
│  Agents: code-reviewer, frontend-design              │
└──────────────────────────────────────────────────────┘
```

---

## Agent Reference

| Agent | When Used | Purpose |
|-------|-----------|---------|
| **code-explorer** | `/research-tech`, `/spec-feature` | Scans codebase for patterns |
| **code-architect** | `/create-epic` | Designs task breakdown |
| **code-reviewer** | `/complete-task` (M/L/XL) | Reviews for bugs, standards |
| **frontend-design** | UI tasks | Designs component architecture |

---

## Example: Revising EPIC-4 AI Chat

```bash
# Research LLM options
/research-tech "LLM API React Native Expo 2026"

# Research voice options
/research-tech "speech recognition React Native Expo 2026"

# Re-specify with new tech choices
/spec-feature "AI-powered session logging with voice"

# Update the epic
/create-epic add-to EPIC-4

# Start fresh implementation
/start-epic 4-ai-chat
```

---

## Loading This Workflow

In a new session, tell Claude:
```
Read guides/epic-revision-workflow.md and help me revise EPIC-4
```

Or simply:
```
I want to reconsider EPIC-4's technology choices. Follow the epic revision workflow.
```
