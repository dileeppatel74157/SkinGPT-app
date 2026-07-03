import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const PORT = process.env.PORT || '10000';
export const NODE_ENV = process.env.NODE_ENV || 'production';
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim() || '';
export const FRONTEND_URL = process.env.FRONTEND_URL?.trim() || 'https://skingpt.vercel.app';
export const PRIMARY_MODEL = 'gemini-2.5-flash';
export const FALLBACK_MODEL = 'gemini-1.5-flash';

// Format environments label for startup logging
const envLabel = NODE_ENV.charAt(0).toUpperCase() + NODE_ENV.slice(1);
const isConfigured = !!GEMINI_API_KEY;
const isFirebaseCertConfigured = !!(process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY);

console.log(`====================================
SkinGPT Backend Startup
Environment:    ${envLabel}
Gemini Key:     ${isConfigured ? 'LOADED' : 'NOT CONFIGURED'}
Firebase Cert:  ${isFirebaseCertConfigured ? 'LOADED' : 'NOT CONFIGURED'}
Primary Model:  ${PRIMARY_MODEL}
Frontend URL:   ${FRONTEND_URL}
Port:           ${PORT}
====================================`);
