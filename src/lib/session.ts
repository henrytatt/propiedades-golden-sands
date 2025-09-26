import { serialize, parse } from "cookie";
import { getPrisma } from "@/lib/prisma";
import { randomBytes, createHmac } from "crypto";
const SESSION_COOKIE = "gs_session";
const SECRET = process.env.SESSION_SECRET || "dev-secret-change-me";
function sign(val: string) { const sig = createHmac("sha256", SECRET).update(val).digest("base64url"); return `${val}.${sig}`; }
function unsign(signed: string) { const i = signed.lastIndexOf("."); if (i < 0) return null; const val = signed.slice(0, i); return sign(val) === signed ? val : null; }
export function createSessionCookie(userId: string) {
  const nonce = randomBytes(8).toString("base64url");
  const value = sign(`${userId}:${nonce}`);
  return serialize(SESSION_COOKIE, value, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60*60*24*30 });
}
export function clearSessionCookie() { return serialize(SESSION_COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 }); }
export async function getUserFromRequest(req: any) {
  const cookies = parse(req.headers?.cookie || ""); const raw = cookies[SESSION_COOKIE]; if (!raw) return null;
  const val = unsign(raw); if (!val) return null; const userId = val.split(":")[0]; if (!userId) return null;
  try { return await getPrisma().user.findUnique({ where: { id: userId } }); } catch { return null; }
}

