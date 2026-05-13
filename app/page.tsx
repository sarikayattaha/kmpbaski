export const dynamic = "force-dynamic";

import Navbar from "@/app/components/Navbar";
import HeroBanner from "@/app/components/HeroBanner";
import InfoBar from "@/app/components/InfoBar";
import FeaturedSlider from "@/app/components/FeaturedSlider";
import GidaKutulariSlider from "@/app/components/GidaKutulariSlider";
import HowItWorksSection from "@/app/components/HowItWorksSection";
import ContactFormSection from "@/app/components/ContactFormSection";
import SectorGrid from "@/app/components/SectorGrid";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Yapışkan header + kategori barı */}
      <Navbar />

      <main className="flex-1">
        {/* Hero banner — Supabase'deki ilk banner'ı tam genişlik gösterir */}
        <HeroBanner />

        {/* Hızlı bilgi çubuğu */}
        <InfoBar />

        {/* Öne Çıkan Ürünler — admin'de is_featured işaretli ürünler */}
        <FeaturedSlider />

        {/* Gıda Kutuları — category="Gıda Kutuları" olan ürünler */}
        <GidaKutulariSlider />

        {/* 3 Adımda Kusursuz Baskı */}
        <HowItWorksSection />

        {/* Teklif / İletişim Formu */}
        <ContactFormSection />

        {/* Sektörlere Göre Ürünler */}
        <SectorGrid />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
