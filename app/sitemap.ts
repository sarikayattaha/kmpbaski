import type { MetadataRoute } from "next";
import { SITE_URL, CITIES, AMBALAJ_SEO_PRODUCTS } from "@/lib/seo";
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
      url: `${SITE_URL}/ambalaj`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tum-urunler`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // ── Supabase'den ambalaj kategorileri ──────────────────────────────────────
  const supabase = getSupabase();
  const categoryPages: MetadataRoute.Sitemap = [];
  const productPages: MetadataRoute.Sitemap  = [];

  if (supabase) {
    const [catRes, prodRes] = await Promise.all([
      supabase.from("ambalaj_categories").select("id, slug, updated_at"),
      supabase.from("ambalaj_products").select("category_id, created_at"),
    ]);

    for (const cat of catRes.data ?? []) {
      categoryPages.push({
        url: `${SITE_URL}/ambalaj/${cat.slug}`,
        lastModified: cat.updated_at ? new Date(cat.updated_at) : now,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }

    for (const prod of prodRes.data ?? []) {
      const cat = (catRes.data ?? []).find(c => c.id === prod.category_id);
      if (cat) {
        productPages.push({
          url: `${SITE_URL}/ambalaj/${cat.slug}`,
          lastModified: prod.created_at ? new Date(prod.created_at) : now,
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    }
  }

  // ── Şehir × Ürün sayfaları (48 adet) ──────────────────────────────────────
  const cityPages: MetadataRoute.Sitemap = CITIES.flatMap(city =>
    AMBALAJ_SEO_PRODUCTS.map(product => ({
      url: `${SITE_URL}/ambalaj/${city.slug}/${product.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  return [...staticPages, ...categoryPages, ...cityPages];
}
