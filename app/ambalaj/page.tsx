export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { pageTitle, SITE_URL, SITE_NAME } from "@/lib/seo";
import { BreadcrumbSchema } from "@/app/components/SEO/Schema";
import GlossarySection from "@/app/components/GlossarySection";
import { getSupabase, type AmbalajCategory, type AmbalajProduct } from "@/lib/supabase";

export function generateMetadata(): Metadata {
  const title = pageTitle("Ambalaj Çözümleri ve Özel Kutu Baskısı");
  return {
    title,
    description:
      "Baklava kutusu, pasta kutusu, pizza kutusu ve daha fazlası. Markanıza özel ambalaj tasarım ve baskısı. Toptan fiyat, hızlı üretim.",
    openGraph: {
      title,
      url: `${SITE_URL}/ambalaj`,
      siteName: SITE_NAME,
      locale: "tr_TR",
      type: "website",
    },
    alternates: { canonical: `${SITE_URL}/ambalaj` },
  };
}
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import { Package, ChevronRight } from "lucide-react";
import CategorySlider from "./CategorySlider";
import AmbalajHeroSlider from "@/app/components/AmbalajHeroSlider";

export default async function AmbalajPage() {
  const supabase = getSupabase();
  let categories: AmbalajCategory[] = [];
  let products: AmbalajProduct[]    = [];

  if (supabase) {
    const [catRes, prodRes] = await Promise.all([
      supabase.from("ambalaj_categories").select("*").order("order_index", { ascending: true }),
      supabase.from("ambalaj_products").select("*").order("created_at", { ascending: false }),
    ]);
    categories = (catRes.data as AmbalajCategory[]) ?? [];
    products   = (prodRes.data as AmbalajProduct[]) ?? [];
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <BreadcrumbSchema
        items={[
          { name: "Ana Sayfa",         url: SITE_URL },
          { name: "Ambalaj Çözümleri", url: `${SITE_URL}/ambalaj` },
        ]}
      />

      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-gray-400">
          <a href="/" className="hover:text-[#0f75bc] transition-colors">Ana Sayfa</a>
          <span>/</span>
          <span className="text-[#07446c] font-semibold">Ambalaj Çözümleri</span>
        </div>
      </div>

      {/* Hero Slider */}
      <AmbalajHeroSlider />

      {/* Kategoriler */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full space-y-14">

        {categories.length === 0 && (
          <div className="text-center py-20 text-gray-300">
            <Package size={48} className="mx-auto mb-4 opacity-40" />
            <p className="font-medium">Henüz kategori eklenmemiş.</p>
          </div>
        )}

        {categories.map(cat => {
          const catProducts = products.filter(p => p.category_id === cat.id);
          if (catProducts.length === 0) return null;

          return (
            <section key={cat.id}>
              {/* Kategori başlığı */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  {cat.cover_image ? (
                    <div className="w-10 h-10 rounded-xl overflow-hidden relative flex-shrink-0 border border-gray-100">
                      <Image src={cat.cover_image} alt={cat.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-[#e0f2fe] flex items-center justify-center flex-shrink-0">
                      <Package size={18} className="text-[#0f75bc]" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-black text-[#07446c]">{cat.name}</h2>
                    <p className="text-xs text-gray-400">{catProducts.length} ürün</p>
                  </div>
                </div>
                <a
                  href={`/ambalaj/${cat.slug}`}
                  className="flex items-center gap-1 text-sm font-bold text-[#0f75bc] hover:text-[#07446c] transition-colors group"
                >
                  Tümünü Gör
                  <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              {/* Slider */}
              <CategorySlider products={catProducts} />
            </section>
          );
        })}

      </main>

      <GlossarySection topic="ambalaj" />
      <Footer />
    </div>
  );
}
