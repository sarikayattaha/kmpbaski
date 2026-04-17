import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getSupabase } from "@/lib/supabase";

export const revalidate = 86400; // 24 saatte bir yenile

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // ── Statik sayfalar ────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/tum-urunler`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // ── Ürün sayfaları ─────────────────────────────────────────────────────────
  const supabase = getSupabase();
  const productPages: MetadataRoute.Sitemap = [];

  if (supabase) {
    const { data } = await supabase
      .from("products")
      .select("slug, updated_at")
      .not("slug", "is", null);

    for (const prod of data ?? []) {
      if (prod.slug) {
        productPages.push({
          url: `${SITE_URL}/urun/${prod.slug}`,
          lastModified: prod.updated_at ? new Date(prod.updated_at) : now,
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    }
  }

  return [...staticPages, ...productPages];
}
