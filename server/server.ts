import express from 'express';
import path from 'path';
import compression from 'compression';
import admin from 'firebase-admin';
import { createServer as createViteServer } from 'vite';
import { PORT, NODE_ENV } from './config/env';
import analyzeRouter from './routes/analyze';
import chatRouter from './routes/chat';
import healthRouter from './routes/health';
import { errorHandler } from './middleware/errorHandler';

// Initialize Firebase Admin SDK
admin.initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID || 'gen-lang-client-0336297688'
});

async function startServer() {
  const app = express();

  // Enable Gzip compression
  app.use(compression());

  // Manually inject secure security headers (Helmet equivalent)
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader(
      'Content-Security-Policy',
      `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://accounts.google.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com;
      img-src 'self' data: blob: https:;
      connect-src 'self' https://*.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://accounts.google.com;
      frame-src 'self' https://accounts.google.com;
      `.replace(/\s{2,}/g, ' ').trim()
    );
    next();
  });

  // Manually configure CORS (CORS middleware equivalent)
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Request logger middleware
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    });
    next();
  });

  // Disable caching for APIs
  app.use('/api', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

  // Configure upload limits
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Basic Health route
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      uptime: Math.floor(process.uptime()),
      environment: NODE_ENV
    });
  });

  // Mount API routers
  app.use(analyzeRouter);
  app.use(chatRouter);
  app.use(healthRouter);

  // Serve static assets in production, otherwise pass to Vite
  if (NODE_ENV !== 'production') {
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

  // Error handling middleware
  app.use(errorHandler as any);

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[INFO] Server listening on port ${PORT}`);
    console.log(`Server Ready`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
});
