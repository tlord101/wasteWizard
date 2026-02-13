
import { GoogleGenAI, Type } from "@google/genai";
import { WasteType, WasteItem } from "../types";

// Helper function to identify waste using Gemini API
export const identifyWaste = async (base64Image: string): Promise<WasteItem> => {
  // Always use process.env.API_KEY directly in the constructor
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image
          }
        },
        {
          text: "Identify this waste item. Be precise. Determine if it's MEDICAL, RECYCLABLE, or DOMESTIC (Domestic Trash). Provide a short name and 3 clear instructions on how to dispose of it."
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          type: { 
            type: Type.STRING, 
            description: "Must be one of: MEDICAL, RECYCLABLE, DOMESTIC" 
          },
          instructions: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          }
        },
        required: ["name", "type", "instructions"]
      }
    }
  });

  // Correctly access the .text property from GenerateContentResponse
  const text = response.text;
  if (!text) {
    throw new Error("No response text from Gemini");
  }

  try {
    const data = JSON.parse(text.trim());
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name || "Unknown Item",
      type: (data.type as WasteType) || WasteType.DOMESTIC,
      confidence: 0.95,
      instructions: data.instructions || ["Dispose of thoughtfully."]
    };
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Could not identify item");
  }
};
