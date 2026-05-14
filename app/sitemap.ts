import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL,                       lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE_URL}/tum-urunler`,      lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
  ];

  const productPages: MetadataRoute.Sitemap = [];

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && key) {
    try {
      const supabase = createClient(url, key);
      const { data, error } = await supabase
        .from("products")
        .select("slug, updated_at")
        .not("slug", "is", null);

      if (error) {
        console.error("[sitemap] Supabase hatası:", error.message);
      }

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
    } catch (err) {
      console.error("[sitemap] Beklenmeyen hata:", err);
    }
  } else {
    console.warn("[sitemap] Supabase env değişkenleri eksik. URL:", !!url, "KEY:", !!key);
  }

  return [...staticPages, ...productPages];
}
