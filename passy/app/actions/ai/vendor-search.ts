"use strict";

import { getModel } from "@/lib/ai/gemini-client";

export async function vendorSearch(query: string, themeTags: string[]) {
  const model = getModel();
  // In a real scenario, we'd enable the 'google_search' tool if available via the SDK
  // or use a specialized endpoint. Here we'll prompt Gemini to provide search-like results.
  const prompt = `
    Search for baby shower vendors related to: "${query}". 
    The event theme tags are: ${themeTags.join(", ")}.
    Provide real-world vendor suggestions that would fit this theme.
    Return a JSON array of vendor objects:
    {
      "name": "Vendor Name",
      "category": "e.g., Venue, Catering, Decor",
      "rating": 4.5,
      "priceRange": "$$",
      "matchesTheme": true,
      "website": "https://example.com"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonStr = text.replace(/```json\n|\n```/g, '');
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error searching vendors:", error);
    throw new Error("Failed to search vendors");
  }
}
