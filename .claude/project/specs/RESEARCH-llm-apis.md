# Research: LLM APIs for React Native

## Date
2026-01-20 (Updated with latest 2026 models and pricing)

## Question
Which LLM API is best for a React Native/Expo app that needs to extract structured session and mistake data from natural language input (text and voice)?

## Requirements
- Expo SDK 54 compatibility
- Structured JSON output with schema validation
- Cost-effective for mobile usage (short conversations)
- Reliable extraction of Quranic session metadata
- Support for conversational follow-ups

---

## Current Model Pricing (January 2026)

| Model | Input/1M tokens | Output/1M tokens | Notes |
|-------|-----------------|------------------|-------|
| **Gemini 3 Flash** | $0.50 | $3.00 | Free tier available, latest |
| **Gemini 2.5 Flash** | $0.15 | $0.60 | Best value for high-volume |
| **Gemini 2.5 Flash-Lite** | $0.10 | $0.40 | Cheapest option |
| **Gemini 2.5 Pro** | $1.25 | $10.00 | Best quality/value balance |
| **Gemini 3 Pro Preview** | $2.00 | $12.00 | Latest flagship (preview) |
| Claude 3.5 Sonnet | $3.00 | $15.00 | Best language understanding |
| Claude 3.5 Haiku | $0.25 | $1.25 | Budget Claude |
| GPT-5 | $1.25 | $10.00 | Competitive flagship |
| GPT-4o mini | $0.15 | $0.60 | Budget GPT |

**Free Tier (Gemini via Google AI Studio):** 15 RPM, 250K tokens/min, 1000 req/day

---

## Options Evaluated

### Option 1: Vercel AI SDK + Provider Gateway

**Overview:**
The AI SDK is the leading TypeScript toolkit for building AI applications with 20+ million monthly downloads. Provides unified API across providers.

**Pros:**
- Unified API - switch providers with one-line change
- Official Expo support (requires SDK 52+)
- `useChat` hook abstracts chat complexity
- `useObject` for structured JSON streaming
- Works with OpenAI, Anthropic, Google, and 15+ providers
- Zod schema integration for type-safe outputs
- Active development, well-documented

**Cons:**
- Streaming requires `expo/fetch` polyfill
- Native fetch in React Native doesn't support streaming natively
- Adds abstraction layer (larger bundle)
- Requires backend API route for production (security)

**Pricing:** Depends on underlying provider (pass-through)

**Expo Compatible:** Yes (Expo 52+)

**Integration Effort:** M

**Code Example:**
```typescript
import { useChat } from '@ai-sdk/react';
import { fetch as expoFetch } from 'expo/fetch';

const { messages, handleSubmit, input } = useChat({
  fetch: expoFetch as unknown as typeof globalThis.fetch,
  api: generateAPIUrl('/api/chat'),
});
```

---

### Option 2: Firebase AI Logic (Gemini)

**Overview:**
Firebase's official way to call Gemini API from mobile apps. Recently added React Native support (April 2025).

**Pros:**
- Official React Native support from Google
- Secure client-side API calls with Firebase auth
- Free tier for development (generous limits)
- `responseSchema` for structured JSON output
- Built-in rate limiting and security
- No backend required for prototyping
- Gemini 3 Flash available (fast, cheap)

**Cons:**
- Vendor lock-in to Firebase/Google ecosystem
- Requires Firebase project setup
- Gemini models may have less nuanced language understanding than Claude/GPT
- Schema validation is server-side only (no Zod integration)
- Less flexible than direct API calls

**Pricing:**
- Free tier: Generous for development
- Pay-as-you-go: ~$0.075/1M input tokens, ~$0.30/1M output tokens (Flash)
- Context caching can reduce costs by 75%

**Expo Compatible:** Yes

**Integration Effort:** M

**Code Example:**
```typescript
import { initializeApp } from 'firebase/app';
import { getAI, getGenerativeModel } from 'firebase/ai';

const model = getGenerativeModel(ai, {
  model: 'gemini-3-flash',
  generationConfig: {
    responseMimeType: 'application/json',
    responseSchema: sessionExtractionSchema,
  },
});
```

---

### Option 3: Direct Anthropic API (Claude)

**Overview:**
Direct HTTP calls to Claude API with structured outputs (public beta since Nov 2025).

**Pros:**
- Best language understanding (minimal hallucinations)
- Native structured outputs with constrained decoding
- Excellent at following complex extraction schemas
- TypeScript SDK with Zod support
- 200K token context window
- Best for nuanced, domain-specific extraction

**Cons:**
- No official React Native SDK
- Must handle API calls manually
- API key exposure risk in client-side code
- Higher cost than Gemini Flash
- Requires backend proxy for production

**Pricing:**
- Claude 3.5 Sonnet: $3/1M input, $15/1M output
- Claude 3.5 Haiku: $0.25/1M input, $1.25/1M output
- Structured outputs available on Sonnet 4.5, Opus 4.1+

**Expo Compatible:** Yes (via fetch)

**Integration Effort:** S-M

**Code Example:**
```typescript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01',
    'anthropic-beta': 'structured-outputs-2025-11-13',
  },
  body: JSON.stringify({
    model: 'claude-3-5-sonnet-20241022',
    messages,
    system: systemPrompt,
  }),
});
```

---

### Option 4: Direct OpenAI API (GPT)

**Overview:**
Industry standard with mature structured outputs (100% schema compliance).

**Pros:**
- Most mature structured outputs (since Aug 2024)
- 100% schema compliance on evals
- Large ecosystem and community
- GPT-4o mini is very cost-effective
- Responses API with better structured output support

**Cons:**
- No official React Native SDK
- API key security concerns for client-side
- GPT-4o can be expensive for heavy usage
- Assistants API being deprecated (Aug 2026)

**Pricing:**
- GPT-4o mini: $0.15/1M input, $0.60/1M output
- GPT-4o: $2.50/1M input, $10/1M output
- GPT-5 nano: $0.05/1M input, $0.40/1M output

**Expo Compatible:** Yes (via fetch)

**Integration Effort:** S-M

---

### Option 5: Hybrid - Vercel AI SDK + Claude/Gemini

**Overview:**
Use Vercel AI SDK for unified interface, but deploy with Claude or Gemini as backend.

**Pros:**
- Best of both worlds: unified API + quality models
- Easy provider switching during development
- `useChat` hook for React Native
- Structured output via `useObject`
- Backend API route handles security

**Cons:**
- Requires backend (Expo API routes or separate server)
- More complex setup
- Two layers of abstraction

**Expo Compatible:** Yes

**Integration Effort:** M-L

---

### Option 6: OpenRouter (API Aggregator)

**Overview:**
Universal API gateway providing access to 300+ models from 60+ providers through a single endpoint.

**Pros:**
- Access 300+ models (Gemini, Claude, GPT, Llama, Mistral, etc.)
- Single API key for all providers
- No markup on model pricing (pass-through)
- Automatic fallback between models
- Easy A/B testing of different models
- OpenAI-compatible API (works with Vercel AI SDK)
- Volume discounts for enterprise

**Cons:**
- Additional latency (extra network hop)
- 5.5% platform fee on credit purchases
- Dependency on third-party service
- Some advanced features may not be fully supported

**Pricing:**
- Model costs: Pass-through (no markup)
- Platform fee: 5.5% on credit purchases (min $0.80)
- Crypto payments: 5.0% flat

**Expo Compatible:** Yes (OpenAI-compatible API)

**Integration Effort:** S

**Code Example:**
```typescript
import { openrouter } from '@ai-sdk/openrouter';

const result = await generateObject({
  model: openrouter('google/gemini-2.5-flash'),
  schema: sessionExtractionSchema,
  prompt: userInput,
});

// Easy to switch models:
// model: openrouter('anthropic/claude-3.5-sonnet')
// model: openrouter('openai/gpt-4o')
```

---

## Comparison Matrix

| Criteria | AI SDK | Firebase AI | OpenRouter | Claude Direct | OpenAI Direct |
|----------|--------|-------------|------------|---------------|---------------|
| Expo 54 Support | Yes | Yes | Yes | Yes | Yes |
| Structured Output | Yes (Zod) | Yes (Schema) | Provider-based | Yes (Beta) | Yes (Mature) |
| Streaming | With polyfill | Yes | Yes | Manual | Manual |
| Cost (per 1M tokens) | Provider-based | $0.10-3.00 | Pass-through | $0.25-15 | $0.15-10 |
| Language Quality | Provider-based | Good-Excellent | Provider-based | Excellent | Excellent |
| Security | Backend needed | Built-in | Backend needed | Backend needed | Backend needed |
| Setup Complexity | Medium | Medium | Low | Low | Low |
| Provider Lock-in | None | Google | None | Anthropic | OpenAI |
| Model Flexibility | High | Gemini only | 300+ models | Claude only | OpenAI only |

---

## Recommendation

**Primary: Firebase AI Logic + Gemini 2.5 Flash**

### Rationale:

1. **Cost-Effective**: Gemini 2.5 Flash at $0.15/$0.60 per 1M tokens is excellent value. Free tier for development.

2. **Built-in Security**: Firebase handles API key security - no need for backend proxy during MVP.

3. **React Native Support**: Official React Native SDK since April 2025.

4. **Structured Output**: Native `responseSchema` support for JSON extraction.

5. **Ecosystem Fit**: If already using Firebase/Supabase, easy integration.

6. **Upgrade Path**: Can test Claude/GPT via OpenRouter if Gemini quality insufficient.

### Alternative: OpenRouter + Gemini/Claude

For maximum flexibility:
- Same Gemini pricing (pass-through)
- Easy A/B testing between models
- Single API for experimentation
- Switch to Claude if extraction quality needs improvement

### When to Consider Claude

Upgrade to Claude if:
- Gemini struggles with Quranic terminology extraction
- Need more nuanced conversational follow-ups
- Accuracy is more important than cost

---

## Integration Notes

### For This Codebase (Expo SDK 54):

#### Option A: Firebase AI Logic (Recommended for MVP)

1. **Install packages:**
```bash
npx expo install firebase @react-native-firebase/app
npm install @firebase/ai
```

2. **Configure Firebase** (`lib/firebase.ts`):
```typescript
import { initializeApp } from 'firebase/app';
import { getAI, getGenerativeModel } from '@firebase/ai';

const firebaseConfig = {
  // Your Firebase config
};

const app = initializeApp(firebaseConfig);
const ai = getAI(app);

export const geminiModel = getGenerativeModel(ai, {
  model: 'gemini-2.5-flash',
  generationConfig: {
    responseMimeType: 'application/json',
    responseSchema: sessionExtractionSchema,
  },
});
```

3. **Create hook** (`lib/hooks/useAIChat.ts`):
```typescript
import { geminiModel } from '@/lib/firebase';

export function useAIChat() {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async (content: string) => {
    const result = await geminiModel.generateContent(content);
    const response = JSON.parse(result.response.text());
    return response;
  };

  return { messages, sendMessage };
}
```

#### Option B: Vercel AI SDK + Gemini (For Streaming)

1. **Install packages:**
```bash
npx expo install ai @ai-sdk/react @ai-sdk/google
```

2. **Create API route** (`app/api/chat+api.ts`):
```typescript
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export async function POST(request: Request) {
  const { messages } = await request.json();
  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages,
    system: SESSION_EXTRACTION_PROMPT,
  });
  return result.toDataStreamResponse();
}
```

3. **Create hook** (`lib/hooks/useAIChat.ts`):
```typescript
import { useChat } from '@ai-sdk/react';
import { fetch as expoFetch } from 'expo/fetch';

export function useAIChat() {
  return useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: '/api/chat',
  });
}
```

4. **Add env variable:**
```bash
GOOGLE_GENERATIVE_AI_API_KEY=...  # Server-side only
```

### Schema Integration:

Create Zod schema for structured output:
```typescript
// lib/validation/ai.ts
import { z } from 'zod';

export const sessionExtractionSchema = z.object({
  session: z.object({
    duration_minutes: z.number().optional(),
    session_type: z.enum(SESSION_TYPES).optional(),
    performance_score: z.number().min(0).max(10).optional(),
  }),
  portions: z.array(z.object({
    surah_name: z.string(),
    ayah_start: z.number(),
    ayah_end: z.number(),
  })),
  mistakes: z.array(z.object({
    error_category: z.string(),
    severity_level: z.number(),
  })),
  missing_fields: z.array(z.string()),
  follow_up_question: z.string().nullable(),
  confidence: z.enum(['high', 'medium', 'low']),
});
```

---

---

## Research Process Notes

**Friction identified during research:**
1. Initial search did not include latest models (Gemini 2.5, 3.0) - should have explicitly searched for "2026 models"
2. Did not proactively research API aggregators (OpenRouter) which are widely used
3. Relied on outdated pricing information initially

**Improvements for future research:**
- Always search for "{topic} 2026 latest" to get current information
- Include aggregator/gateway options in API research
- Verify pricing against official sources before recommending

---

## References

- [Gemini API Pricing 2026](https://ai.google.dev/gemini-api/docs/pricing)
- [Gemini 3 Developer Guide](https://ai.google.dev/gemini-api/docs/gemini-3)
- [OpenRouter Pricing](https://openrouter.ai/pricing)
- [Vercel AI SDK - Expo Getting Started](https://ai-sdk.dev/docs/getting-started/expo)
- [Firebase AI Logic - React Native Support](https://firebase.blog/posts/2025/04/vertex-ai-updates/)
- [Claude Structured Outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)
- [OpenAI Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs)
- [LLM Pricing Comparison](https://pricepertoken.com/)
- [Firebase AI Logic - Structured Output](https://firebase.google.com/docs/ai-logic/generate-structured-output)
