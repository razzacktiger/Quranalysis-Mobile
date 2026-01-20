# Debugging Session Issues

## Context Overflow

**Symptoms:** Responses get truncated, Claude forgets earlier context

**Fix:**
```bash
/compact          # Summarize and continue
# OR
/clear            # Fresh start, reference status/CURRENT.md
```

## Stuck / Blocked

**Symptoms:** Same error repeated, no progress

**Escalation Protocol:**

1. **After 1st failure - ASSESS:**
   - Human-required? (env vars, API keys, design decisions) -> **Ask immediately**
   - Code/logic issue? -> Check learnings/, try again

2. **After 2nd failure:** Research (Context7, web search)

3. **After 3rd failure:** Stop and ask human - don't waste tokens

**Always human-required:**
- Missing environment variables
- OAuth/external service config
- Design or UX decisions
- Ambiguous requirements

**Fix:**
1. Document issue in learnings/
2. Start fresh session with more specific prompt
3. Consider breaking task into smaller pieces

## Wrong File Edits

**Symptoms:** Claude edits wrong files or locations

**Fix:**
1. Be explicit: "Edit ONLY lib/auth.ts"
2. Provide line numbers when possible
3. Use "Read X first, then edit" pattern

## High Token Usage

**Symptoms:** Costs higher than expected

**Fix:**
1. Check `/context` for MCP bloat
2. Use smaller model for simple tasks
3. Fresh sessions more frequently
4. More specific file reads
5. Load only relevant doc modules

## Quick Reference Commands

```bash
/context          # Check context usage
/clear            # Fresh conversation
/compact          # Summarize to save space
/cost             # View costs (if available)
/mcp              # List MCP servers
/tasks            # View background tasks
```

## Prompt Anti-Patterns

| Bad | Good |
|-----|------|
| "Fix the auth" | "Fix the token refresh in lib/auth.ts line 45" |
| "Make it better" | "Reduce bundle size by code-splitting routes" |
| "Add tests" | "Add unit tests for calculateStreak() in stats.ts" |
| "Update the UI" | "Add loading skeleton to SessionList component" |
