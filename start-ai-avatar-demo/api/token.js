const fetch = require("node-fetch");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const r = await fetch("https://api.heygen.com/v1/streaming.create_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.HEYGEN_API_KEY
      }
    });

    const text = await r.text();
    if (!r.ok) return res.status(r.status).json({ error: `HeyGen ${r.status}: ${text}` });

    const data = JSON.parse(text);
    const token = data?.data?.token || data?.token;

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
};
