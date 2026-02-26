import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

// The library automatically picks up GEMINI_API_KEY or GOOGLE_API_KEY from env
// Ensure we don't try to initialize in the browser without a key
export const ai = (typeof window === 'undefined')
    ? new GoogleGenAI({ apiKey })
    : {} as ReturnType<() => GoogleGenAI>;
