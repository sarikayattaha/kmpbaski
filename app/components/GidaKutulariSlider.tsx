import { getSupabase, type Product } from "@/lib/supabase";
import FeaturedSliderClient from "./FeaturedSliderClient";

async function fetchGidaKutulari(): Promise<Product[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_gida_kutusu", true)
    .order("created_at", { ascending: false });
  return (data as Product[]) ?? [];
}

export default async function GidaKutulariSlider() {
  const products = await fetchGidaKutulari();
  if (products.length === 0) return null;
  return (
    <FeaturedSliderClient
      products={products}
      title="Gıda Kutuları"
      viewAllHref="/tum-urunler?kategori=G%C4%B1da+Kutular%C4%B1"
    />
  );
}
