import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { SITE_NAME } from "@/lib/seo";
import LinkSearch, { type LinkProduct, type LinkCategory } from "./LinkSearch";

// ── Metadata ──────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: `${SITE_NAME} | Hızlı Sipariş`,
  description: "KMP Baskı — Baskı & ambalaj çözümleri. Fabrikadan direkt fiyat, aracısız.",
  robots: { index: false },
};

// ── Veri ──────────────────────────────────────────────────────────────────────
async function fetchData(): Promise<{ products: LinkProduct[]; categories: LinkCategory[] }> {
  const supabase = getSupabase();
  if (!supabase) return { products: [], categories: [] };

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, slug, image_url, category")
      .not("slug", "is", null)
      .order("sort_order", { ascending: true }),
    supabase
      .from("categories")
      .select("name")
      .order("navbar_order", { ascending: true }),
  ]);

  const productList = ((products ?? []) as LinkProduct[]).filter(p => p.slug);

  // Sadece ürünü olan kategorileri göster
  const productCats = new Set(productList.map(p => p.category));
  const categoryList = ((categories ?? []) as LinkCategory[]).filter(c =>
    productCats.has(c.name)
  );

  return { products: productList, categories: categoryList };
}

// ── Sayfa ─────────────────────────────────────────────────────────────────────
export default async function LinkPage() {
  const { products, categories } = await fetchData();

  return (
    <div className="min-h-screen bg-[#f0f8ff]">

      {/* Header */}
      <div className="bg-[#07446c] text-white text-center px-6 pt-10 pb-8">
        <Link href="/" className="inline-flex items-center justify-center mb-4">
          <Image
            src="/kmpbaskilogo.png"
            alt="KMP Baskı"
            width={56}
            height={56}
            fetchPriority="high"
            loading="eager"
            className="rounded-xl"
          />
        </Link>
        <h1 className="text-2xl font-black tracking-tight">KMP Baskı</h1>
        <p className="text-[#93c5fd] text-sm font-bold mt-1 tracking-wide">
          Baskı &amp; Ambalaj Çözümleri
        </p>
        <div className="mt-4 inline-block bg-white/10 rounded-2xl px-4 py-2 text-xs text-blue-100 leading-relaxed">
          Fabrikadan direkt fiyat · Aracısız · Tüm Türkiye&apos;ye teslimat
        </div>
      </div>

      <LinkSearch products={products} categories={categories} />
    </div>
  );
}
