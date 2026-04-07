export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Image from "next/image";
import { getSupabase, type Product } from "@/lib/supabase";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Tag, ArrowLeft, Phone, MessageCircle, CheckCircle2 } from "lucide-react";

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

  const whatsappMsg = encodeURIComponent(
    `Merhaba, "${product.name}" ürünü hakkında bilgi almak istiyorum.`
  );
  const whatsappPriceMsg = encodeURIComponent(
    `Merhaba, ${product.name} ürünü hakkında fiyat teklifi almak istiyorum.`
  );

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

            {/* ── GÖRSEL ── */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-[#e0f2fe] to-[#bae6fd] shadow-sm">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-contain p-10"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-9xl opacity-10">🖨️</div>
              )}
            </div>

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

              {/* Aksiyon butonları */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {product.is_price_on_request ? (
                  <a
                    href={`https://wa.me/908500000000?text=${whatsappPriceMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-black px-6 py-4 rounded-2xl transition-colors shadow-lg shadow-orange-400/20 text-sm"
                  >
                    <MessageCircle size={18} /> Teklif Al
                  </a>
                ) : (
                  <a
                    href={`https://wa.me/908500000000?text=${whatsappMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#1da851] text-white font-black px-6 py-4 rounded-2xl transition-colors shadow-lg shadow-green-400/20 text-sm"
                  >
                    <MessageCircle size={18} /> WhatsApp&apos;tan Sor
                  </a>
                )}
                <a
                  href="tel:08500000000"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#e30613] hover:bg-red-700 text-white font-black px-6 py-4 rounded-2xl transition-colors shadow-lg shadow-red-500/20 text-sm"
                >
                  <Phone size={18} /> Hemen Ara
                </a>
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

      <Footer />
    </div>
  );
}
