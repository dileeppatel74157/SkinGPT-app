import express from 'express';
import { generateRequestId } from '../utils/requestId';
import { healthCheck } from '../services/gemini.service';
import { validateGeminiConfig } from '../middleware/validateGemini';

const router = express.Router();

const handleHealthCheck = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const requestId = generateRequestId('chat');
  try {
    const result = await healthCheck(requestId);
    res.json(result);
  } catch (error: any) {
    next(error);
  }
};

router.get('/api/test-gemini', validateGeminiConfig, handleHealthCheck as any);
router.post('/api/test-gemini', validateGeminiConfig, handleHealthCheck as any);

export default router;
