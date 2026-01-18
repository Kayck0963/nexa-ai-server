import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// ChatGPT
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/chatgpt", async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Você é a NEXA AI, amigável e inteligente." },
        { role: "user", content: req.body.message }
      ]
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (e) {
    res.status(500).json({ error: "Erro no ChatGPT" });
  }
});

// Gemini
app.post("/gemini", async (req, res) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: req.body.message }] }]
        })
      }
    );

    const data = await response.json();
    res.json({ reply: data.candidates[0].content.parts[0].text });
  } catch (e) {
    res.status(500).json({ error: "Erro no Gemini" });
  }
});

app.listen(process.env.PORT || 3000);
