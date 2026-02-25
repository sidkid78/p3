"use strict";

import { getModel } from "@/lib/ai/gemini-client";

export async function analyzeBudget(budgetData: any) {
  const model = getModel();
  const prompt = `
    Analyze the following budget data for a baby shower:
    ${JSON.stringify(budgetData)}

    Provide AI Intel cards as a JSON array of objects. Each object should have:
    {
      "type": "warning" | "tip" | "insight",
      "message": "The advice or observation",
      "impact": "Low" | "Medium" | "High"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonStr = text.replace(/```json\n|\n```/g, '');
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error analyzing budget:", error);
    throw new Error("Failed to analyze budget");
  }
}
