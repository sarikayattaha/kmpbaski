export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupabase, type Product } from "@/lib/supabase";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const supabase = getSupabase();
  if (!supabase) return {};
  const { data } = await supabase
    .from("products")
    .select("name, description, image_url")
    .eq("slug", slug)
    .single();
  if (!data) return {};
  return {
    title: data.name,
    description: data.description
      ? String(data.description).slice(0, 160)
      : `${data.name} baskı hizmeti — hızlı teslimat, kalite garantisi. KMP Baskı'dan fiyat alın.`,
    alternates: { canonical: `/urun/${slug}` },
    openGraph: {
      images: data.image_url ? [{ url: data.image_url }] : [],
    },
  };
}
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import TeklifButton from "./TeklifButton";
import ProductGallery from "./ProductGallery";
import ReviewsSection from "@/app/components/ReviewsSection";
import { FAQSchema, ProductSchema, BreadcrumbSchema } from "@/app/components/SEO/Schema";
import { Tag, ArrowLeft, CheckCircle2, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SITE_URL } from "@/lib/seo";
import { toSlug } from "@/lib/seo";

const PRODUCT_FAQS = [
  {
    q: "Minimum sipariş adedi nedir?",
    a: "Minimum sipariş adedi ürüne göre farklılık göstermektedir. En doğru bilgi için müşteri hizmetlerimizi arayarak detaylı bilgi alabilirsiniz.",
  },
  {
    q: "Teslimat süresi ne kadar?",
    a: "Teslimat süresi ürün ve sipariş miktarına göre değişmektedir. Genellikle 2-5 iş günü içinde teslim edilmektedir. Kesin süre için müşteri hizmetlerimizi arayarak teyit ediniz.",
  },
  {
    q: "Fiyat teklifi nasıl alabilirim?",
    a: `Teklif formumuzu doldurabilir ya da +90 554 163 00 31 numaralı müşteri hizmetleri hattımızı arayabilirsiniz. En kısa sürede size geri dönüş yapıyoruz.`,
  },
  {
    q: "Özel boyut veya tasarım yaptırabilir miyim?",
    a: "Evet, özel ölçü ve tasarım talepleriniz için müşteri hizmetlerimizle iletişime geçmeniz yeterlidir. Uzman ekibimiz size en uygun çözümü sunar.",
  },
];

export default async function ProductPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  const supabase = getSupabase();
  if (!supabase) notFound();

  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!data) notFound();

  const product = data as Product;

  // İlgili ürünler — aynı kategori, mevcut ürün hariç, max 4
  const { data: relatedData } = await supabase
    .from("products")
    .select("id, name, slug, image_url, price, is_price_on_request")
    .eq("category", product.category)
    .neq("slug", slug)
    .limit(4);

  const relatedProducts = (relatedData ?? []) as Pick<Product, "id" | "name" | "slug" | "image_url" | "price" | "is_price_on_request">[];

  // Özellikler: satır satır listele
  const featureLines = (product.features ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const productUrl = `${SITE_URL}/urun/${slug}`;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ProductSchema
        name={product.name}
        url={productUrl}
        image={product.image_url}
        category={product.category}
      />
      <BreadcrumbSchema items={[
        { name: "Ana Sayfa", url: SITE_URL },
        { name: product.category, url: `${SITE_URL}/kategori/${toSlug(product.category)}` },
        { name: product.name, url: productUrl },
      ]} />
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center gap-2 text-xs text-gray-400">
          <a href="/" className="hover:text-[#0f75bc] transition-colors flex items-center gap-1">
            <ArrowLeft size={12} /> Ana Sayfa
          </a>
          <span>/</span>
          <a href={`/tum-urunler?kategori=${encodeURIComponent(product.category)}`}
            className="hover:text-[#0f75bc] transition-colors">
            {product.category}
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
            />

            {/* ── BİLGİLER ── */}
            <div className="flex flex-col gap-5">
              {/* Kategori etiketi */}
              <span className="inline-flex items-center gap-1.5 bg-[#e0f2fe] text-[#0f75bc] text-xs font-bold px-3 py-1.5 rounded-full w-fit">
                <Tag size={11} /> {product.category}
              </span>

              {/* Ürün adı */}
              <h1 className="text-3xl md:text-4xl font-black text-[#07446c] leading-tight">
                {product.name}
              </h1>

              {/* Fiyat */}
              {product.is_price_on_request ? (
                <div className="bg-orange-50 border border-orange-200 rounded-2xl px-5 py-4 inline-block">
                  <p className="text-xs text-orange-500 font-semibold mb-0.5">Fiyat Bilgisi</p>
                  <p className="text-3xl font-black text-orange-500 leading-none tracking-wide">Fiyat Alınız</p>
                </div>
              ) : product.price ? (
                <div className="bg-[#f0fdf4] border border-green-100 rounded-2xl px-5 py-4 inline-block">
                  <p className="text-xs text-green-600 font-semibold mb-0.5">Başlayan Fiyat</p>
                  <p className="text-3xl font-black text-[#07446c] leading-none">
                    {product.price}
                    <span className="text-sm font-normal text-gray-400 ml-2">+KDV</span>
                  </p>
                </div>
              ) : null}

              {/* Özellikler listesi */}
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

              {/* Aksiyon butonu */}
              <div className="pt-2">
                <TeklifButton product={product} />
              </div>

              {/* Güvence ikonları */}
              <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-100 text-xs text-gray-400 font-medium">
                <span>✓ Hızlı Teslimat</span>
                <span>✓ Kalite Garantisi</span>
                <span>✓ Güvenli Ödeme</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* İlgili ürünler */}
      {relatedProducts.length > 0 && (
        <section className="bg-white border-t border-gray-100 py-12">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <h2 className="text-2xl font-black text-[#07446c] mb-6">
              {product.category} Kategorisindeki Diğer Ürünler
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/urun/${p.slug}`}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-36 bg-white flex items-center justify-center overflow-hidden">
                    {p.image_url ? (
                      <Image
                        src={p.image_url}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-4xl opacity-20">🖨️</span>
                    )}
                  </div>
                  <div className="p-3 flex flex-col flex-1 border-t border-gray-50">
                    <p className="font-bold text-[#07446c] text-xs leading-snug group-hover:text-[#0f75bc] transition-colors line-clamp-2">
                      {p.name}
                    </p>
                    <div className="mt-auto pt-2">
                      {p.is_price_on_request ? (
                        <span className="text-xs font-black text-orange-500">Fiyat Alınız</span>
                      ) : p.price ? (
                        <span className="text-sm font-black text-[#07446c]">{p.price}</span>
                      ) : null}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <ReviewsSection slug={slug} reviews={product.reviews} />

      {/* FAQ */}
      <FAQSchema faqs={PRODUCT_FAQS} />
      <section className="bg-[#f8fafc] border-t border-gray-100 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-black text-[#07446c] mb-6">Sıkça Sorulan Sorular</h2>
          <div className="space-y-3">
            {PRODUCT_FAQS.map((faq) => (
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
