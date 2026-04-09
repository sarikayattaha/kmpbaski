export const dynamic = "force-dynamic";

import { getSupabase, type AmbalajCategory, type AmbalajProduct } from "@/lib/supabase";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import AmbalajClient from "./AmbalajClient";

export default async function AmbalajPage() {
  const supabase = getSupabase();

  let categories: AmbalajCategory[] = [];
  let products: AmbalajProduct[]    = [];

  if (supabase) {
    const [catRes, prodRes] = await Promise.all([
      supabase.from("ambalaj_categories").select("*").order("order_index", { ascending: true }),
      supabase.from("ambalaj_products").select("*").order("created_at", { ascending: false }),
    ]);
    categories = (catRes.data as AmbalajCategory[]) ?? [];
    products   = (prodRes.data as AmbalajProduct[]) ?? [];
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-gray-400">
          <a href="/" className="hover:text-[#0f75bc] transition-colors">Ana Sayfa</a>
          <span>/</span>
          <span className="text-[#07446c] font-semibold">Ambalaj Ürünleri</span>
        </div>
      </div>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <AmbalajClient categories={categories} products={products} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
