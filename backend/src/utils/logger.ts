import { NODE_ENV, GEMINI_API_KEY } from '../config/env';

export function logGeminiStart(requestId: string, endpoint: string, model: string) {
  const envLabel = NODE_ENV.charAt(0).toUpperCase() + NODE_ENV.slice(1);
  const isKeyLoaded = !!GEMINI_API_KEY;

  console.log(`===================================

Request ID

${requestId}

Endpoint

${endpoint}

Model

${model}

Environment

${envLabel}

Gemini Key

${isKeyLoaded ? 'Loaded' : 'NOT FOUND'}

===================================`);
}

export function logGeminiEnd(
  requestId: string,
  status: number | string,
  latencyMs: number,
  jsonParseStatus: 'Success' | 'Failed' | 'N/A'
) {
  console.log(`===================================

Request ID

${requestId}

Gemini Status

${status}

Latency

${latencyMs} ms

JSON Parse

${jsonParseStatus}

===================================`);
}
