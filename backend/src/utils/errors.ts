export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function handleGeminiError(error: any): AppError {
  const errMsg = error?.message || '';
  const errStack = error?.stack || '';

  // Check for rate limits or quota issues
  if (errMsg.includes('quota') || errMsg.includes('limit') || errMsg.includes('429')) {
    return new AppError('Gemini quota exceeded.', 429, 'GEMINI_QUOTA_EXCEEDED');
  }

  // Check for timeouts
  if (errMsg.includes('timeout') || errMsg.includes('DEADLINE_EXCEEDED') || errMsg.includes('timed out')) {
    return new AppError('Gemini request timed out.', 504, 'GEMINI_TIMEOUT');
  }

  // Fallback for general server or API errors
  return new AppError('Server configuration error.', 500, 'GEMINI_SERVER_ERROR');
}
