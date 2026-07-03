import express from 'express';
import { verifyFirebaseToken, checkRateLimit } from '../middleware/auth';
import { validateGeminiConfig, validateChatPayload } from '../middleware/validateGemini';
import { generateRequestId } from '../utils/requestId';
import { generateChat } from '../services/gemini.service';
import { incrementUsage } from '../services/storage.service';

const router = express.Router();

router.post('/api/chat', verifyFirebaseToken as any, checkRateLimit('chat') as any, validateGeminiConfig, validateChatPayload, async (req: any, res: express.Response, next: express.NextFunction) => {
  const requestId = generateRequestId('chat');
  const startTime = Date.now();
  
  try {
    const { messages, currentReport } = req.body;
    const { text, latency } = await generateChat(messages, currentReport, requestId);
    
    const totalTime = Date.now() - startTime;
    
    // Performance log console print
    console.log(`Upload 0ms\nGemini ${latency}ms\nParser 0ms\nTotal ${totalTime}ms`);
    
    await incrementUsage(req.user.uid, 'chat');
    res.json({ text });
  } catch (error: any) {
    next(error);
  }
});

export default router;
