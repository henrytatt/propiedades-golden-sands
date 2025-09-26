import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; import { createSessionCookie } from "@/lib/session"; import bcrypt from "bcryptjs";
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method!=="POST") return res.status(405).json({ error:"Method not allowed" });
  const { email, password } = req.body || {}; if(!email || !password) return res.status(400).json({ error:"Missing credentials" });
  const user = await prisma.user.findUnique({ where:{ email } }); if(!user) return res.status(401).json({ error:"Invalid email or password" });
  const ok = await bcrypt.compare(password, user.passwordHash); if(!ok) return res.status(401).json({ error:"Invalid email or password" });
  res.setHeader("Set-Cookie", createSessionCookie(user.id)); return res.status(200).json({ ok:true });
}

