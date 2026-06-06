import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/insight", async (req, res) => {
    try {
      const { checkIns, profile } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        return res.json({ insight: "You're taking steps to reflect on your wellbeing, which is a great start." });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a supportive, calm wellbeing companion for a university student named ${profile?.name || 'there'}.
Based on their latest check-in and recent pattern:
- CRITICAL EMERGENCY: If any of their recent reflections contain words like "suicide", "kill myself", "end it all", "hopeless", "hurt myself", "self harm", "die", or "abuse", or if they express dire circumstances, DO NOT offer any advice or suggestions. Mute all normal responses and answer ONLY with exactly: "We are deeply concerned about you. Please reach out to SADAG immediately at 0800 567 567 or contact campus counseling right now." No exceptions.
- If their latest mood is good or great (4 or 5), warmly reaffirm them and celebrate their positive day based on the specific tags or reflections they shared.
- If their latest mood is neutral, difficult, or very difficult (3, 2, or 1), offer 2 to 3 gentle, practical, actionable suggestions tailored to the specific challenges or tags they shared today. Keep the suggestions short.

Do not diagnose and do not give medical advice. Keep it concise, friendly, and conversational. 

Recent check-ins (1=very difficult, 5=great, with tags, date, and their text reflection):
${JSON.stringify(checkIns.slice(-14).map((c: any) => ({ date: c.date, mood: c.mood, tags: c.tags, reflection: c.reflection })))}
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      res.json({ insight: response.text });
    } catch (error) {
      res.json({ insight: "Taking time to reflect is a positive step. Keep checking in." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist", "client"); // vite build default is dist, but we might output to dist?
    // wait, vite standard is dist. let's just use dist
    const distClient = path.join(process.cwd(), 'dist');
    app.use(express.static(distClient));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distClient, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
