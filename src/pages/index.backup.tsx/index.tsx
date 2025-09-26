import HomeAds from "@/components/ads/HomeAds";
import Image from "next/image";
import Link from "next/link";

const img = (p: string) => encodeURI(p); // para nombres con espacios

export default function Home() {
  return (
    <section className="space-y-10">
      {/* HERO */}
      <div className="relative rounded-3xl overflow-hidden shadow-md">
        <Image
          src={img("/Portada1.jpg")}
          alt="Golden Sands Properties"
          width={2400}
          height={1200}
          priority
          className="w-full h-[380px] sm:h-[440px] lg:h-[520px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/0" />
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 lg:px-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-md">
            <span className="text-[#d4af37]">Golden Sands Properties</span>
          </h1>
          <p className="mt-3 text-white/90 max-w-2xl text-sm sm:text-base drop-shadow">
            Propiedades selectas en la costa de Costa Rica. Descubre tu próxima inversión frente al mar.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/search"
              className="px-4 py-2.5 rounded-xl bg-[#d4af37] text-white font-medium hover:brightness-95"
            >
              Buscar propiedades
            </Link>
            <Link
              href="/properties"
              className="px-4 py-2.5 rounded-xl bg-white/95 text-gray-900 font-medium hover:bg-white"
            >
              Ver propiedades
            </Link>
          </div>
        </div>
      </div>

      {/* DESTACADOS */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Destacados</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { src: "/Flamingo3.jpg", title: "Playa Flamingo" },
            { src: "/Flamingo4.jpg", title: "Guanacaste" },
            { src: "/casaplaya1.jpg", title: "Casa frente al mar" },
            { src: "/casaplaya2.jpg", title: "Villa con piscina" },
            { src: "/casaplaya3.jpg", title: "Bungalows" },
            { src: "/casaplaya4.jpg", title: "Residencia tropical" },
          ].map((card) => (
            <article key={card.src} className="rounded-2xl overflow-hidden border shadow-sm bg-white">
              <Image
                src={img(card.src)}
                alt={card.title}
                width={1200}
                height={900}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex items-center justify-between">
                <h3 className="font-semibold">{card.title}</h3>
                <Link href="/properties" className="text-[#d4af37] text-sm hover:underline">
                  Ver más
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
    <HomeAds />
);
}


  {/* Publicidad home */}
  <AdSlot id="home-hero-banner" ratio="banner" showPlaceholder className="my-6" />
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <AdSlot id="home-rect-1" ratio="rect" showPlaceholder />
    <AdSlot id="home-rect-2" ratio="rect" showPlaceholder />
    <AdSlot id="home-rect-3" ratio="rect" showPlaceholder />
  </div>
  <AdSlot id="home-bottom-banner" ratio="banner" showPlaceholder className="my-8" />



