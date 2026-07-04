import express from 'express';
import compression from 'compression';
import { initializeApp, cert } from 'firebase-admin/app';
import helmet from 'helmet';
import cors from 'cors';
import { PORT, NODE_ENV } from './config/env';
import analyzeRouter from './routes/analyze';
import chatRouter from './routes/chat';
import healthRouter from './routes/health';
import { errorHandler } from './middleware/errorHandler';

// Initialize Firebase Admin SDK using service account cert parameters if provided
if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID || 'gen-lang-client-0336297688',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
  });
  console.log('[INFO] Firebase Admin initialized using Service Account Certificate.');
} else {
  initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || 'gen-lang-client-0336297688'
  });
  console.log('[INFO] Firebase Admin initialized using default project credentials.');
}

async function startServer() {
  const app = express();

  // Enable Gzip compression
  app.use(compression());

  // Set HTTP security headers with Helmet
  app.use(helmet());

  // Configure strict CORS origins
  console.log("FRONTEND_URL =", process.env.FRONTEND_URL);
  const allowedOrigins = [
    "https://skingpt-app.vercel.app",
    "https://skingpt.vercel.app",
    "http://localhost:5173"
  ];

  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }

  console.log("Allowed Origins:", allowedOrigins);

  app.use(cors({
    origin: (origin, callback) => {
      console.log("Incoming Origin:", origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked Origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['X-Requested-With', 'Content-Type', 'Authorization']
  }));

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

  // Body parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // Basic health endpoint
  app.get('/api/health', (req, res) => {
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

  // Centralized error handling middleware
  app.use(errorHandler as any);

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[INFO] Server listening on port ${PORT}`);
    console.log(`Server Ready`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
});
