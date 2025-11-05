import { Langfuse } from 'langfuse';

/**
 * Langfuse client for LLM observability and tracing
 *
 * Used to track:
 * - Cloud AI outfit recommendations
 * - Prompt performance metrics
 * - User feedback on AI suggestions
 * - Cost tracking for LLM API calls
 */

let langfuseClient: Langfuse | null = null;

/**
 * Initialize Langfuse client with environment credentials
 * Call this once at app startup if cloud AI is enabled
 */
export function initLangfuse(): Langfuse | null {
  const publicKey = process.env.EXPO_PUBLIC_LANGFUSE_PUBLIC_KEY;
  const secretKey = process.env.EXPO_PUBLIC_LANGFUSE_SECRET_KEY;
  const baseUrl = process.env.EXPO_PUBLIC_LANGFUSE_BASE_URL;

  // Skip initialization if credentials not provided
  if (!publicKey || !secretKey) {
    console.log('[Langfuse] Credentials not configured, skipping initialization');
    return null;
  }

  if (!langfuseClient) {
    langfuseClient = new Langfuse({
      publicKey,
      secretKey,
      baseUrl: baseUrl || 'https://cloud.langfuse.com',
    });
    console.log('[Langfuse] Client initialized');
  }

  return langfuseClient;
}

/**
 * Get the Langfuse client instance
 * Returns null if not initialized or credentials not provided
 */
export function getLangfuse(): Langfuse | null {
  return langfuseClient;
}

/**
 * Shutdown Langfuse client and flush pending events
 * Call this on app shutdown to ensure all traces are sent
 */
export async function shutdownLangfuse(): Promise<void> {
  if (langfuseClient) {
    await langfuseClient.shutdownAsync();
    langfuseClient = null;
    console.log('[Langfuse] Client shut down');
  }
}

/**
 * Example: Track an outfit recommendation generation
 *
 * @param userId - User identifier
 * @param weather - Weather conditions
 * @param preferences - User preferences
 * @param result - Generated outfit
 * @param metadata - Additional context
 */
export async function trackOutfitRecommendation(
  userId: string,
  weather: any,
  preferences: any,
  result: any,
  metadata?: Record<string, any>
) {
  const client = getLangfuse();
  if (!client) return;

  const trace = client.trace({
    name: 'outfit-recommendation',
    userId,
    metadata: {
      temperature: weather.temperature,
      precipitation: weather.precipitation,
      wind: weather.wind,
      ...metadata,
    },
  });

  const generation = trace.generation({
    name: 'generate-outfit',
    input: {
      weather,
      preferences,
    },
    output: result,
    model: 'heuristic-v1', // Change to LLM model when Cloud AI is implemented
  });

  // Ensure trace is flushed
  await client.flushAsync();
}

/**
 * Example: Track user feedback on an outfit recommendation
 *
 * @param traceId - ID of the recommendation trace
 * @param score - User rating (e.g., 1-5)
 * @param comment - Optional user comment
 */
export async function trackOutfitFeedback(
  traceId: string,
  score: number,
  comment?: string
) {
  const client = getLangfuse();
  if (!client) return;

  client.score({
    traceId,
    name: 'user-rating',
    value: score,
    comment,
  });

  await client.flushAsync();
}
