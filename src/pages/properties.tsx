import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Listing = { id:string; title:string; location:string|null; priceUsd:number|null; image:string };

const Money = ({ v }:{ v:number|null }) => <span>{v==null ? "—" : new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(v)}</span>;
const img = (p:string)=>encodeURI(p);

export default function PropertiesClient(){
  const [items,setItems]=useState<Listing[]|null>(null);
  useEffect(()=>{ (async()=>{ const r=await fetch('/api/listings/all'); const d=await r.json(); setItems(r.ok? d.listings: []); })(); },[]);
  if(items===null) return <div className="text-sm text-gray-600">Cargando...</div>;
  if(!items.length) return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Propiedades</h1>
      <div className="card p-6">
        <p className="text-gray-700">Aún no hay propiedades publicadas.</p>  
        <p className="text-sm text-gray-600 mt-1">Crea la primera desde tu <Link href="/account" className="text-[#d4af37] underline">panel de usuario</Link>.</p>
      </div>
    </section>
  );

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Propiedades</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"> 
        {items.map(l=>(
          <article key={l.id} className="card overflow-hidden">
            <Link href={`/properties/${l.id}`} className="block">
              <div className="relative">
                <Image src={img(l.image)} alt={l.title} width={1200} height={900} className="w-full h-56 object-cover"/>
                <div className="absolute top-2 left-2 text-xs bg-black/60 text-white rounded px-2 py-1">{l.location || "Costa Rica"}</div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <h2 className="font-semibold">{l.title}</h2>
                <span className="text-sm"><Money v={l.priceUsd}/></span>       
              </div>
              <div className="px-4 pb-4">
                <span className="inline-block text-xs text-[#d4af37] underline">Ver detalles</span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
