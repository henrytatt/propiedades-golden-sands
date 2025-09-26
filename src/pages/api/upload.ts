import formidable, { type Fields, type Files, type File } from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";

import path from "path";
import { promises as fs } from "fs";

export const config = { api: { bodyParser: false } };

// En algunas instalaciones, formidable expone file.filepath; en otras, file.path
function tmpOf(file: any) {
  return file?.filepath || file?.path || null;
}
function pickFile(f: any): File | null {
  if (!f) return null;
  if (Array.isArray(f)) return f[0] ?? null;
  return f as File;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ ok:false, error: "Method not allowed" });

  const form = formidable({
    multiples: false,
    maxFileSize: 15 * 1024 * 1024, // 15MB
    //  no filtramos por mimetype para evitar falsos negativos (webp en Windows, etc.)
  });

  try {
    const { files } = await new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
      form.parse(req, (err: any, fields: Fields, files: Files) => (err ? reject(err) : resolve({ fields, files })));
    });

    const file = pickFile((files as any).file);
    if (!file) return res.status(400).json({ ok:false, error: "Archivo no recibido" });

    const tempPath = tmpOf(file);
    if (!tempPath) return res.status(400).json({ ok:false, error: "Ruta temporal ausente" });

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const orig = file.originalFilename || "foto";
    const ext = path.extname(orig) || ".jpg";
    const safeBase = path.basename(orig, ext).replace(/[^a-z0-9_-]/gi, "_").toLowerCase();
    const filename = `${Date.now()}_${Math.random().toString(36).slice(2,8)}_${safeBase}${ext}`;
    const dest = path.join(uploadsDir, filename);

    // copyFile es más estable en Windows/OneDrive que leer+escribir
    await fs.copyFile(tempPath, dest);

    return res.status(200).json({ ok: true, path: `/uploads/${filename}` });
  } catch (e: any) {
    console.error("[/api/upload] error:", e?.message || e);
    return res.status(500).json({ ok:false, error: e?.message || "SERVER" });
  }
}

