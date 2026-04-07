import Navbar from "@/app/components/Navbar";
import HeroBanner from "@/app/components/HeroBanner";
import InfoBar from "@/app/components/InfoBar";
import ProductGrid from "@/app/components/ProductGrid";
import SectorGrid from "@/app/components/SectorGrid";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Yapışkan header + kategori barı */}
      <Navbar />

      <main className="flex-1">
        {/* Dinamik hero banner (Supabase) */}
        <HeroBanner />

        {/* Hızlı bilgi çubuğu */}
        <InfoBar />

        {/* Öne Çıkan Ürünler */}
        <ProductGrid />

        {/* Sektörlere Göre Ürünler */}
        <SectorGrid />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
