import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateResponse = async (prompt) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    contents: prompt,
    config: {
      systemInstruction: `Review this code in the following manner:
      Start with a heading "❌ Bad Code"
      Then write the bad code provided
      Then list all the problems in the code line by line
      Then start with heading "✅ Improved Code"
      Write the improved code
      Then specify all the recommendations line by line.
      P.S: If anything other than code is provided, output "Please provide a code snippet to review" only.`,
    },
  });
  return response.text;
};

// N77QR2GKm7tc7IfD
//mongodb+srv://ts6384649_db_user:N77QR2GKm7tc7IfD@cluster0.qe2a10z.mongodb.net/?appName=Cluster0