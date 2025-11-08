const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
const OpenAI = require("openai");

dotenv.config({ path: path.join(__dirname, ".env.development") });

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
const DEFAULT_AVATAR_NAME =
  process.env.DEFAULT_AVATAR_NAME || "Alessandra_ProfessionalLook2_public";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Env helper
app.get("/env.json", (_req, res) => {
  res.json({
    DEFAULT_AVATAR_NAME,
    HAS_HEYGEN: Boolean(HEYGEN_API_KEY),
    HAS_OPENAI: Boolean(OPENAI_API_KEY),
  });
});

// HeyGen: crea token di sessione
app.post("/api/token", async (_req, res) => {
  try {
    const r = await fetch("https://api.heygen.com/v1/streaming.create_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": HEYGEN_API_KEY,
      },
    });

    if (!r.ok) {
      const text = await r.text();
      return res.status(500).json({
        error: `HeyGen create_token ${r.status}: ${text}`,
      });
    }
    const data = await r.json();
    return res.json({ token: data?.data?.token || data?.token });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

// Chat: testo → OpenAI → risposta testo
app.post("/api/chat", async (req, res) => {
  try {
    if (!OPENAI_API_KEY) {
      return res.status(400).json({ error: "OPENAI_API_KEY mancante" });
    }
    const { text } = req.body || {};
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Campo 'text' richiesto" });
    }

    const client = new OpenAI({ apiKey: OPENAI_API_KEY });
    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Rispondi in modo breve, chiaro, in italiano. Sei un assistente vocale su un totem.",
        },
        { role: "user", content: text },
      ],
      temperature: 0.5,
    });

    const out =
      resp.choices?.[0]?.message?.content?.trim() ||
      "Non ho una risposta al momento.";
    return res.json({ text: out });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

// index
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server online → http://localhost:${PORT}`);
  console.log(`ENV: DEFAULT_AVATAR_NAME=${DEFAULT_AVATAR_NAME}`);
});
