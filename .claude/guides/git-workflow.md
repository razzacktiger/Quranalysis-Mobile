# Git Branching Strategy

## Branch Per Epic (Recommended)

```
main (protected)
│
├── epic-0-setup        <- Merge after EPIC-0 Human QA
├── epic-1-auth         <- Merge after EPIC-1 Human QA
├── epic-2-sessions     <- Merge after EPIC-2 Human QA
├── epic-3-dashboard
├── epic-4-ai-chat
└── epic-5-profile
```

**Why per-epic (not per-task or per-feature):**
- Epics are natural units with Human QA gates
- Reduces merge overhead (fewer branches)
- Each epic is self-contained
- Easy to revert entire epic if needed

## Branch Workflow

**Starting an Epic (via /start-epic):**
```
/start-epic 1-auth

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

## Alternative: Branch Per Feature (For Large Epics)

For epics with 15+ tasks, use feature branches:

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

## Multi-Person Collaboration

```
┌─────────────────────────────────────────────────────────────┐
│                 TEAM WORKFLOW                               │
├─────────────────────────────────────────────────────────────┤
│  Alice (Account 1)           Bob (Account 2)                │
│  ─────────────────────────   ─────────────────────────      │
│  Branch: epic-2-sessions     Branch: epic-4-ai-chat         │
│                                                             │
│  Both share:                                                │
│  - Same repo (different branches)                           │
│  - Same .claude/ documentation                              │
│  - Same learnings/ (append, don't overwrite)               │
└─────────────────────────────────────────────────────────────┘
```

### Collaboration Rules

1. **Claim Before Starting**
   - Update status/CURRENT.md before starting an epic
   - Push this change first to avoid conflicts

2. **Different Branches = No Conflicts**
   - Alice: epic-2-sessions
   - Bob: epic-4-ai-chat
   - They never touch the same files (epics are isolated)

3. **Sync Main Before New Epic**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b epic-X-name
   ```

4. **Learnings Protocol**
   - Append, don't overwrite
   - Include your name and date

5. **Merge Order Matters**
   - Epics with dependencies merge first
   - If Bob finishes EPIC-4 before Alice finishes EPIC-2, Bob waits

### Handling Conflicts

**If branches diverge:**
```bash
git checkout epic-2-sessions
git fetch origin
git rebase origin/main
# Resolve any conflicts
git push --force-with-lease origin epic-2-sessions
```

**If two people need same file:**
- Option 1: Sequential work (one waits)
- Option 2: Split into smaller branches
- Option 3: Pair on same session (one drives)

## Bug Handling & Quality Gates

### Pre-Commit Quality Checklist

```
Before committing any task:
- TypeScript compiles (npm run typecheck)
- Related tests pass (npm test)
- Manual smoke test of affected UI
- Form inputs validate within valid ranges
- Error states are handled gracefully
```

### Bug Discovery Categories

| When Discovered | Action | Priority |
|-----------------|--------|----------|
| During implementation | Fix immediately | Immediate |
| During Human QA (same epic) | Fix before moving on | High |
| During Human QA (different epic) | Add to Bugs Epic | Medium |
| Production/later testing | Add to Bugs Epic with severity | Based on severity |

### Decision Tree: Fix Now vs Defer

```
Bug discovered during QA
├── Is it blocking the current feature?
│   └── YES -> Fix immediately
├── Is it small (<15 min fix)?
│   └── YES -> Fix immediately
├── Is it related to current epic?
│   └── YES -> Fix before epic completion
└── Otherwise -> Add to Bugs Epic, prioritize later
```

## Communication Checklist

- [ ] Claimed epic in status/CURRENT.md before starting
- [ ] Working on dedicated branch
- [ ] Not modifying files outside my epic
- [ ] Updating status at end of each session
- [ ] Adding learnings with name/date
- [ ] Syncing main before starting new epic
- [ ] Waiting for dependency epics to merge first
