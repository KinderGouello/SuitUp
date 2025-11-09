# AI & Prompt Engineering

This directory contains AI-related functionality for SuitUp, including heuristic algorithms, LLM observability, and prompt testing infrastructure.

## Overview

SuitUp currently uses a **heuristic algorithm** for outfit recommendations ([heuristics.ts](./heuristics.ts:1)). Future versions will support **Cloud AI** using LLMs for more sophisticated recommendations.

## Files

- **[heuristics.ts](./heuristics.ts:1)** - Current outfit recommendation algorithm (rule-based)
- **[langfuse.ts](./langfuse.ts:1)** - Langfuse client for LLM observability and tracing
- **README.md** - This file

## Langfuse Integration

### What is Langfuse?

[Langfuse](https://langfuse.com/) is an open-source LLM engineering platform that provides:
- **Tracing**: Track all LLM calls with inputs, outputs, and metadata
- **Metrics**: Monitor latency, cost, and quality metrics
- **Evaluations**: Score outputs and compare prompt versions
- **Feedback**: Collect user ratings and comments

### Setup

1. **Create a Langfuse account** at [cloud.langfuse.com](https://cloud.langfuse.com)

2. **Get your API keys** from the Langfuse dashboard

3. **Add credentials to `.env`**:
   ```bash
   EXPO_PUBLIC_LANGFUSE_PUBLIC_KEY=pk-lf-...
   EXPO_PUBLIC_LANGFUSE_SECRET_KEY=sk-lf-...
   EXPO_PUBLIC_LANGFUSE_BASE_URL=https://cloud.langfuse.com
   ```

4. **Initialize Langfuse** in your app:
   ```typescript
   import { initLangfuse } from '@/lib/ai/langfuse';

   // Call once at app startup (if Cloud AI is enabled)
   initLangfuse();
   ```

### Usage Examples

#### Track an Outfit Recommendation

```typescript
import { trackOutfitRecommendation } from '@/lib/ai/langfuse';

const outfit = await generateOutfitWithLLM(items, preferences, weather);

await trackOutfitRecommendation(
  userId,
  weather,
  preferences,
  outfit,
  { version: 'v1.2' }
);
```

#### Collect User Feedback

```typescript
import { trackOutfitFeedback } from '@/lib/ai/langfuse';

// After user rates an outfit
await trackOutfitFeedback(
  traceId,  // from the original recommendation
  4,        // rating 1-5
  'Loved the color combination!'
);
```

#### Custom Tracing

```typescript
import { getLangfuse } from '@/lib/ai/langfuse';

const langfuse = getLangfuse();
if (langfuse) {
  const trace = langfuse.trace({
    name: 'custom-operation',
    userId: 'user-123',
    metadata: { version: '1.0' },
  });

  const generation = trace.generation({
    name: 'llm-call',
    model: 'gpt-4',
    input: { prompt: '...' },
    output: { result: '...' },
  });

  await langfuse.flushAsync();
}
```

### Best Practices

- **Initialize once**: Call `initLangfuse()` at app startup
- **Flush on shutdown**: Call `shutdownLangfuse()` when app closes
- **Add metadata**: Include version, user context, and relevant tags
- **Collect feedback**: Use user ratings to evaluate prompt quality
- **Monitor costs**: Track token usage and API costs in Langfuse dashboard

## Promptfoo Integration

### What is Promptfoo?

[Promptfoo](https://promptfoo.dev/) is a tool for testing and evaluating LLM prompts. It helps you:
- **Compare prompts**: Test multiple prompt versions side-by-side
- **Test across models**: Evaluate same prompt on different LLMs
- **Automated testing**: Assert expected behaviors and outputs
- **Regression testing**: Ensure prompt changes don't break existing behavior

### Setup

1. **API keys are already installed** (via npm)

2. **Add LLM API keys to `.env`**:
   ```bash
   OPENAI_API_KEY=sk-...
   ANTHROPIC_API_KEY=sk-ant-...
   ```

3. **Configuration** is in [.promptfooconfig.yaml](../../.promptfooconfig.yaml:1)

### Running Tests

```bash
# Run all prompt tests
pnpm test:prompts

# Run tests and open web UI
pnpm test:prompts:ui

# Run specific test
npx promptfoo eval --config .promptfooconfig.yaml
```

### Project Structure

```
SuitUp/
├── .promptfooconfig.yaml       # Main configuration
├── prompts/                     # Prompt templates
│   ├── outfit-recommendation.txt
│   └── outfit-recommendation-v2.txt
└── lib/ai/
    └── test-cases/              # Test data (create as needed)
        └── scenarios.json
```

### Creating Test Cases

Test cases are defined in [.promptfooconfig.yaml](../../.promptfooconfig.yaml:1). Each test includes:

```yaml
tests:
  - vars:
      weather_temp: 28
      weather_precipitation: 0
      style_preference: 'casual'
      available_items: |
        - White t-shirt
        - Blue jeans
        - Sneakers
    assert:
      - type: contains
        value: 't-shirt'
      - type: not-contains
        value: 'jacket'
```

### Assertion Types

- **`contains`**: Output must contain a string
- **`not-contains`**: Output must NOT contain a string
- **`contains-any`**: Output must contain at least one of the values
- **`javascript`**: Custom JavaScript validation
- **`llm-rubric`**: Use an LLM to grade the output
- **`similar`**: Semantic similarity check

### Example Scenarios

We've included test cases for:
- ☀️ **Sunny summer day** - Light, casual outfit
- 🌧️ **Rainy cold day** - Waterproof layers
- 👔 **Business meeting** - Formal attire
- 🏋️ **Gym workout** - Athletic wear

### Adding New Tests

1. **Add test case** to `.promptfooconfig.yaml`:
   ```yaml
   - vars:
       weather_temp: 15
       weather_description: 'windy'
       style_preference: 'streetwear'
   ```

2. **Add assertions**:
   ```yaml
   assert:
     - type: contains
       value: 'windproof'
   ```

3. **Run tests**:
   ```bash
   pnpm test:prompts
   ```

## Cloud AI Roadmap

When implementing Cloud AI recommendations:

1. ✅ **Setup complete**: Langfuse and Promptfoo infrastructure ready
2. 🔄 **Next steps**:
   - Create LLM-based recommendation function
   - Test prompts using Promptfoo
   - Integrate Langfuse tracing
   - A/B test heuristic vs. LLM recommendations
   - Collect user feedback through Langfuse

## Cost Estimation

Current recommendation algorithm is **free** (heuristic-based).

Estimated Cloud AI costs (using GPT-3.5-turbo):
- **Per recommendation**: ~500 tokens ≈ $0.001
- **Per month** (2 recs/day): ~$0.06
- **Annual cost**: ~$0.70 per user

## Resources

- [Langfuse Documentation](https://langfuse.com/docs)
- [Promptfoo Documentation](https://promptfoo.dev/docs/intro)
- [OpenAI API Pricing](https://openai.com/api/pricing/)
- [Anthropic API Pricing](https://anthropic.com/pricing)

## Questions?

See [CLAUDE.md](../../CLAUDE.md:1) for general project documentation or reach out to the team.
