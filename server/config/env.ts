import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const PORT = process.env.PORT || '10000';
export const NODE_ENV = process.env.NODE_ENV || 'production';
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim() || '';
export const PRIMARY_MODEL = 'gemini-2.5-flash';
export const FALLBACK_MODEL = 'gemini-1.5-flash';

// Format environments label for startup logging
const envLabel = NODE_ENV.charAt(0).toUpperCase() + NODE_ENV.slice(1);
const isConfigured = !!GEMINI_API_KEY;

console.log(`====================================

SkinGPT Startup

Environment

${envLabel}

Gemini

${isConfigured ? 'Loaded' : 'NOT CONFIGURED'}

Primary Model

${PRIMARY_MODEL}

Port

${PORT}

====================================`);
