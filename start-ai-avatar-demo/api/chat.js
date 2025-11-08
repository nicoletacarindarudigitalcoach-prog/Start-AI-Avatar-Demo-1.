const fetch = require("node-fetch");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { text } = req.body || {};
    if (!text) return res.status(400).json({ error: "missing text" });

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content: "Sei START, assistente fisica delle strutture sanitarie. Risposte brevi, chiare, empatiche."
          },
          { role: "user", content: text }
        ]
      })
    });

    const txt = await r.text();
    if (!r.ok) return res.status(r.status).json({ error: `OpenAI ${r.status}: ${txt}` });

    const data = JSON.parse(txt);
    const reply = data?.choices?.[0]?.message?.content?.trim();

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
};
