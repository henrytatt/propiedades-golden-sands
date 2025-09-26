import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { name, email, phone, interest, message, hp } = req.body || {};
  if (hp) return res.status(200).json({ ok: true }); // honeypot: ignorar bots silenciosamente
  if (!name || !email || !message) return res.status(400).json({ error: "Faltan campos obligatorios." });

  // Aquí podrías integrar un servicio de email (SendGrid/Resend/SES).
  // De momento registramos en el servidor:
  console.log("Nueva consulta:", { name, email, phone, interest, message, at: new Date().toISOString() });

  return res.status(200).json({ ok: true });
}

