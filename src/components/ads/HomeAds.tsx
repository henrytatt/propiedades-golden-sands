import * as React from "react";
import AdSlot from "@/components/ads/AdSlot";

export default function HomeAds() {
  return (
    <section className="my-8 space-y-6">
      {/* Banner superior */}
      <AdSlot
        id="home-hero-banner"
        ratio="banner"
        imageUrl="/ads/banner-hero.jpg"
        href="https://tu-anunciante.com/promo-hero"
        showPlaceholder={false}
      />

      {/* Tres rectangulares */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AdSlot id="home-rect-1" ratio="rect" imageUrl="/ads/rect-1.jpg" href="https://tu-anunciante.com/1" showPlaceholder={false}/>
        <AdSlot id="home-rect-2" ratio="rect" imageUrl="/ads/rect-2.jpg" href="https://tu-anunciante.com/2" showPlaceholder={false}/>
        <AdSlot id="home-rect-3" ratio="rect" imageUrl="/ads/rect-3.jpg" href="https://tu-anunciante.com/3" showPlaceholder={false}/>
      </div>

      {/* Banner inferior */}
      <AdSlot
        id="home-bottom-banner"
        ratio="banner"
        imageUrl="/ads/banner-bottom.jpg"
        href="https://tu-anunciante.com/promo-bottom"
        showPlaceholder={false}
      />
    </section>
  );
}
