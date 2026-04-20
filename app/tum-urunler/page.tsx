export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { getSupabase, type Product } from "@/lib/supabase";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import CatalogClient from "./CatalogClient";

export default async function TumUrunlerPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; filtre?: string; q?: string }>;
}) {
  const { kategori, filtre, q } = await searchParams;

  const supabase = getSupabase();
  let products: Product[] = [];
  let categories: string[] = [];

  if (supabase) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      products = data as Product[];
      categories = [...new Set(products.map((p) => p.category).filter(Boolean))];
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-gray-400">
          <a href="/" className="hover:text-[#0f75bc] transition-colors">Ana Sayfa</a>
          <span>/</span>
          <span className="text-[#07446c] font-semibold">Tüm Ürünler</span>
        </div>
      </div>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Suspense fallback={<CatalogSkeleton />}>
            <CatalogClient
              products={products}
              categories={categories}
              activeCategory={kategori ?? null}
              activeFilter={filtre ?? null}
              searchQuery={q ?? null}
            />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function CatalogSkeleton() {
  return (
    <div className="flex gap-8">
      <div className="w-64 flex-shrink-0 hidden md:block">
        <div className="bg-white rounded-2xl p-5 space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
      <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-5">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
