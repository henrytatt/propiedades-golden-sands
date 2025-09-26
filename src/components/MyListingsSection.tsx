import * as React from "react";
import Link from "next/link";

type Item = {
  id: string;
  title: string;
  location: string | null;
  priceUsd: number | null;
  image: string | null;
  createdAt: string;
};

const Money = ({ v }: { v: number | null }) =>
  <span>{v==null ? "—" : new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(v)}</span>;

const img = (p?: string|null) => p ? encodeURI(p) : "";

export default function MyListingsSection(){
  const [items,setItems] = React.useState<Item[]|null>(null);
  const [err,setErr] = React.useState<string>("");

  React.useEffect(()=>{
    (async()=>{
      try{
        const r = await fetch("/api/me/listings");
        const d = await r.json();
        if(r.ok) setItems(d.items || []);
        else setErr(d?.error || "SERVER");
      }catch{
        setErr("NETWORK");
      }
    })();
  },[]);

  if(err) return <div className="card p-4 text-sm text-red-600">Error: {err}</div>;
  if(items===null) return <div className="text-sm text-gray-600">Cargando publicaciones…</div>;
  if(!items.length) return (
    <div className="card p-6">
      <div className="text-gray-700">Aún no has publicado propiedades.</div>
      <div className="text-sm text-gray-600 mt-1">
        Crea la primera desde{" "}
        <Link href="/account/publish" className="text-[#d4af37] underline">Publicar</Link>.
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {items.map((l)=>(
        <article key={l.id} className="card p-4 flex items-center gap-4">
          <div className="w-28 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
            {l.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img(l.image)} alt={l.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center text-xs text-gray-400">sin imagen</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate">{l.title}</div>
            <div className="text-sm text-gray-600 flex gap-2">
              <span>{l.location || "Costa Rica"}</span>
              <span>•</span>
              <span><Money v={l.priceUsd ?? null}/></span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/properties/${l.id}`} className="px-3 py-1 rounded border">Ver</Link>
            <Link href={`/account/edit/${l.id}`} className="px-3 py-1 rounded text-white" style={{background:"#d4af37"}}>Editar</Link>
          </div>
        </article>
      ))}
    </div>
  );
}
