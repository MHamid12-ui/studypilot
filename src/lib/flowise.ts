const FLOWISE_API_HOST = 'https://cloud.flowiseai.com';
const FLOWISE_CHATFLOW_ID = 'a56eb5e1-dae2-4b14-896d-ed599739d64d';
const FLOWISE_API_URL = `${FLOWISE_API_HOST}/api/v1/prediction/${FLOWISE_CHATFLOW_ID}`;

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
  // Flowise may include additional fields
  [key: string]: unknown;
}

export async function queryFlowise(
  question: string,
  context: FlowiseContext
): Promise<string> {
  const response = await fetch(FLOWISE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question,
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
}