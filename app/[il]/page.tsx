export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getSupabase, type Product } from "@/lib/supabase";
import { SITE_URL, getCityBySlug, CITY_PAGES_NOINDEX, type City } from "@/lib/seo";
import { ItemListSchema } from "@/app/components/SEO/Schema";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Tag } from "lucide-react";

const getCityData = cache(async (il: string): Promise<{ city: City; products: Product[] } | null> => {
  const city = getCityBySlug(il);
  if (!city) return null;

  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) console.error(`[${il}] Supabase hatası:`, error.message);

  return { city, products: (data ?? []) as Product[] };
});

export async function generateMetadata(props: {
  params: Promise<{ il: string }>;
}): Promise<Metadata> {
  const { il } = await props.params;
  const data = await getCityData(il);
  if (!data) return {};
  const { city } = data;

  return {
    title: `${city.name} Baskı ve Ambalaj Fiyatları`,
    description: `KMP Baskı, ${city.locative} dahil Türkiye'nin tüm illerine kargo ile gönderim yapıyor. ${city.name} için tüm ürünlerimizi ve fiyatlarını görün.`,
    alternates: { canonical: `${SITE_URL}/${city.slug}` },
    ...(CITY_PAGES_NOINDEX && { robots: { index: false, follow: true } }),
  };
}

export default async function CityHubPage(props: {
  params: Promise<{ il: string }>;
}) {
  const { il } = await props.params;
  const data = await getCityData(il);
  if (!data) notFound();

  const { city, products } = data;

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <ItemListSchema
        items={products.map((p) => ({ name: p.name, url: `${SITE_URL}/${city.slug}/${p.slug}` }))}
      />
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 text-xs text-gray-400">
          <a href="/" className="hover:text-[#0f75bc] transition-colors">Ana Sayfa</a>
          <span className="mx-2">/</span>
          <span className="text-[#07446c] font-semibold">{city.name}</span>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8 md:py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Tag size={16} className="text-[#0f75bc]" />
            <span className="text-xs font-bold text-[#0f75bc] uppercase tracking-widest">
              Şehir
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#07446c]">
            {city.name} Baskı ve Ambalaj Fiyatları
          </h1>
          <p className="text-gray-500 mt-3 text-sm max-w-2xl">
            KMP Baskı, {city.locative} dahil Türkiye&apos;nin 81 iline anlaşmalı kargo
            firmalarımızla gönderim yapıyor. {city.name}&apos;da ayrı bir şubemiz
            bulunmuyor; siparişiniz üretim merkezimizden hazırlanıp kargoya verilir.
            Aşağıda tüm ürünlerimizi ve {city.name} için fiyat bilgilerini bulabilirsiniz.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            Henüz ürün bulunmuyor.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/${city.slug}/${product.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="relative h-44 bg-[#f0f9ff] flex items-center justify-center overflow-hidden">
                  {product.is_firsat && (
                    <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Fırsat
                    </span>
                  )}
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={`${product.name} ${city.name}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-5xl opacity-20">🖨️</span>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h2 className="font-bold text-[#07446c] text-sm leading-snug group-hover:text-[#0f75bc] transition-colors line-clamp-2">
                    {product.name}
                  </h2>
                  <div className="mt-auto pt-3">
                    {product.is_price_on_request ? (
                      <span className="text-sm font-black text-orange-500">Fiyat Alınız</span>
                    ) : product.price ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-black text-[#07446c]">{product.price}</span>
                        <span className="text-[10px] text-gray-400">+KDV</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
