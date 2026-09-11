export const dynamic = "force-dynamic";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tüm Ürünler",
  description: "Kartvizit, broşür, katalog, tabela, ambalaj ve daha fazlası. KMP Baskı'nın tüm baskı ürünlerini keşfedin, fiyat alın.",
  alternates: { canonical: "/tum-urunler" },
};
import { getSupabase, type Product } from "@/lib/supabase";
import { SITE_URL } from "@/lib/seo";
import { ItemListSchema } from "@/app/components/SEO/Schema";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import CatalogClient from "./CatalogClient";

export default async function TumUrunlerPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; filtre?: string; q?: string }>;
}) {
  const { kategori, filtre, q } = await searchParams;

  const supabase = getSupabase();
  let products: Product[] = [];
  let categories: string[] = [];

  if (supabase) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (data) {
      products = data as Product[];
      categories = [...new Set(products.map((p) => p.category).filter(Boolean))];
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <ItemListSchema
        items={products.slice(0, 200).map((p) => ({ name: p.name, url: `${SITE_URL}/urun/${p.slug}` }))}
      />
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center gap-2 text-xs text-gray-400">
          <a href="/" className="hover:text-[#0f75bc] transition-colors">Ana Sayfa</a>
          <span>/</span>
          <span className="text-[#07446c] font-semibold">Tüm Ürünler</span>
        </div>
      </div>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
          <CatalogClient
            products={products}
            categories={categories}
            activeCategory={kategori ?? null}
            activeFilter={filtre ?? null}
            searchQuery={q ?? null}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
