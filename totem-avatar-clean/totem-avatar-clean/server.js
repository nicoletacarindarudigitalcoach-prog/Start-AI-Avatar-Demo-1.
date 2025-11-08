const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fetch = require("node-fetch");

dotenv.config({ path: path.join(__dirname, ".env.development") });

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/env.json", (_req, res) => {
  res.json({
    DEFAULT_AVATAR_NAME: process.env.DEFAULT_AVATAR_NAME || "Alessandra_ProfessionalLook2_public"
  });
});

app.post("/api/token", async (_req, res) => {
  try {
    const r = await fetch("https://api.heygen.com/v1/streaming.create_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.HEYGEN_API_KEY
      }
    });

    const data = await r.json();
    res.json({ token: data?.data?.token || data?.token });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server online → http://localhost:${PORT}`);
});
