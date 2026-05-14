import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kmpbaski.com";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const now = new Date().toISOString();

  const urls: { loc: string; lastmod: string; changefreq: string; priority: string }[] = [
    { loc: SITE_URL,                  lastmod: now, changefreq: "weekly",  priority: "1.0" },
    { loc: `${SITE_URL}/tum-urunler`, lastmod: now, changefreq: "weekly",  priority: "0.8" },
  ];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data } = await supabase
      .from("products")
      .select("slug, updated_at")
      .not("slug", "is", null);

    for (const prod of data ?? []) {
      if (prod.slug) {
        urls.push({
          loc: `${SITE_URL}/urun/${prod.slug}`,
          lastmod: prod.updated_at ? new Date(prod.updated_at).toISOString() : now,
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
