'use server';

import { ai } from "@/lib/ai/gemini-client";
import { Type } from "@google/genai";

export async function analyzeBudget(budgetData: { category: string; amount: number; spent: number }[]) {
  const prompt = `
    Analyze the following budget data for a baby shower:
    ${JSON.stringify(budgetData)}

    Provide strategic "AI Intel" cards specifically targeted at saving money and optimizing luxury for a baby shower.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are Passy's premium financial assistant. Provide actionable, high-end budget advice for baby showers. Return a JSON array of objects with 'title' (short, e.g., 'Venue Strategy'), 'message' (detailed advice), and 'type' ('tip' or 'warning').",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              message: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['tip', 'warning'] }
            }
          }
        }
      }
    });

    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (error) {
    console.error("Error analyzing budget:", error);
    return [
      {
        title: "Financial Tip",
        message: "Consider booking venues mid-week for significant discounts.",
        type: "tip"
      }
    ];
  }
}
