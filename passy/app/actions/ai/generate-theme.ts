"use server";

import { ai } from "@/lib/ai/gemini-client";
import { Type } from "@google/genai";

export async function generateTheme(userInput: string, history: { role: string; content: string }[] = []) {
  try {
    const chatContext = history.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n');

    // First, generate the theme concepts and descriptions
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on the conversation history:\n${chatContext}\n\nUser's latest request: "${userInput}"\n\nGenerate a creative baby shower theme concept. Provide a brief description, a 4-5 color palette (hex codes), keywords, and detailed visual prompts for 5 mood board images: Venue, Cake, Invitations, Decor, and Table Settings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            themeName: { type: Type.STRING },
            description: { type: Type.STRING },
            colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } },
            images: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  prompt: { type: Type.STRING },
                  aspect: { type: Type.STRING, enum: ['16/10', '1/1'] }
                },
                required: ["title", "prompt", "aspect"]
              }
            },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            aiResponse: { type: Type.STRING }
          },
          required: ["themeName", "description", "colorPalette", "images", "tags", "aiResponse"]
        }
      }
    });

    const themeData = JSON.parse(response.text || '{}');

    // Second, generate images for each concept using generateContent
    const imagesWithUrls = await Promise.all(themeData.images.map(async (img: any) => {
      try {
        // Try gemini-3-pro-image-preview first
        const imgResponse = await ai.models.generateContent({
          model: 'gemini-3-pro-image-preview',
          contents: `High-fidelity, professional photography, baby shower inspiration: ${img.prompt}. Glassmorphic aesthetics, elegant lighting, soft colors.`,
        });

        const part = imgResponse.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (part?.inlineData?.data) {
          return { ...img, url: `data:image/png;base64,${part.inlineData.data}` };
        }
      } catch (error: any) {
        console.warn(`Gemini 3 Pro Image failed for ${img.title}, trying gemini-2.5-flash-image...`, error.message);
        try {
          // Fallback to gemini-2.5-flash-image
          const fallbackResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: img.prompt,
          });
          const part = fallbackResponse.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
          if (part?.inlineData?.data) {
            return { ...img, url: `data:image/png;base64,${part.inlineData.data}` };
          }
        } catch (fallbackError: any) {
          console.error(`All image models failed for ${img.title}:`, fallbackError.message);
        }
      }
      return img; // Fallback to no URL
    }));

    return { ...themeData, images: imagesWithUrls };
  } catch (error) {
    console.error("Error generating theme:", error);
    throw new Error("Failed to generate theme");
  }
}
