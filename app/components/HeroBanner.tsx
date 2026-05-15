import { getSupabase, type Banner } from "@/lib/supabase";
import HeroBannerSlider from "./HeroBannerSlider";

export default async function HeroBanner({
  overlay = false,
  className = "",
}: {
  fallbackSrc?: string;
  overlay?: boolean;
  className?: string;
}) {
  const supabase = getSupabase();
  let banners: Banner[] = [];
  if (supabase) {
    const { data } = await supabase
      .from("banners")
      .select("*")
      .order("order_index", { ascending: true });
    banners = (data as Banner[]) ?? [];
  }
  if (banners.length === 0) return null;
  return <HeroBannerSlider banners={banners} overlay={overlay} className={className} />;
}
