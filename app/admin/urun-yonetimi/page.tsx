export const dynamic = "force-dynamic";

import { getSupabase, type Product, type Category } from "@/lib/supabase";
import AdminGuard from "@/app/admin/_components/AdminGuard";
import UrunYonetimiClient from "./UrunYonetimiClient";

export default async function UrunYonetimiPage() {
  const supabase = getSupabase();
  let products: Product[] = [];
  let categories: Category[] = [];

  if (supabase) {
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from("products").select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("navbar_order", { ascending: true }),
    ]);
    products = (p as Product[]) ?? [];
    categories = (c as Category[]) ?? [];
  }

  return (
    <AdminGuard>
      <UrunYonetimiClient initialProducts={products} initialCategories={categories} />
    </AdminGuard>
  );
}
