import { getSupabase } from "@/lib/supabase";

export type AmbalajCategoryData = {
  id: string;
  name: string;
  slug: string;
};

export type AmbalajProductImages = {
  image_url: string | null;
  images: string[] | null;
};

/**
 * Belirli bir ürünün görsellerini slug üzerinden çeker.
 * City+product page'de paralel fetch edilir.
 */
export async function getAmbalajProductImages(
  slug: string
): Promise<AmbalajProductImages | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("products")
    .select("image_url, images")
    .eq("slug", slug)
    .ilike("category", "ambalaj")
    .maybeSingle();
  if (error || !data) return null;
  return data;
}

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
