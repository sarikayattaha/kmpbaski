import { getSupabase } from "@/lib/supabase";

export type AmbalajCategoryData = {
  id: string;
  name: string;
  slug: string;
};

/**
 * Supabase'den ambalaj kategorilerini çeker.
 * order_index'e göre sıralı döner.
 */
export async function getAmbalajCategories(): Promise<AmbalajCategoryData[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("ambalaj_categories")
    .select("id, name, slug")
    .order("order_index", { ascending: true });
  if (error) {
    console.error("[ambalaj-data] Supabase error:", error.message);
    return [];
  }
  return data ?? [];
}
