export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MessageCircle, CheckCircle, Package, Phone } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import GlossarySection from "@/app/components/GlossarySection";
import DynamicFAQ from "@/app/components/DynamicFAQ";
import InternalLinkCloud from "@/app/components/InternalLinkCloud";
import { BreadcrumbSchema, ProductSchema } from "@/app/components/SEO/Schema";
import {
  CITIES,
  SITE_URL,
  SITE_NAME,
  currentMonthYear,
  getCityBySlug,
} from "@/lib/seo";
import { getAmbalajCategories } from "@/lib/ambalaj-data";

type Params = { city: string; product: string };
type Props  = { params: Promise<Params> };

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug, product: productSlug } = await params;
  const city       = getCityBySlug(citySlug);
  const categories = await getAmbalajCategories();
  const category   = categories.find(c => c.slug === productSlug);
  if (!city || !category) return {};

  const monthYear   = currentMonthYear();
  const title       = `${city.name} ${category.name} Fiyatları - ${monthYear} | ${SITE_NAME}`;
  const description = `${city.locative} ${category.name.toLowerCase()} imalatı, özel baskı ve toptan satış. Markanıza özel tasarım, hızlı üretim, rekabetçi fiyat. KMP Baskı'dan teklif alın.`;
  const url         = `${SITE_URL}/ambalaj/${citySlug}/${productSlug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "tr_TR",
      type: "website",
    },
    alternates: { canonical: url },
  };
}

// ── Sayfa ─────────────────────────────────────────────────────────────────────

export default async function CityProductPage({ params }: Props) {
  const { city: citySlug, product: productSlug } = await params;

  const [city, categories] = await Promise.all([
    Promise.resolve(getCityBySlug(citySlug)),
    getAmbalajCategories(),
  ]);

  const category = categories.find(c => c.slug === productSlug);
  if (!city || !category) notFound();

  const pageUrl   = `${SITE_URL}/ambalaj/${citySlug}/${productSlug}`;
  const monthYear = currentMonthYear();
  const waText    = encodeURIComponent(
    `Merhaba, ${city.name} için ${category.name} hakkında fiyat teklifi almak istiyorum.`
  );

  const features = [
    {
      title: "Özel Tasarım",
      desc: `Markanıza özel ${category.name.toLowerCase()} tasarımı, minimum adet kısıtı olmadan.`,
    },
    {
      title: "Hızlı Üretim",
      desc: "Kısa üretim süreleri, acil siparişlere öncelikli hizmet ve teslim garantisi.",
    },
    {
      title: "Toptan Fiyat",
      desc: "Büyük ya da küçük sipariş fark etmez — her miktarda rekabetçi fiyat.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      {/* Schemas */}
      <BreadcrumbSchema
        items={[
          { name: "Ana Sayfa",         url: SITE_URL },
          { name: "Ambalaj Çözümleri", url: `${SITE_URL}/ambalaj` },
          { name: city.name,           url: `${SITE_URL}/ambalaj/${citySlug}` },
          { name: category.name,       url: pageUrl },
        ]}
      />
      <ProductSchema
        name={`${city.name} ${category.name}`}
        description={`${city.locative} ${category.name.toLowerCase()} imalatı ve toptan satış.`}
        url={pageUrl}
        category="Ambalaj"
      />

      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-gray-400 flex-wrap">
          <a href="/"        className="hover:text-[#0f75bc] transition-colors">Ana Sayfa</a>
          <span>/</span>
          <a href="/ambalaj" className="hover:text-[#0f75bc] transition-colors">Ambalaj</a>
          <span>/</span>
          <span className="text-[#07446c] font-semibold">{city.name}</span>
          <span>/</span>
          <span className="text-[#07446c] font-semibold">{category.name}</span>
        </div>
      </div>

      <main className="flex-1">

        {/* Hero */}
        <section className="bg-gradient-to-br from-[#07446c] to-[#0f75bc] text-white">
          <div className="max-w-4xl mx-auto px-6 py-16 text-center">
            <p className="text-[#93c5fd] text-xs font-black uppercase tracking-widest mb-4">
              {city.name} · Ambalaj Çözümleri · {monthYear}
            </p>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-5">
              {city.name} {category.name}
              <br className="hidden md:block" />
              <span className="text-[#93c5fd]"> Fiyatları ve İmalatı</span>
            </h1>
            <p className="text-blue-100 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              {city.locative} faaliyet gösteren işletmeler için özel tasarımlı{" "}
              {category.name.toLowerCase()} üretimi. Markanıza özel baskı, hızlı teslimat,
              rekabetçi fiyat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/905541630031?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe57] text-white font-black px-8 py-4 rounded-2xl transition-colors shadow-xl text-sm"
              >
                <MessageCircle size={18} /> WhatsApp ile Teklif Al
              </a>
              <a
                href="tel:+905541630031"
                className="inline-flex items-center justify-center gap-2.5 bg-white/15 hover:bg-white/25 text-white font-bold px-8 py-4 rounded-2xl transition-colors text-sm"
              >
                <Phone size={18} /> Hemen Ara
              </a>
            </div>
          </div>
        </section>

        {/* Özellikler */}
        <section className="max-w-5xl mx-auto px-6 py-14">
          <h2 className="text-2xl font-black text-[#07446c] text-center mb-10">
            {city.name}&apos;da Neden KMP Baskı?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map(f => (
              <div
                key={f.title}
                className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm hover:shadow-md hover:border-[#bae6fd] transition-all"
              >
                <CheckCircle size={24} className="text-[#0f75bc] mb-3" />
                <h3 className="font-black text-[#07446c] mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Ürün açıklama */}
        <section className="bg-white border-y border-gray-100">
          <div className="max-w-3xl mx-auto px-6 py-12 text-center">
            <Package size={40} className="text-[#0f75bc]/30 mx-auto mb-4" />
            <h2 className="text-xl font-black text-[#07446c] mb-3">
              {city.name} {category.name} — Özellikler
            </h2>
            <p className="text-gray-500 leading-relaxed mb-3">
              {city.locative} tüm sektörler için özelleştirilebilir ebat, baskı ve malzeme
              seçenekleriyle {category.name.toLowerCase()} üretimi yapıyoruz. Markanıza özel
              tasarım ve hızlı teslimat için bizimle iletişime geçin.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-6 py-14 text-center">
          <h2 className="text-2xl font-black text-[#07446c] mb-3">
            {city.name} {category.name} için Fiyat Teklifi Al
          </h2>
          <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
            WhatsApp&apos;tan görseli, ölçüyü ve adedi paylaşın — en kısa sürede size özel
            teklif gönderelim.
          </p>
          <a
            href={`https://wa.me/905541630031?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold px-8 py-4 rounded-2xl transition-colors shadow-lg text-sm"
          >
            <MessageCircle size={18} /> WhatsApp ile Teklif Al — Ücretsiz
          </a>
        </section>

        {/* Sıkça Sorulan Sorular + FAQ Schema */}
        <DynamicFAQ productName={category.name} city={city} />

      </main>

      {/* İç linkleme ağı */}
      <InternalLinkCloud
        currentCitySlug={citySlug}
        currentProductSlug={productSlug}
        allCategories={categories}
      />

      {/* SEO Sözlük */}
      <GlossarySection topic="ambalaj" />

      <Footer />
    </div>
  );
}
