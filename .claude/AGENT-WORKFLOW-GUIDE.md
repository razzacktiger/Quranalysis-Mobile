# Claude Code Agent Workflow Guide

**Purpose:** Optimize Claude Code usage for cost efficiency, context management, and productive AI-assisted development.
**Scope:** Generalized patterns applicable to any project pipeline.

---

## TLDR: Quick Start

### Session Workflow (Copy-Paste Ready)

```bash
# 1. START SESSION
/clear

# 2. PROMPT CLAUDE (Starting New Epic)
Read .claude/STATUS.md and .claude/epics/EPIC-{N}-{NAME}.md
Create branch epic-{n}-{name} from main.
Start Task {X.X.X}. Implement, test, wait for my approval.
Follow CODE-STANDARDS.md.

# 2b. PROMPT CLAUDE (Continuing Epic - Same Branch Exists)
Read .claude/STATUS.md and .claude/epics/EPIC-{N}-{NAME}.md
Continue on branch epic-{n}-{name} from Task {X.X.X}.
Follow CODE-STANDARDS.md.

# 3. TASK LOOP
Claude: creates branch (if new) → implements → runs tests → reports
You say: "Approved, commit this" or "Fix [issue]"
You say: "Next task"

# 4. CHECK CONTEXT (every 3-5 tasks)
/context
# If >70%: wrap up. If >85%: end session now.

# 5. END SESSION
"Update STATUS.md with progress"
/clear

# 6. EPIC COMPLETE (after Human QA passes)
"Merge epic-{n}-{name} to main and delete branch"
```

### Command Cheat Sheet

| Action | Command/Prompt |
|--------|----------------|
| Fresh start | `/clear` |
| Check context | `/context` |
| Approve task | "Approved, commit this" |
| Fix issue | "Fix [specific issue], re-run tests" |
| Next task | "Continue" or "Next task" |
| End session | "Update STATUS.md" → `/clear` |
| Merge when done | "Merge to main and delete branch" |

**Note:** Branch creation is automatic when you start a new epic.

### Testing Quick Reference

| Test Type | Command | When to Run | What It Checks |
|-----------|---------|-------------|----------------|
| **TypeCheck** | `npm run typecheck` | Every task | Types compile, no TS errors |
| **Unit Tests** | `npm test` | Tasks with `.test.ts` files | Logic correctness |
| **Visual Check** | `npx expo start --ios` | UI tasks | Renders correctly |
| **E2E Tests** | `maestro test tests/e2e/X.yaml` | End of feature | Full user flows work |
| **Integration** | E2E tests | Feature boundaries | Components work together |

**TDD Required For:**
- Validation schemas (Zod)
- Calculation utils (stats, streaks)
- Data transformation functions
- AI prompt parsing logic

**TDD Pattern:**
```
1. Write failing tests first
2. Run tests (confirm they fail)
3. Implement code
4. Run tests (confirm they pass)
5. Refactor if needed
```

**Per-Task Testing Pattern:**
```
Types/Utils tasks     → typecheck + unit test (TDD if logic-heavy)
Hook tasks            → typecheck only
Component tasks       → typecheck + visual check
Screen tasks          → typecheck + visual check
E2E test tasks        → run the maestro test
Feature complete      → run ALL maestro tests for that feature
Epic complete         → Human QA + all epic maestro tests
```

### Git Branching (Per Epic)

```bash
main
├── epic-0-setup      # Branch per epic
├── epic-1-auth
├── epic-2-sessions
└── ...

# Start epic:  "Create and checkout branch epic-1-auth"
# End epic:    "Merge epic-1-auth to main" (after Human QA)
```

### Multi-Person Workflow

```
Person A: Works on EPIC-2 (branch: epic-2-sessions)
Person B: Works on EPIC-4 (branch: epic-4-ai-chat)

Rules:
- Different epics = different branches = no conflicts
- Update STATUS.md with your name: "EPIC-2 (Alice): Task 2.3.1"
- Pull main before starting new epic
- Merge only after Human QA passes
```

---

## 1. Context Budget Management

### Understanding Your Context Window

```
┌─────────────────────────────────────────────────────────────┐
│                 CONTEXT BREAKDOWN (200k max)                │
├─────────────────────────────────────────────────────────────┤
│ System Prompt        │ ~3k   │ Fixed, unavoidable          │
│ System Tools         │ ~17k  │ Built-in Claude Code tools  │
│ MCP Tools            │ 0-30k │ VARIABLE - optimize this!   │
│ Skills/Agents        │ ~1k   │ Usually small               │
│ Messages             │ ~var  │ Your actual conversation    │
│ Autocompact Buffer   │ ~45k  │ Reserved for summarization  │
├─────────────────────────────────────────────────────────────┤
│ WORKING SPACE        │ ~100k │ What you actually have      │
└─────────────────────────────────────────────────────────────┘
```

### Check Your Context

```bash
/context  # Shows current breakdown
/cost     # Shows token/cost usage (if available)
```

### Context Optimization Checklist

- [ ] Disable MCP servers not needed for current task
- [ ] Start fresh sessions (`/clear`) for new epics/features
- [ ] Use `/compact` if mid-task and running low
- [ ] Keep sessions under ~120k to avoid auto-compaction mid-thought
- [ ] Use external files (STATUS.md) for cross-session state

---

## 2. MCP Server Management

### Audit Your MCP Servers

Before starting a project, audit which MCPs are actually needed:

| Server Type | When to Enable | Token Cost |
|-------------|----------------|------------|
| Database (Supabase, etc.) | Backend projects | ~4-5k |
| Payments (Stripe) | E-commerce only | ~5k |
| Design (Figma) | Design-to-code only | ~5k |
| Vector DB (Pinecone) | AI/RAG projects only | ~4k |
| Code Analysis (Serena) | Large codebase analysis | ~6k |
| Docs (Context7) | When learning new libs | ~1k |

### Disable Unused MCPs

```bash
# Check what's loaded
/mcp

# Disable in settings or via CLI flags
# Each disabled MCP saves 3-6k tokens per conversation
```

### Rule of Thumb

```
Tokens saved = (Disabled MCPs) × ~4k average
15k saved = ~7.5% more working context
```

---

## 3. Session Management Patterns

### Pattern A: Epic-Based Sessions (Recommended for Projects)

```
Session 1: Epic/Feature A
├── /clear (fresh start)
├── Read requirements + status file
├── Complete all tasks in epic
├── Update status file
└── End session

Session 2: Epic/Feature B
├── /clear
├── Read requirements + status file (knows where you left off)
├── Continue work
└── Repeat...
```

**Why this works:**
- Fresh context prevents bloat
- External status file maintains continuity
- Human review between sessions
- Predictable token costs per session

### Pattern B: Task-Based Sessions (For Complex Tasks)

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

### Pattern C: Continuous Session (For Small Fixes)

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

---

## 4. Ralph Loop Decision Framework

### What is Ralph Loop?

An iterative automation technique where:
1. Same prompt fed repeatedly to Claude
2. Claude sees previous work in files
3. Iterates until completion signal (`<promise>DONE</promise>`)

### When to Use Ralph Loop

| Scenario | Use Ralph? | Why |
|----------|------------|-----|
| Repetitive component creation | YES | Mechanical, clear completion |
| Large refactoring | YES | Many similar changes |
| Research tasks | NO | Needs human judgment |
| Complex integrations | NO | Debugging needs oversight |
| Learning new APIs | NO | Exploration is non-linear |
| UI/UX work | NO | Subjective quality |

### Ralph Loop Cost Analysis

```
Per iteration overhead:
├── Tool definitions: ~30-50k (every time!)
├── Prompt + context: ~10-20k
├── File operations: ~5-10k
└── Total: ~50-80k per iteration

If task takes 3 iterations:
= 150-240k tokens = $3-6 per task (Opus)

Compare to single-shot:
= 50-80k tokens = $1-2 per task
```

### Ralph Loop Syntax

```bash
# Basic usage
/ralph-loop "Your task description. Output <promise>TASK-DONE</promise> when complete."

# With options
/ralph-loop "Task description" --max-iterations 10 --completion-promise "DONE"

# Cancel if stuck
/cancel-ralph
```

### Good Ralph Prompts

```markdown
# Specific, mechanical, verifiable
/ralph-loop "Create TypeScript interfaces for User, Session, and Mistake
types as specified in types/README.md. Run `npm run typecheck` after each.
Output <promise>TYPES-DONE</promise> when all pass."

# Batch similar tasks
/ralph-loop "Add testID props to all components in components/forms/
following the pattern: {componentName}-{elementType}.
Output <promise>TESTIDS-DONE</promise> when all 12 components updated."
```

### Bad Ralph Prompts

```markdown
# Too vague
/ralph-loop "Make the app better"

# Requires judgment
/ralph-loop "Design a good authentication flow"

# No clear completion
/ralph-loop "Fix all the bugs"
```

---

## 5. Cost Optimization Strategies

### Token Cost Reference (as of 2025)

| Model | Input (per 1M) | Output (per 1M) |
|-------|----------------|-----------------|
| Opus 4.5 | $15 | $75 |
| Sonnet 4 | $3 | $15 |
| Haiku 3.5 | $0.80 | $4 |

### Strategy: Right-Size Your Model

```
Task Type               → Model Choice
─────────────────────────────────────
Complex architecture    → Opus
Feature implementation  → Sonnet
Simple edits/fixes      → Haiku
Code review             → Sonnet
Documentation           → Haiku
```

### Strategy: Minimize Input Tokens

1. **Trim MCPs** - Disable unused servers
2. **Fresh sessions** - Don't accumulate history
3. **Specific file reads** - Read only what's needed
4. **Use glob/grep first** - Find before reading

### Strategy: Reduce Iterations

1. **Clear requirements** - Ambiguity causes rework
2. **Provide examples** - Show don't tell
3. **Run tests early** - Catch issues in task 1, not task 10
4. **Use status files** - Don't repeat context

### Estimated Project Costs

| Project Size | Optimized | Unoptimized |
|--------------|-----------|-------------|
| Small (10 tasks) | $15-30 | $50-100 |
| Medium (50 tasks) | $70-120 | $200-400 |
| Large (100+ tasks) | $150-300 | $500-1000 |

**For this project (63 tasks):**
- Opus only: $120-150
- Mixed Sonnet/Opus: $70-90
- Heavy Sonnet: $50-70

---

## 6. External State Management

### Why External State?

Claude has no memory between sessions. External files provide:
- Continuity across sessions
- Human-readable progress tracking
- Recovery from failed sessions
- Team visibility

### Recommended State Files

```
.claude/
├── STATUS.md           # Current task, blockers, progress
├── LEARNINGS.md        # Issue resolutions, patterns discovered
├── REQUIREMENTS.md     # Project overview, links to epics
└── epics/
    └── EPIC-*.md       # Detailed task specs
```

### STATUS.md Template

```markdown
# Project Status

## Current Sprint
- **Active Epic:** EPIC-2-SESSIONS
- **Current Task:** 2.3.1
- **Status:** In Progress

## Completed
- [x] EPIC-0: Setup
- [x] EPIC-1: Auth
- [ ] EPIC-2: Sessions (in progress)

## Blockers
- None currently

## Next Session
- Continue from Task 2.3.1
- Run tests before proceeding

## Token Usage (Optional)
- Session 1: ~45k tokens
- Session 2: ~62k tokens
- Running total: ~107k tokens
```

### LEARNINGS.md Template

```markdown
# Learnings & Patterns

## Issue: [Brief Description]
**Context:** What was happening
**Solution:** What fixed it
**Prevention:** How to avoid in future

## Pattern: [Name]
**Use When:** Scenario
**Implementation:** Code or steps
```

---

## 7. Prompt Engineering for Tasks

### Task Prompt Template

```markdown
## Context
Read: [specific files needed]
Current state: [what exists]

## Task
[Clear, specific objective]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Tests pass: `npm test`

## Constraints
- Don't modify [files]
- Follow pattern in [example]
- Max [N] files changed

## On Completion
- Update STATUS.md
- Output: <promise>TASK-ID-DONE</promise>
```

### Prompt Anti-Patterns

| Bad | Good |
|-----|------|
| "Fix the auth" | "Fix the token refresh in lib/auth.ts line 45" |
| "Make it better" | "Reduce bundle size by code-splitting routes" |
| "Add tests" | "Add unit tests for calculateStreak() in stats.ts" |
| "Update the UI" | "Add loading skeleton to SessionList component" |

---

## 8. Debugging Session Issues

### Context Overflow

**Symptoms:** Responses get truncated, Claude forgets earlier context

**Fix:**
```bash
/compact          # Summarize and continue
# OR
/clear            # Fresh start, reference STATUS.md
```

### Stuck / Blocked

**Symptoms:** Same error repeated, no progress

**Escalation Protocol:**

1. **After 1st failure - ASSESS:**
   - Human-required? (env vars, API keys, design decisions) → **Ask immediately**
   - Code/logic issue? → Check LEARNINGS.md, try again

2. **After 2nd failure:** Research (Context7, web search)

3. **After 3rd failure:** Stop and ask human - don't waste tokens

**Always human-required:**
- Missing environment variables
- OAuth/external service config
- Design or UX decisions
- Ambiguous requirements

**Fix:**
1. Document issue in LEARNINGS.md
2. Start fresh session with more specific prompt
3. Consider breaking task into smaller pieces

### Wrong File Edits

**Symptoms:** Claude edits wrong files or locations

**Fix:**
1. Be explicit: "Edit ONLY lib/auth.ts"
2. Provide line numbers when possible
3. Use "Read X first, then edit" pattern

### High Token Usage

**Symptoms:** Costs higher than expected

**Fix:**
1. Check `/context` for MCP bloat
2. Use smaller model for simple tasks
3. Fresh sessions more frequently
4. More specific file reads

---

## 9. Quick Reference

### Commands

```bash
/context          # Check context usage
/clear            # Fresh conversation
/compact          # Summarize to save space
/cost             # View costs (if available)
/mcp              # List MCP servers
/tasks            # View background tasks
```

### Session Hygiene

```
DO:
✓ Start fresh for new features
✓ Update STATUS.md after each session
✓ Disable unused MCPs
✓ Use specific file paths
✓ Provide acceptance criteria

DON'T:
✗ Let context exceed 120k
✗ Use Ralph for research tasks
✗ Leave sessions without status update
✗ Use vague prompts
✗ Skip testing between tasks
```

### Cost-Saving Checklist

- [ ] Disabled unnecessary MCP servers
- [ ] Using appropriate model for task complexity
- [ ] Starting fresh sessions per epic/feature
- [ ] Using external state files
- [ ] Providing specific, unambiguous prompts
- [ ] Running tests early and often

---

## 10. Git Branching Strategy

### Recommended: Branch Per Epic

```
main (protected)
│
├── epic-0-setup        ← Merge after EPIC-0 Human QA
├── epic-1-auth         ← Merge after EPIC-1 Human QA
├── epic-2-sessions     ← Merge after EPIC-2 Human QA
├── epic-3-dashboard
├── epic-4-ai-chat
└── epic-5-profile
```

**Why per-epic (not per-task or per-feature):**
- Epics are natural units with Human QA gates
- Reduces merge overhead (fewer branches)
- Each epic is self-contained
- Easy to revert entire epic if needed

### Branch Workflow

**Starting an Epic (Automatic):**
```
You: "Read .claude/epics/EPIC-1-AUTH.md
      Create branch epic-1-auth from main.
      Start Task 1.1.1..."

Claude automatically:
1. git checkout main
2. git pull origin main
3. git checkout -b epic-1-auth
4. Begins implementing Task 1.1.1
```

**During Epic (commits stay on branch):**
```
You: "Approved, commit this"

Claude:
git add [files]
git commit -m "feat(auth): add AuthContext (Task 1.1.2)"
# Stays on epic-1-auth branch
```

**Completing Epic (after Human QA):**
```
You: "All QA passed. Merge to main and delete branch."

Claude:
git checkout main
git pull origin main
git merge epic-1-auth
git push origin main
git branch -d epic-1-auth
```

### Alternative: Branch Per Feature (For Large Epics)

For EPIC-2 (19 tasks), you might want feature branches:

```
epic-2-sessions (base branch)
├── feature/2.1-api-layer
├── feature/2.3-form-components
├── feature/2.5-session-list
└── ...
```

**Use this when:**
- Epic has 15+ tasks
- Multiple people working on same epic
- Want more granular review points

---

## 11. Multi-Person Collaboration

### Setup: Parallel Epic Development

```
┌─────────────────────────────────────────────────────────────┐
│                 TEAM WORKFLOW                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Alice (Claude Account 1)     Bob (Claude Account 2)       │
│  ─────────────────────────    ─────────────────────────    │
│  Branch: epic-2-sessions      Branch: epic-4-ai-chat       │
│  STATUS.md section: Alice     STATUS.md section: Bob       │
│                                                             │
│  Both share:                                                │
│  - Same repo (different branches)                          │
│  - Same .claude/ documentation                             │
│  - Same LEARNINGS.md (append, don't overwrite)            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### STATUS.md for Teams

```markdown
# Project Status

## Active Work

### Alice - EPIC-2: Sessions
- **Branch:** epic-2-sessions
- **Current Task:** 2.3.4
- **Status:** In Progress
- **Last Updated:** 2025-01-15 14:30

### Bob - EPIC-4: AI Chat
- **Branch:** epic-4-ai-chat
- **Current Task:** 4.1.2
- **Status:** In Progress
- **Last Updated:** 2025-01-15 15:00

## Completed Epics
- [x] EPIC-0: Setup (merged to main)
- [x] EPIC-1: Auth (merged to main)

## Merge Queue
- epic-2-sessions: Awaiting Human QA
- epic-4-ai-chat: In Progress
```

### Collaboration Rules

1. **Claim Before Starting**
   ```
   Before starting an epic, update STATUS.md:
   "### YourName - EPIC-X: Name"
   Push this change first to avoid conflicts.
   ```

2. **Different Branches = No Conflicts**
   ```
   Alice: epic-2-sessions
   Bob: epic-4-ai-chat

   They never touch the same files (epics are isolated).
   ```

3. **Sync Main Before New Epic**
   ```
   git checkout main
   git pull origin main
   git checkout -b epic-X-name
   ```

4. **LEARNINGS.md Protocol**
   ```
   # Append, don't overwrite
   # Include your name and date

   ## [Alice - 2025-01-15] Issue: Supabase RLS Error
   **Context:** ...
   **Solution:** ...
   ```

5. **Merge Order Matters**
   ```
   Epics with dependencies merge first:
   EPIC-0 → EPIC-1 → EPIC-2 → EPIC-3 → EPIC-4 → EPIC-5

   If Bob finishes EPIC-4 before Alice finishes EPIC-2,
   Bob waits (EPIC-4 depends on EPIC-2).
   ```

### Handling Conflicts

**If branches diverge:**
```
You: "Rebase epic-2-sessions onto latest main"

Claude:
git checkout epic-2-sessions
git fetch origin
git rebase origin/main
# Resolve any conflicts
git push --force-with-lease origin epic-2-sessions
```

**If two people need same file:**
```
Option 1: Sequential work (one waits)
Option 2: Split into smaller branches
Option 3: Pair on same session (one drives)
```

### Communication Checklist

- [ ] Claimed epic in STATUS.md before starting
- [ ] Working on dedicated branch
- [ ] Not modifying files outside my epic
- [ ] Updating STATUS.md at end of each session
- [ ] Adding learnings with name/date
- [ ] Syncing main before starting new epic
- [ ] Waiting for dependency epics to merge first
