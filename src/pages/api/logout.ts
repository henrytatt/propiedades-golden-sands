﻿import type { NextApiRequest, NextApiResponse } from "next"; import { clearSessionCookie } from "@/lib/session";
export default function handler(req:NextApiRequest,res:NextApiResponse){ if(req.method!=="POST") return res.status(405).json({ error:"Method not allowed" }); res.setHeader("Set-Cookie", clearSessionCookie()); res.redirect(302,"/"); }

