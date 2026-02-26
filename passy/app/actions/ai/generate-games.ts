"use server";

import { ai } from "@/lib/ai/gemini-client";
import { Type } from "@google/genai";

export interface GameRecommendation {
    title: string;
    description: string;
    materials: string[];
    vibe: string;
    tagType: 'popular' | 'theme' | 'creative' | 'sweet';
    imagePrompt: string;
    url?: string;
}

export interface GameResponse {
    games: GameRecommendation[];
    aiTip: string;
}

export async function generateGames(
    theme: string,
    energyLevel: number,
    guestCount: string
) {
    try {
        const energyMap = ["Very Chill", "Chill", "Mid-Energy", "Active", "High Energy"];
        const energyDesc = energyMap[energyLevel - 1] || "Mid-Energy";

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Generate 4 personalized baby shower game recommendations based on these criteria:
Theme: ${theme}
Energy Level: ${energyDesc}
Guest Count: ${guestCount}

For each game, provide a title, a short description (max 150 chars), a list of materials, a vibe tag (e.g. "Popular Choice", "Theme Match", "Creative", "Sweet Fun"), and a detailed image prompt for a high-quality photo of the game setup.
Also provide one short "AI Tip" related to games for this theme.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        games: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    materials: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    vibe: { type: Type.STRING },
                                    tagType: { type: Type.STRING, enum: ['popular', 'theme', 'creative', 'sweet'] },
                                    imagePrompt: { type: Type.STRING }
                                },
                                required: ["title", "description", "materials", "vibe", "tagType", "imagePrompt"]
                            }
                        },
                        aiTip: { type: Type.STRING }
                    },
                    required: ["games", "aiTip"]
                }
            }
        });

        const gameData: GameResponse = JSON.parse(response.text || '{}');

        // Generate images for each game
        const gamesWithUrls = await Promise.all(gameData.games.map(async (game) => {
            try {
                const imgResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: `High-fidelity photography of a baby shower game: ${game.imagePrompt}. Glassmorphic aesthetics, elegant lighting, soft colors.`,
                });

                const part = imgResponse.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
                if (part?.inlineData?.data) {
                    return { ...game, url: `data:image/png;base64,${part.inlineData.data}` };
                }
            } catch (error: any) {
                console.error(`Image generation failed for ${game.title}:`, error.message);
            }
            return game;
        }));

        return { ...gameData, games: gamesWithUrls };
    } catch (error) {
        console.error("Error generating games:", error);
        throw new Error("Failed to generate games");
    }
}
