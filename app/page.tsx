export const dynamic = "force-dynamic";

import Navbar from "@/app/components/Navbar";
import HeroBanner from "@/app/components/HeroBanner";
import InfoBar from "@/app/components/InfoBar";
import FeaturedSlider from "@/app/components/FeaturedSlider";
import SectorGrid from "@/app/components/SectorGrid";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Yapışkan header + kategori barı */}
      <Navbar />

      <main className="flex-1">
        {/* Hero banner — full-width background image, CTA pinned to bottom-right */}
        <HeroBanner
          src="https://zqkpgbfxjkwcxaomjifb.supabase.co/storage/v1/object/public/banners/hero-default.jpg"
          alt="Profesyonel baskı çözümleri — KMP Baskı"
          overlay
          cta={{ label: 'Hemen Sipariş Ver', href: '/tum-urunler' }}
          ctaPosition="bottom-right"
        />

        {/* Hızlı bilgi çubuğu */}
        <InfoBar />

        {/* Öne Çıkan Ürünler — admin'de is_featured işaretli ürünler */}
        <FeaturedSlider />

        {/* Sektörlere Göre Ürünler */}
        <SectorGrid />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
