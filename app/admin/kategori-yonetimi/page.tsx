export const dynamic = "force-dynamic";

import { getSupabase, type Category } from "@/lib/supabase";
import AdminGuard from "@/app/admin/_components/AdminGuard";
import KategoriYonetimiClient from "./KategoriYonetimiClient";

export default async function KategoriYonetimiPage() {
  const supabase = getSupabase();
  let categories: Category[] = [];

  if (supabase) {
    const { data } = await supabase.from("categories").select("*").order("navbar_order", { ascending: true });
    categories = (data as Category[]) ?? [];
  }

  return (
    <AdminGuard>
      <KategoriYonetimiClient initialCategories={categories} />
    </AdminGuard>
  );
}
