import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import AdSlot from "@/components/ads/AdSlot";
import HomeAds from "@/components/ads/HomeAds";

export default function Home() {
  return (
    <main className="container py-6 space-y-10">
      {/* HERO */}
      <section className="relative rounded-3xl overflow-hidden shadow-md">
        <Image
          src="/portada1.jpg"
          alt="Propiedades CR"
          width={1600}
          height={700}
          className="w-full h-[42vh] sm:h-[50vh] object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl sm:text-4xl font-bold drop-shadow">Encuentra tu propiedad en Costa Rica</h1>
            <p className="mt-2 text-sm sm:text-base opacity-90">Compra, vende o alquila con facilidad</p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Link href="/search" className="px-5 py-3 rounded-lg text-white" style={{background:"#d4af37"}}>Buscar propiedades</Link>
        <Link href="/properties" className="px-5 py-3 rounded-lg border border-white/70 bg-white/20 backdrop-blur text-white hover:bg-white/30">Ver propiedades</Link>
      </div>
          </div>
        </div>
      </section>

      {/* Aquí puedes mantener/volver a agregar tus secciones originales de tarjetas, destacados, etc. */}

      {/* Publicidad home */}
      <AdSlot id="home-hero-banner" ratio="banner" showPlaceholder className="my-6" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AdSlot id="home-rect-1" ratio="rect" showPlaceholder />
        <AdSlot id="home-rect-2" ratio="rect" showPlaceholder />
        <AdSlot id="home-rect-3" ratio="rect" showPlaceholder />
      </div>
      <AdSlot id="home-bottom-banner" ratio="banner" showPlaceholder className="my-8" />
      <HomeAds />
</main>
  );
}


