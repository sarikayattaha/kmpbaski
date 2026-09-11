export const dynamic = "force-dynamic";

import { getSupabase, type Banner } from "@/lib/supabase";
import AdminGuard from "@/app/admin/_components/AdminGuard";
import BannerYonetimiClient from "./BannerYonetimiClient";

export default async function BannerYonetimiPage() {
  const supabase = getSupabase();
  let banners: Banner[] = [];

  if (supabase) {
    const { data } = await supabase.from("banners").select("*").order("order_index", { ascending: true });
    banners = (data as Banner[]) ?? [];
  }

  return (
    <AdminGuard>
      <BannerYonetimiClient initialBanners={banners} />
    </AdminGuard>
  );
}
