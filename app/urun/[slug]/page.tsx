export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Image from "next/image";
import { getSupabase, type Product } from "@/lib/supabase";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ProductTable from "@/app/components/ProductTable";
import { Tag, ArrowLeft, Phone } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-gray-400">
            <a href="/" className="hover:text-[#0f75bc] transition-colors flex items-center gap-1">
              <ArrowLeft size={12} /> Ana Sayfa
            </a>
            <span>/</span>
            <span className="text-gray-500">{product.category}</span>
            <span>/</span>
            <span className="text-[#07446c] font-semibold">{product.name}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Ürün üst bölümü */}
          <div className="grid md:grid-cols-2 gap-10 mb-12">
            {/* Görsel */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-[#e0f2fe] to-[#bae6fd] flex items-center justify-center">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-contain p-6"
                  priority
                />
              ) : (
                <span className="text-8xl opacity-20">🖨️</span>
              )}
            </div>

            {/* Bilgiler */}
            <div className="flex flex-col justify-center">
              {/* Kategori */}
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 bg-[#e0f2fe] text-[#0f75bc] text-xs font-bold px-3 py-1.5 rounded-full">
                  <Tag size={11} /> {product.category}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-[#07446c] leading-tight mb-4">
                {product.name}
              </h1>

              {product.description && (
                <p className="text-gray-500 leading-relaxed mb-8 text-base">
                  {product.description}
                </p>
              )}

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:08500000000"
                  className="inline-flex items-center justify-center gap-2 bg-[#e30613] hover:bg-red-700 text-white font-bold px-7 py-3.5 rounded-2xl transition-colors shadow-lg shadow-red-600/20 text-sm"
                >
                  <Phone size={16} />
                  Hemen Sipariş Ver
                </a>
                <a
                  href="/#teklif"
                  className="inline-flex items-center justify-center gap-2 border-2 border-[#07446c] text-[#07446c] hover:bg-[#07446c] hover:text-white font-bold px-7 py-3.5 rounded-2xl transition-colors text-sm"
                >
                  Teklif Al
                </a>
              </div>

              {/* Küçük güven notları */}
              <div className="flex flex-wrap gap-4 mt-8 text-xs text-gray-400 font-medium">
                <span>✓ Hızlı Teslimat</span>
                <span>✓ Kalite Garantisi</span>
                <span>✓ Güvenli Ödeme</span>
              </div>
            </div>
          </div>

          {/* Fiyat Matrisi */}
          {product.price_matrix &&
            product.price_matrix.groups?.length > 0 && (
              <div>
                <h2 className="text-xl font-black text-[#07446c] mb-5 flex items-center gap-2">
                  <span className="w-7 h-7 bg-[#e30613] text-white rounded-lg text-sm flex items-center justify-center font-black">
                    ₺
                  </span>
                  Fiyat Listesi
                </h2>
                <ProductTable matrix={product.price_matrix} />
              </div>
            )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
