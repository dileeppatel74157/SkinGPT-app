import express from 'express';
  import { verifyFirebaseToken, checkRateLimit } from '../middleware/auth';
  import { validateGeminiConfig, validateSkinScanPayload } from '../middleware/validateGemini';
  import { generateRequestId } from '../utils/requestId';
  import { runSkinAnalysis } from '../services/analysis.service';
  import { incrementUsage } from '../services/storage.service';

  const router = express.Router();

  const handleSkinScan = async (req: any, res: express.Response, next: express.NextFunction) => {
    const requestId = generateRequestId('skin');
    const startTime = Date.now();
    
    try {
      const { image } = req.body;
      const { parsedData, latency, parserTime } = await runSkinAnalysis(image, requestId);
      
      const totalTime = Date.now() - startTime;
      
      // Phase 12 Console Performance logging
      console.log(`Upload 0ms\nGemini ${latency}ms\nParser ${parserTime}ms\nTotal ${totalTime}ms`);
      
      await incrementUsage(req.user.uid, 'scan');
      res.json(parsedData);
    } catch (error: any) {
      next(error);
    }
  };

  router.post('/api/analyze-skin', verifyFirebaseToken as any, checkRateLimit('scan') as any, validateGeminiConfig, validateSkinScanPayload, handleSkinScan as any);
  router.post('/api/analyze', verifyFirebaseToken as any, checkRateLimit('scan') as any, validateGeminiConfig, validateSkinScanPayload, handleSkinScan as any);

  export default router;
