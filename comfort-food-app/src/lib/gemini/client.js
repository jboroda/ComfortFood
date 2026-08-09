import { GoogleGenAI } from '@google/genai';

// bump this if we want to try a different model later, one place to change it
export const MODEL_NAME = 'gemini-3.5-flash';

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
