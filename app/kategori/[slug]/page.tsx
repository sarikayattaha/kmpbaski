import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getSupabase, type Product } from "@/lib/supabase";
import { toSlug, SITE_NAME } from "@/lib/seo";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Tag } from "lucide-react";

export const dynamic = "force-dynamic";

async function getCategoryData(slug: string): Promise<{ name: string; products: Product[] } | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (!data) return null;

  const allProducts = data as Product[];
  const categoryName = allProducts.find((p) => toSlug(p.category) === slug)?.category;
  if (!categoryName) return null;

  const products = allProducts.filter((p) => p.category === categoryName);
  return { name: categoryName, products };
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const data = await getCategoryData(slug);
  if (!data) return {};
  return {
    title: `${data.name} Baskı`,
    description: `${data.name} baskı ürünleri — ${data.products.length} çeşit. Hızlı teslimat, kalite garantisi. ${SITE_NAME}'dan fiyat alın.`,
    alternates: { canonical: `/kategori/${slug}` },
  };
}

export default async function KategoriPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const data = await getCategoryData(slug);
  if (!data) notFound();

  const { name, products } = data;

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 text-xs text-gray-400">
          <a href="/" className="hover:text-[#0f75bc] transition-colors">Ana Sayfa</a>
          <span className="mx-2">/</span>
          <a href="/tum-urunler" className="hover:text-[#0f75bc] transition-colors">Tüm Ürünler</a>
          <span className="mx-2">/</span>
          <span className="text-[#07446c] font-semibold">{name}</span>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8 md:py-12">
        {/* Başlık */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Tag size={16} className="text-[#0f75bc]" />
            <span className="text-xs font-bold text-[#0f75bc] uppercase tracking-widest">
              Kategori
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#07446c]">{name}</h1>
          <p className="text-gray-500 mt-2 text-sm">{products.length} ürün</p>
        </div>

        {/* Ürün grid */}
        {products.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            Bu kategoride henüz ürün bulunmuyor.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/urun/${product.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* Görsel */}
                <div className="relative h-44 bg-[#f0f9ff] flex items-center justify-center overflow-hidden">
                  {product.is_firsat && (
                    <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Fırsat
                    </span>
                  )}
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-5xl opacity-20">🖨️</span>
                  )}
                </div>

                {/* Bilgi */}
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
