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
 * 81 il SEO sayfası oluşturmak için kategori listesini döner.
 *
 * Kaynak: `ambalaj_categories` tablosu (Admin → Ambalaj Yönetimi).
 * Her kategori otomatik olarak 81 şehirde SEO sayfası (/ambalaj/{şehir}/{slug}) kazanır.
 */
export async function getAmbalajCategories(): Promise<AmbalajCategoryData[]> {
  const supabase = getSupabase();
  if (!supabase) {
    console.warn("[ambalaj-data] Supabase bağlantısı kurulamadı (env eksik?).");
    return [];
  }
  const { data, error } = await supabase
    .from("ambalaj_categories")
    .select("id, name, slug")
    .not("slug", "is", null)
    .order("created_at", { ascending: true });
  if (error) {
    console.error("[ambalaj-data] ambalaj_categories sorgu hatası:", error.message);
    return [];
  }
  const rows = (data ?? []).filter(p => p.slug);
  console.log(`[ambalaj-data] ${rows.length} kategori yüklendi.`);
  return rows;
}
