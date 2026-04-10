export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getSupabase, type AmbalajCategory, type AmbalajProduct } from "@/lib/supabase";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import { Package, ChevronRight, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { pageTitle, SITE_URL, SITE_NAME } from "@/lib/seo";
import { BreadcrumbSchema, ProductSchema } from "@/app/components/SEO/Schema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = getSupabase();
  if (!supabase) return {};
  const { data } = await supabase
    .from("ambalaj_categories")
    .select("name")
    .eq("slug", slug)
    .single();
  if (!data) return {};
  const title = pageTitle(`${data.name} - Özel Ambalaj ve Kutu Baskısı`);
  return {
    title,
    description: `${data.name} için özel tasarım ve baskı çözümleri. Markanıza özel üretim, toptan fiyat. KMP Baskı'dan teklif alın.`,
    openGraph: {
      title,
      url: `${SITE_URL}/ambalaj/${slug}`,
      siteName: SITE_NAME,
      locale: "tr_TR",
    },
    alternates: { canonical: `${SITE_URL}/ambalaj/${slug}` },
  };
}

export default async function AmbalajCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = getSupabase();

  if (!supabase) notFound();

  const { data: catData } = await supabase
    .from("ambalaj_categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!catData) notFound();
  const cat = catData as AmbalajCategory;

  const { data: prodData } = await supabase
    .from("ambalaj_products")
    .select("*")
    .eq("category_id", cat.id)
    .order("created_at", { ascending: false });

  const products = (prodData as AmbalajProduct[]) ?? [];

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <BreadcrumbSchema
        items={[
          { name: "Ana Sayfa",           url: SITE_URL },
          { name: "Ambalaj Çözümleri",   url: `${SITE_URL}/ambalaj` },
          { name: cat.name,              url: `${SITE_URL}/ambalaj/${cat.slug}` },
        ]}
      />
      <ProductSchema
        name={cat.name}
        description={`${cat.name} için özel tasarım ve baskı çözümleri. Markanıza özel üretim, toptan fiyat.`}
        url={`${SITE_URL}/ambalaj/${cat.slug}`}
        image={cat.cover_image ?? undefined}
        category="Ambalaj"
      />

      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-gray-400">
          <a href="/" className="hover:text-[#0f75bc] transition-colors">Ana Sayfa</a>
          <span>/</span>
          <a href="/ambalaj" className="hover:text-[#0f75bc] transition-colors">Ambalaj Çözümleri</a>
          <span>/</span>
          <span className="text-[#07446c] font-semibold">{cat.name}</span>
        </div>
      </div>

      {/* Kategori header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center gap-5">
          {cat.cover_image ? (
            <div className="w-16 h-16 rounded-2xl overflow-hidden relative flex-shrink-0 border border-gray-100 shadow-sm">
              <Image src={cat.cover_image} alt={cat.name} fill className="object-cover" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-[#e0f2fe] flex items-center justify-center flex-shrink-0">
              <Package size={28} className="text-[#0f75bc]" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-black text-[#07446c]">{cat.name}</h1>
            <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-1.5">
              <span className="font-semibold text-[#0f75bc]">{products.length}</span> ürün
              <span className="text-gray-200">·</span>
              <a href="/ambalaj" className="hover:text-[#0f75bc] flex items-center gap-0.5 transition-colors">
                Tüm Kategoriler <ChevronRight size={12} />
              </a>
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-300">
            <Package size={48} className="mx-auto mb-4 opacity-40" />
            <p className="font-medium">Bu kategoride henüz ürün yok.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function ProductCard({ product: p }: { product: AmbalajProduct }) {
  const waLink = `https://wa.me/905541630031?text=${encodeURIComponent(`Merhaba, "${p.name}" ürünü hakkında fiyat teklifi almak istiyorum.`)}`;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#bae6fd] hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden">
      <div className="relative h-44 bg-gradient-to-br from-[#f0f7ff] to-[#e0f2fe] overflow-hidden">
        {p.image_url ? (
          <Image src={p.image_url} alt={p.name} fill sizes="(max-width:768px) 50vw, 25vw"
            className="object-contain p-5 group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-10">📦</div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-[#07446c] leading-snug flex-1 group-hover:text-[#0f75bc] transition-colors">
          {p.name}
        </h3>
        {p.description && (
          <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">{p.description}</p>
        )}
        <a href={waLink} target="_blank" rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-1.5 w-full bg-[#25D366] hover:bg-[#1ebe57] text-white text-xs font-bold py-2.5 rounded-xl transition-colors">
          <MessageCircle size={13} /> Teklif Al
        </a>
      </div>
    </div>
  );
}
