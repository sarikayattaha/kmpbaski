import type { Metadata } from "next";
import Image from "next/image";
import { getSupabase } from "@/lib/supabase";
import { SITE_NAME } from "@/lib/seo";
import LinkSearch, { type LinkProduct } from "./LinkSearch";

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: `${SITE_NAME} | Sosyal Medya Hızlı Erişim`,
  description:
    "KMP Baskı — Türkiye'nin ambalaj imalatçısı. Baklava kutusu, pide kutusu, pizza kutusu ve daha fazlası. Fabrikadan direkt fiyat, aracısız.",
  robots: { index: false },          // link sayfası arama sonuçlarında görünmesin
};

// ── Veri ─────────────────────────────────────────────────────────────────────

async function fetchLinkProducts(): Promise<LinkProduct[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, image_url")
    .ilike("category", "ambalaj")
    .not("slug", "is", null)
    .order("created_at", { ascending: true });
  if (error) return [];
  return (data ?? []).filter(p => p.slug);
}

// ── Sayfa ─────────────────────────────────────────────────────────────────────

export default async function LinkPage() {
  const products = await fetchLinkProducts();

  return (
    <div className="min-h-screen bg-[#f0f8ff]">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-[#07446c] text-white text-center px-6 pt-10 pb-8">
        <a href="/" className="inline-flex items-center justify-center mb-4">
          <Image
            src="/kmpbaskilogo.png"
            alt="KMP Baskı"
            width={52}
            height={52}
            fetchPriority="high"
            loading="eager"
            className="rounded-xl"
          />
        </a>
        <h1 className="text-2xl font-black tracking-tight">KMP Baskı</h1>
        <p className="text-[#93c5fd] text-sm font-bold mt-1 tracking-wide">
          Türkiye&apos;nin Ambalaj İmalatçısı
        </p>
        <div className="mt-4 inline-block bg-white/10 rounded-2xl px-4 py-2 text-xs text-blue-100 leading-relaxed">
          Fabrikadan direkt fiyat &middot; Aracısız &middot; Tüm Türkiye&apos;ye teslimat
        </div>
      </div>

      {/* ── İçerik (arama + grid + CTA) ────────────────────────────────────── */}
      <LinkSearch products={products} />

    </div>
  );
}
