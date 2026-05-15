import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function GET() {
  const now = new Date().toISOString();

  const urls: { loc: string; lastmod: string; changefreq: string; priority: string }[] = [
    { loc: SITE_URL,                      lastmod: now, changefreq: "weekly",  priority: "1.0" },
    { loc: `${SITE_URL}/tum-urunler`,     lastmod: now, changefreq: "weekly",  priority: "0.8" },
    { loc: `${SITE_URL}/hakkimizda`,      lastmod: now, changefreq: "monthly", priority: "0.6" },
    { loc: `${SITE_URL}/iletisim`,        lastmod: now, changefreq: "monthly", priority: "0.6" },
    { loc: `${SITE_URL}/sss`,             lastmod: now, changefreq: "monthly", priority: "0.6" },
  ];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: products } = await supabase
      .from("products")
      .select("slug, category")
      .not("slug", "is", null);

    // Kategori sayfaları
    const categories = [...new Set((products ?? []).map((p: { category: string }) => p.category).filter(Boolean))];
    for (const cat of categories) {
      const slug = cat.toLowerCase()
        .replace(/ş/g, "s").replace(/ç/g, "c").replace(/ğ/g, "g")
        .replace(/ü/g, "u").replace(/ö/g, "o").replace(/ı/g, "i").replace(/İ/g, "i")
        .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      urls.push({ loc: `${SITE_URL}/kategori/${slug}`, lastmod: now, changefreq: "weekly", priority: "0.7" });
    }

    // Ürün sayfaları
    for (const prod of products ?? []) {
      if (prod.slug) {
        urls.push({
          loc: `${SITE_URL}/urun/${prod.slug}`,
          lastmod: now,
          changefreq: "monthly",
          priority: "0.7",
        });
      }
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "no-store",
    },
  });
}
