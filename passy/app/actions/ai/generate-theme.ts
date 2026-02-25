"use server";

import { ai } from "@/lib/ai/gemini-client";
import { Type } from "@google/genai";

export async function generateTheme(userInput: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on the user's input: "${userInput}", generate a creative baby shower theme.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            themeName: { type: Type.STRING, description: 'The name of the theme.' },
            description: { type: Type.STRING, description: 'Brief description of the theme.' },
            colorPalette: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Hex codes for the theme color palette (3-5 colors).'
            },
            imagePrompts: {
              type: Type.OBJECT,
              properties: {
                venue: { type: Type.STRING },
                invitation: { type: Type.STRING },
                cake: { type: Type.STRING }
              }
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Keywords for the theme.'
            }
          },
          propertyOrdering: ["themeName", "description", "colorPalette", "imagePrompts", "tags"],
          required: ["themeName", "description", "colorPalette", "imagePrompts", "tags"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error generating theme:", error);
    throw new Error("Failed to generate theme");
  }
}
