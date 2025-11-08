export default async function handler(req, res) {
  try {
    const r = await fetch('https://api.heygen.com/v1/streaming.create_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.HEYGEN_API_KEY
      }
    });

    const data = await r.json();

    if (!r.ok) return res.status(r.status).json(data);

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ token: data?.data?.token || data?.token });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
