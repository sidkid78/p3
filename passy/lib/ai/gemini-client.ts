import { GoogleGenAI } from '@google/genai';

// The library automatically picks up GEMINI_API_KEY or GOOGLE_API_KEY from env
export const ai = new GoogleGenAI({});
