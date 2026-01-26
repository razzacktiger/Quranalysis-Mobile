# Agent Dispatch Rules

How the orchestrator decides which agent type to deploy for a task.

## Decision Tree

```
Is this task about...?

├─ Prompts, AI responses, LLM integration
│  └─ → prompt-agent
│
├─ React hooks, API clients, services, business logic
│  └─ → prompt-agent
│
├─ UI components, screens, modals, forms
│  ├─ Is it complex UI (L/XL size)?
│  │  └─ → ui-agent with frontend-design skill
│  └─ Simple component?
│     └─ → ui-agent (standard)
│
├─ Package installation, config files, environment setup
│  └─ → setup-agent
│
├─ E2E tests, unit tests, test utilities
│  └─ → test-agent
│
├─ Code review, quality check, bug hunting
│  └─ → review-agent
│
└─ Research, exploration, understanding code
   └─ → (Use Task with Explore subagent, not these agents)
```

## Task Type Markers

Tasks in TASKS.md often include markers. Use these to dispatch:

| Marker | Agent Type |
|--------|------------|
| `Type: API` | prompt-agent |
| `Type: Hook` | prompt-agent |
| `Type: Prompt` | prompt-agent |
| `Type: Service` | prompt-agent |
| `Type: UI` | ui-agent |
| `Type: Component` | ui-agent |
| `Type: Screen` | ui-agent |
| `Type: Config` | setup-agent |
| `Type: Setup` | setup-agent |
| `Type: Test` | test-agent |
| `Type: E2E` | test-agent |

## Size Considerations

| Size | Recommendation |
|------|----------------|
| S | Single agent, quick execution |
| M | Single agent, standard workflow |
| L | Consider splitting into sub-tasks OR use architect phase |
| XL | Must split into sub-tasks, multiple agents |

## Parallel Execution Rules

### Can Run in Parallel
- Tasks with no shared file dependencies
- Tasks in different features (e.g., 4.1 and 4.3)
- Setup tasks while planning implementation tasks

### Must Run Sequentially
- Tasks where output of A is input to B
- Tasks modifying same files
- Implementation before tests for that implementation

## Example: EPIC-4 Dispatch Plan

```
Feature 4.1 (AI Integration):
├─ 4.1.1 Setup Firebase AI     → setup-agent    [DONE]
├─ 4.1.2 Session Prompt        → prompt-agent   [Can start]
├─ 4.1.3 Mistake Prompt        → prompt-agent   [After 4.1.2]
└─ 4.1.4 useAIChat Hook        → prompt-agent   [After 4.1.2, 4.1.3]

Feature 4.2 (Chat UI):
├─ 4.2.1 ChatMessage           → ui-agent       [After 4.1.4 interface]
├─ 4.2.2 ChatModal             → ui-agent + frontend-design [After 4.2.1]
├─ 4.2.3 Confirmation Screen   → ui-agent + frontend-design [After 4.2.2]
├─ 4.2.4 FloatingButton        → ui-agent       [Can parallel with 4.2.1]
└─ 4.2.5 E2E Tests             → test-agent     [After 4.2.1-4.2.4]

Feature 4.3 (Voice):
├─ 4.3.1 Setup expo-speech     → setup-agent    [Can parallel with 4.1.2]
├─ 4.3.2 useVoiceInput Hook    → prompt-agent   [After 4.3.1]
├─ 4.3.3 VoiceInputButton      → ui-agent       [After 4.3.2]
└─ 4.3.4 E2E Tests             → test-agent     [After 4.3.3]

Parallel Groups:
- Group A: 4.1.2 + 4.3.1 (no dependencies)
- Group B: 4.2.4 + 4.1.3 (if 4.1.2 done)
- Group C: Review agents after each feature
```

## Orchestrator Checklist

Before dispatching an agent:

1. [ ] Identify task type from TASKS.md
2. [ ] Check dependencies - are prerequisites complete?
3. [ ] Gather context files agent needs
4. [ ] Select relevant standards
5. [ ] Decide: parallel or sequential?
6. [ ] Compose agent prompt from template
7. [ ] Launch with appropriate subagent_type
8. [ ] Track in session CURRENT.md
