---
description: Create a detailed feature specification
---

# /spec-feature

Research and create a detailed feature specification before implementation.

## Parameters

| Param | Required | Description |
|-------|----------|-------------|
| `feature_name` | Yes | Name of the feature to specify |
| `research_first` | No | Whether to research technologies first |

## State Operations

**Reads:**
- Existing specs in `project/specs/`
- Relevant learnings from `state/learnings-index.json`

**Writes:**
- Create spec file: `project/specs/SPEC-{feature-name}.md`

## Spec Template

- Problem statement
- Proposed solution
- Technical approach
- Dependencies
- Acceptance criteria
- Task breakdown (preliminary)

## Execution

**Read and follow the full instructions:**
→ `core/commands/instructions/standard-loop/spec-feature.md`

**Schema reference:**
→ `core/commands/schemas/spec-feature.schema.json`
