export const dynamic = "force-dynamic";

import { getSupabase, type AmbalajCategory, type AmbalajProduct } from "@/lib/supabase";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import { Package, ChevronRight, MessageCircle } from "lucide-react";

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

  const phone   = "905541630031";
  const waBase  = `https://wa.me/${phone}?text=${encodeURIComponent("Merhaba, ambalaj ürünleri hakkında bilgi almak istiyorum.")}`;

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-gray-400">
          <a href="/" className="hover:text-[#0f75bc] transition-colors">Ana Sayfa</a>
          <span>/</span>
          <span className="text-[#07446c] font-semibold">Ambalaj Çözümleri</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-[#07446c] text-white">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <span className="inline-block text-xs font-bold text-[#25aae1] uppercase tracking-widest mb-3">Özel Ambalaj Çözümleri</span>
            <h1 className="text-3xl md:text-4xl font-black leading-tight mb-4">
              Markanızı Yansıtan<br />
              <span className="text-[#25aae1]">Ambalaj Tasarımları</span>
            </h1>
            <p className="text-blue-200 text-sm md:text-base max-w-lg leading-relaxed">
              Pastane kutularından fast food ambalajlarına, özel ebat ve tasarımlarla markanıza özel baskılı ambalaj çözümleri üretiyoruz.
            </p>
            <a href={waBase} target="_blank" rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold px-6 py-3 rounded-2xl transition-colors shadow-lg text-sm">
              <MessageCircle size={17} /> WhatsApp ile Teklif Al
            </a>
          </div>
          <div className="text-8xl opacity-20 hidden md:block">📦</div>
        </div>
      </div>

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
          const preview = catProducts.slice(0, 4);
          const hasMore = catProducts.length > 4;

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
                {hasMore && (
                  <a href={`/ambalaj/${cat.slug}`}
                    className="flex items-center gap-1 text-sm font-bold text-[#0f75bc] hover:text-[#07446c] transition-colors group">
                    Tümünü Gör
                    <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </a>
                )}
              </div>

              {/* Ürünler — mobil slider / masaüstü grid */}
              <div className="md:hidden flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-none -mx-2 px-2">
                {preview.map(p => <ProductCard key={p.id} product={p} waBase={waBase} mobile />)}
              </div>
              <div className="hidden md:grid grid-cols-4 gap-5">
                {preview.map(p => <ProductCard key={p.id} product={p} waBase={waBase} />)}
              </div>

              {hasMore && (
                <div className="mt-4 flex justify-center md:justify-end">
                  <a href={`/ambalaj/${cat.slug}`}
                    className="flex items-center gap-2 text-sm font-bold text-[#0f75bc] border border-[#0f75bc] hover:bg-[#0f75bc] hover:text-white px-5 py-2 rounded-xl transition-all">
                    {cat.name} — Tümünü Gör <ChevronRight size={15} />
                  </a>
                </div>
              )}
            </section>
          );
        })}

      </main>

      <Footer />
    </div>
  );
}

function ProductCard({ product: p, waBase, mobile }: { product: AmbalajProduct; waBase: string; mobile?: boolean }) {
  const waLink = `https://wa.me/905541630031?text=${encodeURIComponent(`Merhaba, "${p.name}" ürünü hakkında fiyat teklifi almak istiyorum.`)}`;

  return (
    <div className={`group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#bae6fd] hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden flex-shrink-0 ${mobile ? "w-52 snap-start" : ""}`}>
      {/* Görsel */}
      <div className="relative h-44 bg-gradient-to-br from-[#f0f7ff] to-[#e0f2fe] overflow-hidden">
        {p.image_url ? (
          <Image src={p.image_url} alt={p.name} fill sizes="(max-width:768px) 208px, 25vw"
            className="object-contain p-5 group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-10">📦</div>
        )}
      </div>

      {/* Bilgi */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-[#07446c] leading-snug flex-1 group-hover:text-[#0f75bc] transition-colors">
          {p.name}
        </h3>
        {p.description && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{p.description}</p>
        )}
        <a href={waLink} target="_blank" rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-1.5 w-full bg-[#25D366] hover:bg-[#1ebe57] text-white text-xs font-bold py-2.5 rounded-xl transition-colors">
          <MessageCircle size={13} /> Teklif Al
        </a>
      </div>
    </div>
  );
}
