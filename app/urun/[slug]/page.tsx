export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getSupabase, type Product } from "@/lib/supabase";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import TeklifButton from "./TeklifButton";
import ProductGallery from "./ProductGallery";
import ReviewsSection from "@/app/components/ReviewsSection";
import { Tag, ArrowLeft, CheckCircle2 } from "lucide-react";

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

  // Özellikler: satır satır listele
  const featureLines = (product.features ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-gray-400">
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
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-12 items-start">

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
                <span>✓ Ücretsiz Kargo</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ReviewsSection slug={slug} reviews={product.reviews} />

      <Footer />
    </div>
  );
}
