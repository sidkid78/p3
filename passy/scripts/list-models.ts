import { GoogleGenAI } from '@google/genai';

async function listModels() {
    const ai = new GoogleGenAI({});
    try {
        const response = await ai.models.list();
        console.log("Available models:", response.models);
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
