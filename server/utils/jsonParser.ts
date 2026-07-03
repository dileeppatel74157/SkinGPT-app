/**
 * Safely parses JSON from a string that might contain markdown fences,
 * leading/trailing conversational text, or whitespace.
 */
export function safeParseJson(text: string): any {
  if (!text) {
    throw new Error("No text provided for JSON parsing.");
  }

  const trimmed = text.trim();
  
  // Try direct parsing first
  try {
    return JSON.parse(trimmed);
  } catch (e) {
    // Direct parsing failed, proceed to try block extraction
  }

  const firstBrace = trimmed.indexOf('{');
  const firstBracket = trimmed.indexOf('[');
  
  let startIdx = -1;
  let endIdx = -1;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
    endIdx = trimmed.lastIndexOf('}');
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
    endIdx = trimmed.lastIndexOf(']');
  }

  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    throw new Error("Could not detect any JSON object or array structure in the response.");
  }

  const jsonStr = trimmed.substring(startIdx, endIdx + 1);
  
  try {
    return JSON.parse(jsonStr);
  } catch (error: any) {
    throw new Error(`JSON structure was found but could not be parsed: ${error.message}`);
  }
}
