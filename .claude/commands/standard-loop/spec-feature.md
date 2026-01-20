---
description: Guided feature specification with codebase analysis
---

# Specify Feature

Create a detailed feature specification through guided questions and codebase analysis.

## Input
$ARGUMENTS = feature description (e.g., "session favorites")

## Step 1: Understand Request
Parse description for:
- Core functionality
- User-facing changes
- Technical areas affected

## Step 2: Explore Codebase
Launch code-explorer agent:
- Related components
- Similar patterns
- Affected data structures
- Existing APIs that might be reused

## Step 3: Clarifying Questions
Use AskUserQuestion for:
- UI placement (be specific about options!)
- Scope (MVP vs full)
- Integration points
- Constraints
- Priority

## Step 4: Check Research
If tech decisions needed:
- Check specs/RESEARCH-*.md for existing research
- Suggest /research-tech if missing

## Step 5: Determine Epic Placement
Ask: "This relates to [domain]. Should I:
1. Add to existing active epic?
2. Reopen archived epic [name]?
3. Create new epic?"

## Step 6: Generate Spec
Create `specs/FEATURE-{name}.md`:
```markdown
# Feature: {Name}

## Overview
{1-2 paragraph description}

## User Stories
- As a user, I can...
- As a user, I see...

## Technical Decisions
- {decision 1}: {choice} - {rationale}
- {decision 2}: {choice} - {rationale}

## UI/UX Requirements
- Location: {where in app}
- Layout: {description or ASCII sketch}
- States: {loading, empty, error, success}

## Data Requirements
- New types: {list}
- Schema changes: {list}
- API changes: {list}

## Acceptance Criteria
- [ ] {criterion 1}
- [ ] {criterion 2}

## Out of Scope
- {what we're NOT doing}

## Dependencies
- Requires: {epics/features}
- Research: {link to research if applicable}
```

## Step 7: Record Metrics
Update meta/session/CURRENT.md

## Step 8: Report
"Spec created at specs/FEATURE-{name}.md"
"Review, then /create-epic to convert to tasks"

## Example Usage
```
User: /spec-feature session favorites
Agent: *Asks clarifying questions*
Agent: *Creates specs/FEATURE-favorites.md*
```
