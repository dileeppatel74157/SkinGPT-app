import { Request, Response, NextFunction } from 'express';
import { GEMINI_API_KEY, PRIMARY_MODEL } from '../config/env';
import { AppError } from '../utils/errors';

/**
 * Validates backend Gemini configuration status
 */
export function validateGeminiConfig(req: Request, res: Response, next: NextFunction) {
  if (!GEMINI_API_KEY) {
    return res.status(500).json({
      error: 'Server configuration error: Gemini API key missing.'
    });
  }
  if (!PRIMARY_MODEL) {
    return res.status(500).json({
      error: 'Server configuration error: Gemini model configuration missing.'
    });
  }
  next();
}

/**
 * Validates skin scanner analyze request payload
 */
export function validateSkinScanPayload(req: Request, res: Response, next: NextFunction) {
  const { image } = req.body;
  if (!image) {
    return res.status(400).json({
      error: 'Image is required for skin analysis.'
    });
  }
  
  // Validate basic base64 data string format or URL length
  if (typeof image !== 'string' || image.length < 50) {
    return res.status(400).json({
      error: 'Invalid image format provided.'
    });
  }

  next();
}

/**
 * Validates chat endpoint request payload
 */
export function validateChatPayload(req: Request, res: Response, next: NextFunction) {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({
      error: 'Chat messages are required.'
    });
  }

  if (messages.length === 0) {
    return res.status(400).json({
      error: 'Chat message queue cannot be empty.'
    });
  }

  const lastMessage = messages[messages.length - 1];
  if (!lastMessage || lastMessage.role !== 'user' || !lastMessage.text) {
    return res.status(400).json({
      error: 'The last message must be from the user.'
    });
  }

  next();
}
