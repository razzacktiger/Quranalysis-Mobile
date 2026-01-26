---
description: Research latest technologies/APIs before implementation decisions
---

# Research Technology

Research and evaluate technology options for a feature requirement.

## Input
$ARGUMENTS = technology/feature area (e.g., "voice transcription React Native")

## Step 1: Web Search
Use WebSearch for current (2026) options:
- "$ARGUMENTS best practices 2026"
- "$ARGUMENTS React Native Expo comparison"
- "$ARGUMENTS API pricing"

## Step 2: Query Documentation
For top 2-3 candidates:
- Check official documentation
- Look for integration examples
- Review known issues

## Step 3: Analyze Against Codebase
Use code-explorer agent:
- Existing patterns in lib/
- Expo compatibility
- Bundle size concerns

## Step 4: Output
Create `specs/RESEARCH-{topic}.md` with:
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

## References
{links to docs, examples}
```

## Step 5: Record in Session
Update `state/session.json`:
- Add note about research completed
- Update files_read with any docs consulted

## Step 6: Report
"Research complete. See specs/RESEARCH-{topic}.md"
"Ready for /spec-feature?"

## Example Usage
```
User: /research-tech voice transcription React Native
Agent: *Researches options, creates specs/RESEARCH-voice-transcription.md*
```
