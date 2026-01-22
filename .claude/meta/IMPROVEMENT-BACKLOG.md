# Improvement Backlog

## How to Add
- Agents: Add when encountering friction
- User: Add anytime you notice inefficiency
- Auto: /end-session detects red flags

## Template
| ID | Source | Issue/Idea | Impact | Effort | Status |
|----|--------|------------|--------|--------|--------|

## Backlog

| ID | Source | Issue/Idea | Impact | Effort | Status |
|----|--------|------------|--------|--------|--------|
| I-001 | Setup | Initial backlog created | - | - | Done |
| I-002 | Session | Research docs used "Vertex AI" but Firebase renamed it to "Firebase AI Logic" - update research template to note naming can change | Low | S | Open |
| I-003 | Session | Firebase setup wizard shows native iOS steps (Swift/Xcode) that don't apply to Expo - add note in task docs to skip native setup steps | Med | S | Open |
| I-004 | Session | AbortSignal.any polyfill needed for Firebase AI in React Native - already added to learnings | Med | S | Done |
| I-005 | Session | Initial agent system design missed workflow integration (git, status, metrics). Cause: Focused on MIT research pattern without mapping to existing workflow first. Fix: Always audit existing workflow before designing new systems. Added orchestrator.md, report-format.md, /agent-complete, /agent-dispatch to fix. | Med | M | Done |
| I-006 | Session | Jest can't parse Firebase ESM modules (@firebase/ai, @firebase/util). Need to configure transformIgnorePatterns and possibly mock Firebase for unit tests. Current workaround: use `npx tsx scripts/test-ai-extraction.ts` for manual testing. | Med | M | Open |
| I-007 | Session | Task 4.2.3 context exhaustion: 6 bugs found during testing after full implementation. Cause: No incremental testing, no code-reviewer before user testing, L-size task with 4 components. Fix: Run code-reviewer per component, test incrementally, consider splitting large UI tasks. | High | M | Open |

## Completed

| ID | Implemented | Impact Measured |
|----|-------------|-----------------|
| - | - | - |
