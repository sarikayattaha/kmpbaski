import { getSupabase } from "@/lib/supabase";

export type AmbalajCategoryData = {
  id: string;
  name: string;
  slug: string;
};

/**
 * 81 il SEO sayfası oluşturmak için kaynak ürün listesini döner.
 *
 * Kaynak: ana `products` tablosu, category = "Ambalaj" filtresi.
 *
 * Admin → Ürün Yönetimi'nden kategori "Ambalaj" seçilerek eklenen her ürün
 * otomatik olarak 81 şehirde SEO sayfası kazanır; başka bir işlem gerekmez.
 */
export async function getAmbalajCategories(): Promise<AmbalajCategoryData[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug")
    .ilike("category", "ambalaj")
    .not("slug", "is", null)
    .order("created_at", { ascending: true });
  if (error) {
    console.error("[ambalaj-data] Supabase error:", error.message);
    return [];
  }
  return (data ?? []).filter(p => p.slug);
}
