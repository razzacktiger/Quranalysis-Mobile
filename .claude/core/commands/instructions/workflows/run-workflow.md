---
description: Execute a saved workflow from guides/
---

# Run Workflow

Execute a predefined workflow with guided phases and checkpoints.

## Input
$ARGUMENTS = workflow name (e.g., "epic-revision", "new-feature")

## Available Workflows

| Name | File | Purpose |
|------|------|---------|
| `epic-revision` | guides/workflows/epic-revision-workflow.md | Reconsider epic technologies |
| `new-feature` | (use: research → spec → create) | Build feature from scratch |
| `daily` | (built-in) | /start-epic → /next-task loop |

## Step 1: Load Workflow

Read `guides/workflows/{workflow-name}-workflow.md`.

If not found, check `guides/workflows/{workflow-name}.md`.

If not found, list available workflows and ask user to choose.

## Step 2: Parse Phases

Extract phases from the workflow file:
- Look for `## Phase N:` headers
- Identify the skill/command for each phase
- Note required inputs and outputs
- Identify checkpoint questions

## Step 3: Display Workflow Overview

Show the user:
```markdown
## Workflow: {name}

**Phases:**
1. {Phase 1 name} - {skill}
2. {Phase 2 name} - {skill}
3. {Phase 3 name} - {skill}
...

**Estimated outputs:**
- {files that will be created}

Ready to begin Phase 1?
```

## Step 4: Execute Phases

For each phase:

### 4a. Announce Phase
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE {N}: {Name}
Skill: /{skill-name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4b. Gather Required Inputs
If phase needs user input (e.g., topic for /research-tech):
- Ask user to collect
- Or use outputs from previous phase

### 4c. Execute Skill
Run the appropriate skill with gathered inputs.

### 4d. Checkpoint
After each phase, ask:
```
Phase {N} complete.
Output: {files created or modified}

Options:
1. Continue to Phase {N+1}
2. Repeat this phase with different input
3. Skip to Phase {X}
4. Exit workflow (progress saved)
```

## Step 5: Track Progress

Update `state/session.json` notes with workflow progress:
```
"notes": [
  "Workflow: {name} - Phase {N}/{total} complete",
  "Output: specs/RESEARCH-x.md"
]
```

This allows resuming if session is cleared.

## Step 6: Completion

When all phases complete:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WORKFLOW COMPLETE: {name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Outputs created:
- specs/RESEARCH-{topic}.md
- specs/FEATURE-{name}.md
- epics/active/EPIC-N-*/

Next: Run `/start-epic N-name` to begin implementation
```

---

## Built-in Workflows

### epic-revision
Reconsider technologies for an existing epic.
```
Phase 1: /research-tech (repeat for each topic)
Phase 2: /spec-feature
Phase 3: /create-epic add-to EPIC-N
Phase 4: /start-epic N-name
```

### new-feature
Create a new feature from scratch.
```
Phase 1: /research-tech (if needed)
Phase 2: /spec-feature
Phase 3: /create-epic new N-name
Phase 4: /start-epic N-name
```

### daily
Standard daily development workflow.
```
Phase 1: /start-epic (or resume)
Phase 2: /next-task (loop until done)
Phase 3: /end-session
```

---

## Example Usage

```
User: /run-workflow epic-revision

Agent:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WORKFLOW: Epic Revision
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Phases:**
1. Research Technologies - /research-tech
2. Specify Feature - /spec-feature
3. Update Epic - /create-epic
4. Start Implementation - /start-epic

Which epic are you revising? [EPIC-4, EPIC-5, other]

User: EPIC-4

Agent:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 1: Research Technologies
Skill: /research-tech
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What technologies need research for EPIC-4?
(Current: Gemini API, Speech Recognition)

User: LLM APIs and voice input options

Agent: *Runs /research-tech for each topic*
...

Phase 1 complete.
Outputs:
- specs/RESEARCH-llm-apis.md
- specs/RESEARCH-voice-input.md

Continue to Phase 2 (Specify Feature)?
```

---

## Resuming Workflows

If a workflow is interrupted:

```
User: /run-workflow epic-revision

Agent:
Found incomplete workflow "epic-revision" from earlier session
(check state/session.json notes):
- Phase 1: ✅ Complete (specs/RESEARCH-llm-apis.md)
- Phase 2: ⬜ Pending
- Phase 3: ⬜ Pending
- Phase 4: ⬜ Pending

Options:
1. Resume from Phase 2
2. Start fresh
3. View Phase 1 outputs first
```

---

## Creating Custom Workflows

To add a new workflow:

1. Create `guides/{name}-workflow.md`
2. Use this structure:
```markdown
# {Name} Workflow

## When to Use
{description}

## Phase 1: {Name}
**Skill:** /skill-name
**Inputs:** {what's needed}
**Outputs:** {what's created}

## Phase 2: {Name}
...
```

3. The skill will auto-detect phases from `## Phase N:` headers
