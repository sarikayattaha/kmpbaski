export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { getSupabase, type Product } from "@/lib/supabase";
import { SITE_URL, getCityBySlug, pickCities, CITY_PAGES_NOINDEX, type City } from "@/lib/seo";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import TeklifButton from "@/app/urun/[slug]/TeklifButton";
import ProductGallery from "@/app/urun/[slug]/ProductGallery";
import { PRODUCT_FAQS } from "@/app/urun/[slug]/page";
import { FAQSchema, ProductSchema, BreadcrumbSchema } from "@/app/components/SEO/Schema";
import { Tag, ArrowLeft, CheckCircle2, ChevronDown } from "lucide-react";
import Link from "next/link";

const getCityProductData = cache(async (il: string, slug: string): Promise<{ city: City; product: Product } | null> => {
  const city = getCityBySlug(il);
  if (!city) return null;

  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) console.error(`[${il}/${slug}] Supabase hatası:`, error.message);
  if (!data) return null;

  return { city, product: data as Product };
});

export async function generateMetadata(props: {
  params: Promise<{ il: string; slug: string }>;
}): Promise<Metadata> {
  const { il, slug } = await props.params;
  const data = await getCityProductData(il, slug);
  if (!data) return {};
  const { city, product } = data;
  const url = `${SITE_URL}/${city.slug}/${slug}`;

  return {
    title: `${city.name} ${product.name} Fiyatları`,
    description: `${product.name} ürününü ${city.locative} sipariş edin. KMP Baskı, Türkiye'nin 81 iline kargo ile gönderim yapıyor. Fiyat, özellikler ve teklif alma bilgisi.`,
    alternates: { canonical: url },
    openGraph: {
      images: product.image_url ? [{ url: product.image_url }] : [],
    },
    ...(CITY_PAGES_NOINDEX && { robots: { index: false, follow: true } }),
  };
}

export default async function CityProductPage(props: {
  params: Promise<{ il: string; slug: string }>;
}) {
  const { il, slug } = await props.params;
  const data = await getCityProductData(il, slug);
  if (!data) notFound();

  const { city, product } = data;

  const featureLines = (product.features ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const pageUrl = `${SITE_URL}/${city.slug}/${slug}`;
  const siblingCities = pickCities(slug, 6, city.slug);
  const cityFaqs = [
    ...PRODUCT_FAQS,
    {
      q: `${product.name} ${city.locative} kaç günde teslim edilir?`,
      a: `Üretim süremiz 2-5 iş günüdür. Kargo süresi, anlaşmalı kargo firmamızın ${city.name}'a olan bölgesel teslimat süresine göre değişir; genellikle 1-3 iş günü içinde elinize ulaşır.`,
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ProductSchema
        name={product.name}
        url={pageUrl}
        image={product.image_url}
        category={product.category}
        price={product.price}
        isPriceOnRequest={product.is_price_on_request}
      />
      <BreadcrumbSchema items={[
        { name: "Ana Sayfa", url: SITE_URL },
        { name: city.name, url: `${SITE_URL}/${city.slug}` },
        { name: product.name, url: pageUrl },
      ]} />
      <FAQSchema faqs={cityFaqs} />
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center gap-2 text-xs text-gray-400">
          <a href="/" className="hover:text-[#0f75bc] transition-colors flex items-center gap-1">
            <ArrowLeft size={12} /> Ana Sayfa
          </a>
          <span>/</span>
          <a href={`/${city.slug}`} className="hover:text-[#0f75bc] transition-colors">
            {city.name}
          </a>
          <span>/</span>
          <span className="text-[#07446c] font-semibold">{product.name}</span>
        </div>
      </div>

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-12">
          <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-start">

            {/* ── GÖRSEL GALERİ ── */}
            <ProductGallery
              images={Array.isArray(product.images) && product.images.length > 0 ? product.images : product.image_url ? [product.image_url] : []}
              name={product.name}
              city={city.name}
            />

            {/* ── BİLGİLER ── */}
            <div className="flex flex-col gap-5">
              <span className="inline-flex items-center gap-1.5 bg-[#e0f2fe] text-[#0f75bc] text-xs font-bold px-3 py-1.5 rounded-full w-fit">
                <Tag size={11} /> {product.category}
              </span>

              <h1 className="text-3xl md:text-4xl font-black text-[#07446c] leading-tight">
                {city.name} {product.name} Fiyatları
              </h1>

              <p className="text-sm text-gray-500 leading-relaxed">
                KMP Baskı, {product.name} ürününü {city.locative} dahil Türkiye&apos;nin 81
                iline anlaşmalı kargo firmalarımızla gönderiyor. {city.name}&apos;da ayrı bir
                şubemiz bulunmuyor; siparişiniz üretim merkezimizden hazırlanıp kargoya
                verilir — üretim süresi 2-5 iş günü, kargo süresi ise bölgeye göre
                değişmektedir.
              </p>

              {!product.is_price_on_request && product.price && (
                <div className="bg-[#f0fdf4] border border-green-100 rounded-2xl px-5 py-4 inline-block">
                  <p className="text-xs text-green-600 font-semibold mb-0.5">Başlayan Fiyat</p>
                  <p className="text-3xl font-black text-[#07446c] leading-none">
                    {product.price}
                    <span className="text-sm font-normal text-gray-400 ml-2">+KDV</span>
                  </p>
                </div>
              )}

              {featureLines.length > 0 && (
                <div>
                  <h2 className="text-sm font-black text-[#07446c] uppercase tracking-wide mb-3">
                    Ürün Özellikleri
                  </h2>
                  <ul className="space-y-2">
                    {featureLines.map((line, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <CheckCircle2 size={16} className="text-[#25aae1] flex-shrink-0 mt-0.5" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-2">
                <TeklifButton product={product} />
              </div>

              <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-100 text-xs text-gray-400 font-medium">
                <span>✓ Hızlı Teslimat</span>
                <span>✓ Kalite Garantisi</span>
                <span>✓ Güvenli Ödeme</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Diğer şehirlerde bu ürün */}
      <section className="bg-white border-t border-gray-100 py-10">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <h2 className="text-lg font-black text-[#07446c] mb-4">
            Diğer Şehirlerde {product.name}
          </h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {siblingCities.map((sibling) => (
              <Link
                key={sibling.slug}
                href={`/${sibling.slug}/${slug}`}
                className="px-3 py-1.5 rounded-full bg-[#f0f9ff] text-[#0f75bc] text-xs font-semibold hover:bg-[#e0f2fe] transition-colors"
              >
                {sibling.name}
              </Link>
            ))}
          </div>
          <Link
            href={`/urun/${slug}`}
            className="text-sm font-bold text-[#0f75bc] hover:underline"
          >
            Tüm {product.name} Bilgileri →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#f8fafc] border-t border-gray-100 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-black text-[#07446c] mb-6">Sıkça Sorulan Sorular</h2>
          <div className="space-y-3">
            {cityFaqs.map((faq) => (
              <details key={faq.q} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none font-bold text-[#07446c] text-sm hover:bg-[#f0f9ff] transition-colors">
                  {faq.q}
                  <ChevronDown size={16} className="text-[#0f75bc] flex-shrink-0 group-open:rotate-180 transition-transform duration-200" />
                </summary>
                <p className="px-6 pb-4 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-50">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
