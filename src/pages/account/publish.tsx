import * as React from "react";
import type { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { getUserFromRequest } from "@/lib/session";
import { MAX_LISTING_IMAGES } from "@/lib/constants";

const UPLOAD_URL = "/api/upload";

export default function PublishPage() {
  const [submitting, setSubmitting] = React.useState(false);
  const [msg, setMsg] = React.useState<string>("");
  const [cover, setCover] = React.useState<string | null>(null);
  const [preview, setPreview] = React.useState<string[]>([]); // galería

  async function uploadFile(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("image", file); // compatibilidad
    const r = await fetch(UPLOAD_URL, { method: "POST", body: fd });
    const j = await r.json().catch(()=> ({}));
    if (!r.ok) throw new Error(j?.error || "UPLOAD_FAIL");
    return j.path || j.url || j.image;
  }

  async function onPickCover(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      setMsg("Subiendo portada…");
      const path = await uploadFile(f);
      setCover(path);
      setMsg("✅ Portada subida (recuerda Publicar)");
    } catch (err) {
      console.error(err);
      setMsg("❌ No se pudo subir portada");
    }
  }

  async function onPickGallery(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    try {
      setMsg("Subiendo a galería…");
      const already = (cover ? 1 : 0) + preview.length;
      const space = MAX_LISTING_IMAGES - already;
      const toUpload = files.slice(0, Math.max(0, space));
      const uploaded: string[] = [];
      for (const f of toUpload) uploaded.push(await uploadFile(f));
      setPreview((p) => [...p, ...uploaded].slice(0, MAX_LISTING_IMAGES - (cover ? 1 : 0)));
      setMsg("✅ Imágenes agregadas");
    } catch (err) {
      console.error(err);
      setMsg("❌ Error subiendo galería");
    }
  }

  function addGalleryUrl(url: string) {
    const u = (url || "").trim();
    if (!u) return;
    const total = (cover ? 1 : 0) + preview.length;
    if (total >= MAX_LISTING_IMAGES) {
      setMsg(`⚠️ Máximo ${MAX_LISTING_IMAGES} imágenes`);
      return;
    }
    setPreview((p) => [...p, u].slice(0, MAX_LISTING_IMAGES - (cover ? 1 : 0)));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setMsg("");
    try {
      const fd = new FormData(e.currentTarget);
      const title = String(fd.get("title") || "");
      const location = String(fd.get("location") || "");
      const priceUsd = String(fd.get("priceUsd") || "");
      const description = String(fd.get("description") || "");

      const body = {
        title,
        location: location || null,
        priceUsd: priceUsd || null,
        image: (cover || null),
        images: (preview || []).filter(Boolean).slice(0, 10),
        description: description || null,
      };

      const r = await fetch("/api/listings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await r.json().catch(()=> ({}));
      if (!r.ok) { setMsg(`❌ ${data?.error || "SERVER"}`); return; }
      window.location.href = `/properties/${data.id}`;
    } catch (err) {
      console.error(err);
      setMsg("❌ SERVER");
    } finally {
      setSubmitting(false);
    }
  }

  const canAdd = (cover ? 1 : 0) + preview.length < MAX_LISTING_IMAGES;

  return (
    <main className="container py-8 space-y-6">
      <Link href="/account" className="text-[#d4af37] underline">← Volver a mi cuenta</Link>
      <h1 className="text-2xl font-semibold">Publicar propiedad</h1>

      <section className="bg-white rounded-2xl border shadow-sm p-6">
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Título *</label>
              <input required name="title" className="w-full border rounded-lg px-3 py-2" placeholder="Casa Playa Vista" />
            </div>
            <div>
              <label className="block text-sm mb-1">Ubicación</label>
              <select name="location" className="w-full border rounded-lg px-3 py-2">
                <option value="">Selecciona</option>
                <option>Flamingo</option>
                <option>Tamarindo</option>
                <option>Guanacaste</option>
                <option>Santa Cruz</option>
                <option>Nosara</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Precio (USD)</label>
              <input name="priceUsd" inputMode="numeric" className="w-full border rounded-lg px-3 py-2" placeholder="350000" />
            </div>

            <div>
              <label className="block text-sm mb-1">Portada (archivo o URL)</label>
              <div className="flex items-center gap-3">
                <input type="file" accept="image/*" onChange={onPickCover}/>
                <input
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="/uploads/portada.jpg o https://..."
                  onBlur={(e)=> setCover(e.currentTarget.value.trim()) }
                />
              </div>
              {cover && (
                <div className="mt-3">
                  <Image src={cover} alt="cover" width={900} height={600} className="w-full max-w-md rounded-lg object-cover"/>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Galería (hasta {MAX_LISTING_IMAGES} total)</label>
            <div className="flex items-center gap-3">
              <input type="file" accept="image/*" multiple onChange={onPickGallery} disabled={!canAdd}/>
              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Pega URL y Enter"
                onKeyDown={(e)=> {
                  if(e.key==="Enter"){
                    e.preventDefault();
                    const el = e.target as HTMLInputElement;
                    addGalleryUrl(el.value.trim());
                    el.value="";
                  }
                }}
              />
              <span className="text-xs text-gray-500">{(cover?1:0)+preview.length} / {MAX_LISTING_IMAGES}</span>
            </div>
            {!!preview.length && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3">
                {preview.map((u,i)=>(
                  <div key={i} className="relative">
                    <Image src={u} alt={"img"+i} width={300} height={200} className="w-full h-24 object-cover rounded"/>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Descripción</label>
            <textarea name="description" rows={4} className="w-full border rounded-lg px-3 py-2" placeholder="Detalles de la propiedad..."></textarea>
          </div>

          <button disabled={submitting} className="rounded-lg px-4 py-2 text-white" style={{ backgroundColor: "#d4af37", opacity: submitting ? .7 : 1 }}>
            {submitting ? "Publicando..." : "Publicar"}
          </button>
          {msg && <p className="text-sm mt-2">{msg}</p>}
        </form>
      </section>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const user = await getUserFromRequest(req);
  if (!user) return { redirect: { destination: "/login", permanent: false } } as any;
  return { props: {} };
};
