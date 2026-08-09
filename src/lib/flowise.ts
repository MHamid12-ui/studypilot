const FLOWISE_API_PROXY = '/api/flowise-proxy';

export interface FlowiseContext {
  userId: string;
  sessionId: string;
  userName?: string;
  educationLevel?: string;
  subject?: string;
  subtopic?: string;
}

export interface FlowiseResponse {
  text: string;
  [key: string]: unknown;
}

/**
 * Sends a question to the Flowise AI Tutor via the application's proxy endpoint.
 * The proxy ensures no CORS issues and keeps secrets server-side.
 */
export async function queryFlowise(
  question: string,
  context: FlowiseContext
): Promise<string> {
  const TIMEOUT_MS = 90000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(FLOWISE_API_PROXY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        question,
        streaming: false,
        overrideConfig: {
          // Unique sessionId per user ensures isolation between accounts
          sessionId: `${context.userId}-${context.sessionId}`,
          vars: {
            userName: context.userName || '',
            educationLevel: context.educationLevel || 'high_school',
            subject: context.subject || '',
            subtopic: context.subtopic || '',
          },
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'Unknown error');
      throw new Error(
        `Flowise API error (${response.status}): ${errorBody}`
      );
    }

    const data: FlowiseResponse = await response.json();

    if (!data.text) {
      throw new Error('Flowise returned an empty response');
    }

    return data.text;
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error(`Flowise request timed out after ${TIMEOUT_MS / 1000} seconds`);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}