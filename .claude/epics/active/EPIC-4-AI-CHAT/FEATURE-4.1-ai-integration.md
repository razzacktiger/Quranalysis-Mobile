# Feature 4.1: AI Integration

## Overview
Setup Gemini API and create extraction prompts for sessions and mistakes.

## Tasks

| ID | Task | Size | Status | TDD | Notes |
|----|------|------|--------|-----|-------|
| 4.1.1 | Research & Setup Gemini API Client | M | Not Started | - | RESEARCH FIRST |
| 4.1.2 | Create Session Extraction Prompt | L | Not Started | - | - |
| 4.1.3 | Create Mistake Extraction Prompt | L | Not Started | - | - |
| 4.1.4 | Create useAIChat Hook | M | Not Started | - | - |

## Acceptance Criteria
- [ ] Gemini API works in React Native/Expo
- [ ] Session details extracted from natural language
- [ ] Mistake details extracted with Quranic terminology
- [ ] Chat state managed with accumulated extractions

## Research Checklist (4.1.1)
- [ ] Check `@google/generative-ai` npm page for React Native compatibility
- [ ] Search for "Gemini API React Native 2025" for current best practices
- [ ] Check if REST API is more reliable than SDK in RN environment
- [ ] Verify model names (may have changed)

## Prompt Output Schema (Session)
```json
{
  "session": { "duration_minutes", "session_type", "performance_score", "session_goal" },
  "portions": [{ "surah_name", "ayah_start", "ayah_end", "recency_category" }],
  "missing_fields": [],
  "follow_up_question": null,
  "confidence": "high|medium|low"
}
```

## Prompt Output Schema (Mistakes)
```json
{
  "mistakes": [{ "portion_surah", "error_category", "error_subcategory", "severity_level", "ayah_number" }],
  "follow_up_question": null,
  "confidence": "high|medium|low"
}
```
