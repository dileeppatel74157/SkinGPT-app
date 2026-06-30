import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import compression from 'compression';

dotenv.config();

// Prevent silent crashes for unhandled errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Gemini API Validation
if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable.");
}

// Define standardized model names
const PRIMARY_MODEL = 'gemini-3.5-flash';
const FALLBACK_MODEL = 'gemini-1.5-flash';

// Initialize Gemini client with user-agent for telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const getGeminiClient = (req: express.Request) => {
  const customKey = req.headers['x-gemini-key'] as string;
  if (customKey && customKey.trim()) {
    return new GoogleGenAI({
      apiKey: customKey.trim(),
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
};

// Standardized fallback helper function
async function generateContentWithFallback(
  client: GoogleGenAI,
  params: {
    contents: any;
    config?: any;
  }
) {
  try {
    return await client.models.generateContent({
      model: PRIMARY_MODEL,
      contents: params.contents,
      config: params.config,
    });
  } catch (primaryError: any) {
    console.warn(`Primary model (${PRIMARY_MODEL}) failed. Retrying with fallback model (${FALLBACK_MODEL}). Error:`, primaryError?.message || primaryError);
    try {
      return await client.models.generateContent({
        model: FALLBACK_MODEL,
        contents: params.contents,
        config: params.config,
      });
    } catch (fallbackError) {
      console.error(`Fallback model (${FALLBACK_MODEL}) also failed. Error:`, fallbackError);
      throw fallbackError;
    }
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Enable Gzip compression
  app.use(compression());

  // Request logger middleware
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    });
    next();
  });

  // Health endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      uptime: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'production'
    });
  });

  // Disable caching for APIs
  app.use('/api', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

  // Increase request size limits to handle base64 images
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Helper to extract clean base64 data and mimeType
  const parseBase64Image = (dataString: string) => {
    const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return {
        mimeType: 'image/jpeg',
        data: dataString
      };
    }
    return {
      mimeType: matches[1],
      data: matches[2]
    };
  };

  // 1. AI Skin Analysis Endpoint
  app.post(['/api/analyze', '/api/analyze-skin'], async (req, res) => {
    try {
      const { image } = req.body;
      if (!image) {
        return res.status(400).json({ error: 'Image is required for skin analysis.' });
      }

      const { mimeType, data } = parseBase64Image(image);

      const imagePart = {
        inlineData: {
          mimeType,
          data
        }
      };

      const systemInstruction = `You are an elite, board-certified dermatological AI assistant.
Your task is to analyze the provided close-up face/skin photo and generate a highly detailed, personalized, and scientific skin analysis report in JSON format.
Follow these crucial guidelines:
1. First, perform Image Validation: Verify if the photo is a valid skin or face picture. If it is too blurry, too dark, not a skin/face, or lacks adequate resolution, set "isValid" to false and explain why in "validationError".
2. If valid, analyze the overall skin characteristics. Set "isValid" to true.
3. Calculate scores (0-100 scale) for overall quality, hydration, oilControl, barrier, clarity, and texture.
4. Identify the skin type (Oily, Dry, Combination, Sensitive, or Normal).
5. Identify specific skin concerns (e.g., "Active inflammatory acne", "Dehydration lines", "Congested pores", "Erythema on cheeks", "Mild hyperpigmentation").
6. Provide qualitative scientific descriptions of: redness, pores, wrinkles, oiliness, dryness, acne, and pigmentation.
7. Recommend a highly optimized, custom Morning and Evening skincare routine.
8. Recommend 3 highly effective products with Budget, Mid-range, and Premium tiers. Include specific active ingredients (e.g., Niacinamide, Salicylic Acid, Ceramides) and explain exactly why they were recommended.
9. Always output educational, supportive, transparent explanations. Emphasize that this is an educational AI assessment and NOT a medical diagnosis.`;

      const responseSchema = {
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

      const response = await generateContentWithFallback(getGeminiClient(req), {
        contents: [
          imagePart,
          { text: 'Analyze this skin image and respond with the requested skin analysis JSON schema.' }
        ],
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema
        }
      });

      let parsedData;
      try {
        parsedData = JSON.parse(response.text || '{}');
      } catch (parseError) {
        console.error('Failed to parse Gemini response as JSON. Raw response:', response.text, parseError);
        return res.status(500).json({
          error: 'Gemini returned invalid JSON.'
        });
      }
      res.json(parsedData);
    } catch (error: any) {
      console.error('Analysis error:', error);
      res.status(500).json({
        error: process.env.NODE_ENV === 'production' ? 'Server-side skin analysis failed.' : (error?.message || 'Server-side skin analysis failed.')
      });
    }
  });

  // 2. AI Skincare Consultant Chat Endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, currentReport } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Chat messages are required.' });
      }

      let systemInstruction = `You are "SkinGPT", a highly sympathetic, expert AI Skincare Coach and Cosmetic Chemist.
Your goal is to answer questions about ingredients, skincare routines, product suggestions, and lifestyle habits.
Always focus on evidence-based skin science, ingredient compatibility, and skin health.

`;

      if (currentReport && currentReport.isValid) {
        systemInstruction += `Here is the current skin report of the user you are consulting with:
- Skin Type: ${currentReport.skinType}
- Overall Score: ${currentReport.score?.overall}/100
- Hydration: ${currentReport.score?.hydration}/100, Oil Control: ${currentReport.score?.oilControl}/100, Barrier: ${currentReport.score?.barrier}/100
- Major Skin Concerns: ${currentReport.concerns?.join(', ')}
- Analysis Details:
  * Redness: ${currentReport.analysis?.redness}
  * Pores: ${currentReport.analysis?.pores}
  * Acne: ${currentReport.analysis?.acne}
  * Dryness: ${currentReport.analysis?.dryness}
  * Pigmentation: ${currentReport.analysis?.pigmentation}

Provide highly personalized answers referencing their skin profile naturally where helpful. Do not say "Based on the JSON skin report I was given...". Talk directly like an expert who examined their profile.
`;
      } else {
        systemInstruction += `The user has not completed a skin scan yet. Offer general expert advice and kindly suggest they take a scan for a highly personalized evaluation.`;
      }

      systemInstruction += `\n\nRULES:
1. Always be supportive, clinical, yet warm and informative.
2. Educate on ingredients (INCI names, how they work, pH levels, compatibility).
3. If users ask to combine incompatible ingredients (e.g. Vitamin C and Retinol in the same step), explain the science clearly and offer a better routine layout.
4. Keep answers concise, beautiful, readable, and structured using markdown, bullet points, and headers.
5. Remind users that your advice is for educational and routine optimization purposes, not medical diagnoses.`;

      const lastMessage = messages[messages.length - 1];
      if (!lastMessage || lastMessage.role !== 'user') {
        return res.status(400).json({ error: 'The last message must be from the user.' });
      }

      const contents = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const response = await generateContentWithFallback(getGeminiClient(req), {
        contents: contents,
        config: {
          systemInstruction
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error('Chat error:', error);
      res.status(500).json({
        error: process.env.NODE_ENV === 'production' ? 'Server-side chat assistant failed.' : (error?.message || 'Server-side chat assistant failed.')
      });
    }
  });

  // 3. Test Gemini API Key Connection Endpoint
  app.post('/api/test-gemini', async (req, res) => {
    try {
      const customKey = req.headers['x-gemini-key'] as string;
      if (!customKey || !customKey.trim()) {
        return res.status(400).json({ success: false, error: 'API Key is missing.' });
      }

      const testClient = new GoogleGenAI({
        apiKey: customKey.trim(),
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build-test',
          }
        }
      });

      // Simple test prompt to verify key validity quickly
      await generateContentWithFallback(testClient, {
        contents: 'Hello',
        config: {
          maxOutputTokens: 5
        }
      });

      res.json({ success: true });
    } catch (error: any) {
      console.error('Test API Key error:', error);
      res.status(400).json({
        success: false,
        error: process.env.NODE_ENV === 'production' ? 'API key test failed. Please verify the key.' : (error?.message || 'API key test failed. Please verify the key.')
      });
    }
  });

  // Serve static assets in production, otherwise pass to Vite
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, {
      maxAge: '1y',
      etag: true,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        } else {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      }
    }));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global Error Handler Middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled server error:', err);
    res.status(err.status || 500).json({
      error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : (err.message || 'Internal Server Error')
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\nSkinGPT Server Started`);
    console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
    console.log(`Node: ${process.version}`);
    console.log(`Listening on port ${PORT}\n`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
});
