import * as React from "react";
import Image from "next/image";
import Link from "next/link";

type Listing = {
  id: string;
  title: string;
  image: string | null;
  location: string | null;
  priceUsd: number | null;
};

const Money = ({ v }:{ v:number|null }) => (
  <span>{v==null ? "—" : new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(v)}</span>
);

const img = (p?: string | null) => encodeURI(p || "/portada1.jpg");

export default function UserListingsSearch() {
  const [items, setItems] = React.useState<Listing[] | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/listings/all");
        const d = await r.json();
        setItems(r.ok ? (d.listings as Listing[]) : []);
      } catch {
        setItems([]);
      }
    })();
  }, []);

  if (items === null) {
    return <div className="text-sm text-gray-600 mt-6">Cargando publicaciones…</div>;
  }
  if (!items.length) {
    return (
      <div className="mt-6">
        <div className="card p-4">
          <p className="text-gray-700">No hay publicaciones de usuarios todavía.</p>
          <p className="text-sm text-gray-500">Crea una en tu <Link href="/account" className="text-[#d4af37] underline">panel</Link>.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(l => (
        <article key={l.id} className="card overflow-hidden">
          {/* Media + título/precio clicables */}
          <Link href={`/properties/${l.id}`} className="block">
            <div className="relative">
              <Image src={img(l.image)} alt={l.title} width={1200} height={900} className="w-full h-56 object-cover" />
              <div className="absolute top-2 left-2 text-xs bg-black/60 text-white rounded px-2 py-1">
                {l.location || "Costa Rica"}
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <h3 className="font-semibold">{l.title}</h3>
              <span className="text-sm"><Money v={l.priceUsd} /></span>
            </div>
          </Link>

          {/* Botón de detalles explícito */}
          <div className="px-4 pb-4">
            <Link
              href={`/properties/${l.id}`}
              className="inline-block text-xs text-white rounded-lg px-3 py-2"
              style={{ backgroundColor: "#d4af37" }}
            >
              Ver detalles
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
