import { GoogleGenAI, Type } from '@google/genai';
import { GEMINI_API_KEY, PRIMARY_MODEL, FALLBACK_MODEL } from '../config/env';
import { AppError, handleGeminiError } from '../utils/errors';
import { logGeminiStart, logGeminiEnd } from '../utils/logger';
import { getSkinSystemInstruction, SKIN_USER_PROMPT } from '../prompts/skin.prompt';
import { getChatSystemInstruction } from '../prompts/chat.prompt';
import { safeParseJson } from '../utils/jsonParser';

// Create a single shared GoogleGenAI client
export const ai = GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
        timeout: 30000 // 30 seconds client library timeout configuration
      }
    })
  : null;

// Timeout promise that rejects after 30 seconds
const timeoutPromise = (ms: number) =>
  new Promise<never>((_, reject) =>
    setTimeout(() => reject(new AppError('Gemini request timed out.', 504, 'GEMINI_TIMEOUT')), ms)
  );

/**
 * Standardized AI execution pipeline with fallback, logs, timeout, and exceptions wrapper
 */
export async function executeGemini(
  params: {
    contents: any;
    config?: any;
  },
  requestId: string,
  endpoint: string
): Promise<{ response: any; latency: number; modelUsed: string }> {
  if (!ai) {
    throw new AppError('Server configuration error: Gemini API key missing.', 500, 'GEMINI_MISSING');
  }

  logGeminiStart(requestId, endpoint, PRIMARY_MODEL);
  const startTime = Date.now();

  try {
    // Attempt Primary Model execution
    const geminiPromise = ai.models.generateContent({
      model: PRIMARY_MODEL,
      contents: params.contents,
      config: params.config,
    });

    const response = await Promise.race([geminiPromise, timeoutPromise(30000)]);
    const latency = Date.now() - startTime;

    return { response, latency, modelUsed: PRIMARY_MODEL };
  } catch (primaryError: any) {
    // Check if it is a timeout error
    if (primaryError instanceof AppError && primaryError.statusCode === 504) {
      logGeminiEnd(requestId, 504, Date.now() - startTime, 'Failed');
      throw primaryError;
    }

    console.warn(`[WARNING] Primary model (${PRIMARY_MODEL}) failed. Attempting fallback... Error:`, primaryError.message || primaryError);

    // Attempt Fallback Model execution
    const fallbackStartTime = Date.now();
    try {
      const geminiPromise = ai.models.generateContent({
        model: FALLBACK_MODEL,
        contents: params.contents,
        config: params.config,
      });

      const response = await Promise.race([geminiPromise, timeoutPromise(30000)]);
      const latency = Date.now() - startTime;
      const fallbackLatency = Date.now() - fallbackStartTime;
      console.log(`[INFO] Fallback model (${FALLBACK_MODEL}) succeeded in ${fallbackLatency}ms`);

      return { response, latency, modelUsed: FALLBACK_MODEL };
    } catch (fallbackError: any) {
      logGeminiEnd(requestId, fallbackError.status || 500, Date.now() - startTime, 'Failed');
      throw handleGeminiError(fallbackError);
    }
  }
}

/**
 * Diagnostic skin scanner helper
 */
export async function generateSkinAnalysis(
  imagePart: any,
  availableProducts: any[],
  requestId: string
): Promise<{ parsedData: any; latency: number; parserTime: number }> {
  const systemInstruction = getSkinSystemInstruction(availableProducts);
  const contents = [
    {
      role: 'user',
      parts: [
        imagePart,
        { text: SKIN_USER_PROMPT }
      ]
    }
  ];

  const config = {
    systemInstruction,
    responseMimeType: 'application/json',
    responseSchema: skinAnalysisSchema
  };

  const { response, latency } = await executeGemini({ contents, config }, requestId, '/api/analyze-skin');

  const text = response.text || '';
  const parseStart = Date.now();
  let parsedData;
  try {
    parsedData = safeParseJson(text);
  } catch (parseError: any) {
    logGeminiEnd(requestId, 200, latency, 'Failed');
    throw new AppError('Unable to parse Gemini response.', 500, 'JSON_PARSE_ERROR');
  }

  const parserTime = Date.now() - parseStart;
  logGeminiEnd(requestId, 200, latency, 'Success');

  return { parsedData, latency, parserTime };
}

/**
 * Generative conversational chat coach helper
 */
export async function generateChat(
  messages: any[],
  currentReport: any | null,
  requestId: string
): Promise<{ text: string; latency: number }> {
  const systemInstruction = getChatSystemInstruction(currentReport);
  
  const contents = messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  const config = {
    systemInstruction
  };

  const { response, latency } = await executeGemini({ contents, config }, requestId, '/api/chat');
  logGeminiEnd(requestId, 200, latency, 'N/A');
  return { text: response.text || '', latency };
}

/**
 * Backend diagnostics probe
 */
export async function healthCheck(requestId: string): Promise<{ success: boolean; model: string; latency: number; configured: boolean }> {
  const contents = 'Hello';
  const config = {
    maxOutputTokens: 5
  };

  const { latency } = await executeGemini({ contents, config }, requestId, '/api/test-gemini');

  return {
    success: true,
    model: PRIMARY_MODEL,
    latency: latency,
    configured: true
  };
}

// Structured schema for skin analysis JSON returns
const skinAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    isValid: {
      type: Type.BOOLEAN,
      description: "True if the image is a valid face or skin close-up with sufficient lighting and clarity; false otherwise."
    },
    validationError: {
      type: Type.STRING,
      description: "If isValid is false, describe the reason (e.g., 'Image is too dark, please capture with clear lighting'). Otherwise empty string."
    },
    score: {
      type: Type.OBJECT,
      properties: {
        overall: { type: Type.INTEGER, description: "Overall skin wellness score from 0 to 100." },
        hydration: { type: Type.INTEGER, description: "Hydration level from 0 to 100." },
        oilControl: { type: Type.INTEGER, description: "Oil and sebum regulation score from 0 to 100." },
        barrier: { type: Type.INTEGER, description: "Moisture barrier health score from 0 to 100." },
        clarity: { type: Type.INTEGER, description: "Blemish and pigmentation clearance from 0 to 100." },
        texture: { type: Type.INTEGER, description: "Skin smoothness and tone uniformity from 0 to 100." }
      },
      required: ["overall", "hydration", "oilControl", "barrier", "clarity", "texture"]
    },
    skinType: {
      type: Type.STRING,
      description: "The diagnosed primary skin type: Oily, Dry, Combination, Sensitive, or Normal."
    },
    concerns: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Array of detected dermatological concerns."
    },
    analysis: {
      type: Type.OBJECT,
      properties: {
        redness: { type: Type.STRING, description: "Analysis of redness or erythema." },
        pores: { type: Type.STRING, description: "Analysis of pores size and clogging." },
        wrinkles: { type: Type.STRING, description: "Analysis of elasticity, fine lines or wrinkles." },
        oiliness: { type: Type.STRING, description: "Analysis of oil production or dry patches." },
        dryness: { type: Type.STRING, description: "Analysis of dehydration, flakiness or dry textures." },
        acne: { type: Type.STRING, description: "Analysis of active blackheads, papules or pimples." },
        pigmentation: { type: Type.STRING, description: "Analysis of sun spots, dark circles or acne scars." }
      },
      required: ["redness", "pores", "wrinkles", "oiliness", "dryness", "acne", "pigmentation"]
    },
    routine: {
      type: Type.OBJECT,
      properties: {
        morning: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              step: { type: Type.INTEGER },
              category: { type: Type.STRING, description: "Cleanser, Toner, Serum, Moisturizer, Sunscreen, etc." },
              name: { type: Type.STRING, description: "E.g., Gentle Foaming Wash" },
              purpose: { type: Type.STRING },
              instructions: { type: Type.STRING },
              activeIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
              timeOfDay: { type: Type.STRING }
            },
            required: ["step", "category", "name", "purpose", "instructions", "activeIngredients", "timeOfDay"]
          }
        },
        evening: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              step: { type: Type.INTEGER },
              category: { type: Type.STRING },
              name: { type: Type.STRING },
              purpose: { type: Type.STRING },
              instructions: { type: Type.STRING },
              activeIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
              timeOfDay: { type: Type.STRING }
            },
            required: ["step", "category", "name", "purpose", "instructions", "activeIngredients", "timeOfDay"]
          }
        }
      },
      required: ["morning", "evening"]
    },
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          brand: { type: Type.STRING },
          name: { type: Type.STRING },
          category: { type: Type.STRING },
          tier: { type: Type.STRING, description: "Must be 'Budget', 'Mid-range', or 'Premium'." },
          reason: { type: Type.STRING, description: "Why this fits the user's specific skin findings." },
          activeIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          confidenceScore: { type: Type.INTEGER },
          expectedTimeline: { type: Type.STRING, description: "E.g., '2-4 weeks'" }
        },
        required: ["brand", "name", "category", "tier", "reason", "activeIngredients", "confidenceScore", "expectedTimeline"]
      }
    }
  },
  required: ["isValid", "validationError", "score", "skinType", "concerns", "analysis", "routine", "recommendations"]
};
