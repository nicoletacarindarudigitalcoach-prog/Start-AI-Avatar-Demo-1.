export default function handler(_req, res) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({
    DEFAULT_AVATAR_NAME: process.env.DEFAULT_AVATAR_NAME || 'Alessandra_ProfessionalLook2_public',
    HAS_HEYGEN: !!process.env.HEYGEN_API_KEY,
    HAS_OPENAI: !!process.env.OPENAI_API_KEY
  });
}
