import MyGalleryEditor from "@/components/MyGalleryEditor";
import * as React from "react";
import type { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/session";

type Listing = {
  id: string;
  title: string;
  image: string | null;
  location: string | null;
  priceUsd: number | null;
  description: string | null;
};

type PageProps = { listing: Listing | null };

const Money = ({ v }:{ v:number|null }) => (
  <span>{v==null ? "—" : new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(v)}</span>
);

const UPLOAD_URL = "/api/content/upload";

export default function EditListing({ listing }: PageProps) {
  const [msg, setMsg] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [coverPreview, setCoverPreview] = React.useState<string | null>(listing?.image || null);
  const [coverFileName, setCoverFileName] = React.useState<string>("");
  const [coverUploading, setCoverUploading] = React.useState<boolean>(false);

  if (!listing) {
    return (
      <main className="container py-10">
        <p className="text-gray-600">Publicación no encontrada.</p>
        <Link href="/account" className="text-[#d4af37] underline">Volver a mi cuenta</Link>
            {/* Galería (agregar/eliminar fotos) */}
      {listing?.id && (
        <MyGalleryEditor
          listingId={listing.id}
          initialImages={(listing?.images || []).map((i:any)=>i.url)}
        />
      )}
</main>
    );
  }

  async function uploadFile(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("image", file); // compatibilidad
    const r = await fetch(UPLOAD_URL, { method: "POST", body: fd });
    if (!r.ok) throw new Error("upload failed");
    const d = await r.json();
    // acepta varias posibles claves de respuesta
    return d.path || d.url || d.filePath || (typeof d === "string" ? d : `/uploads/${file.name}`);
  }

  async function onPickCover(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      setCoverFileName(f.name);
      setCoverUploading(true);
      setBusy(true);
      const path = await uploadFile(f);
      (document.querySelector('input[name="image"]') as HTMLInputElement).value = path;
      setCoverPreview(path);
      setMsg("✅ Portada subida, recuerda Guardar cambios");
    } catch (err:any) {
      console.error(err);
      setMsg("❌ No se pudo subir portada");
    } finally {
      // No limpiamos e.target.value para que el navegador muestre el nombre
      setCoverUploading(false);
      setBusy(false);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      id: listing.id,
      title: String(fd.get("title") || ""),
      location: String(fd.get("location") || ""),
      priceUsd: fd.get("priceUsd") ? Number(fd.get("priceUsd")) : null,
      image: String(fd.get("image") || ""),
      description: String(fd.get("description") || "")
    };
    try {
      const r = await fetch("/api/listings/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const d = await r.json();
      if (!r.ok || !d?.ok) throw new Error(d?.error || "SERVER");
      setMsg("✅ Cambios guardados");
    } catch (err:any) {
      setMsg("❌ No se pudo guardar (" + (err?.message || "SERVER") + ")");
    } finally {
      setBusy(false);
    }
  }

  const img = (p: string) => encodeURI(p);

  return (
    <main className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Editar publicación</h1>
        <Link href="/account" className="text-[#d4af37] underline">Volver a mi cuenta</Link>
      </div>

      <form onSubmit={onSubmit} className="bg-white rounded-2xl border shadow-sm p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Título *</label>
            <input name="title" required defaultValue={listing.title} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Ubicación</label>
            <select name="location" defaultValue={listing.location || ""} className="w-full border rounded-lg px-3 py-2">
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
            <input name="priceUsd" defaultValue={listing.priceUsd ?? ""} inputMode="numeric" className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Portada (URL o /uploads/archivo.ext)</label>
            <input name="image" defaultValue={listing.image ?? ""} className="w-full border rounded-lg px-3 py-2" placeholder="/uploads/mi-foto.jpg" />
            <div className="mt-2 flex items-center gap-3">
              <input type="file" accept="image/*" onChange={onPickCover} disabled={busy} />
              {coverFileName && <span className="text-xs text-gray-600">{coverUploading ? "Subiendo…" : "Seleccionado:"} {coverFileName}</span>}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Descripción</label>
          <textarea name="description" rows={5} defaultValue={listing.description ?? ""} className="w-full border rounded-lg px-3 py-2" placeholder="Detalles de la propiedad..."></textarea>
        </div>

        {coverPreview && (
          <div className="rounded-xl overflow-hidden border">
            <Image src={img(coverPreview)} alt="Preview" width={1200} height={800} className="w-full h-64 object-cover" />
          </div>
        )}

        <button disabled={busy} className="rounded-lg px-4 py-2 text-white" style={{ backgroundColor: '#d4af37', opacity: busy ? .7 : 1 }}>
          {busy ? "Guardando..." : "Guardar cambios"}
        </button>
        {msg && <p className="text-sm mt-2">{msg}</p>}
      </form>
          {/* Galería (agregar/eliminar fotos) */}
      {listing?.id && (
        <MyGalleryEditor
          listingId={listing.id}
          initialImages={(listing?.images || []).map((i:any)=>i.url)}
        />
      )}
</main>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const me = await getUserFromRequest(ctx.req as any);
  if (!me) return { redirect: { destination: "/login", permanent: false } } as any;

  const id = String(ctx.params?.id || "");
  if (!id) return { props: { listing: null } };

  const l = await prisma.listing.findUnique({ where: { id } });
  if (!l || (l.ownerId && l.ownerId !== me.id)) {
    // no encontrado o no es dueño
    return { props: { listing: null } };
  }

  return {
    props: {
      listing: {
        id: l.id,
        title: l.title,
        image: l.image,
        location: l.location,
        priceUsd: l.priceUsd,
        description: (l as any).description ?? null
      }
    }
  };
};

