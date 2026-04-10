import { getSupabase, type Product } from "@/lib/supabase";
import FeaturedSliderClient from "./FeaturedSliderClient";

async function fetchFeatured(): Promise<Product[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false });
  return (data as Product[]) ?? [];
}

/**
 * Server Component — Supabase'den is_featured=true ürünleri çeker.
 * Hiç ürün yoksa null döner → ana sayfada bölüm tamamen gizlenir.
 */
export default async function FeaturedSlider() {
  const products = await fetchFeatured();
  if (products.length === 0) return null;
  return <FeaturedSliderClient products={products} />;
}
