import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json({ error: "Env eksik", url: !!url, key: !!key });
  }

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("products")
      .select("slug")
      .not("slug", "is", null);

    if (error) {
      return NextResponse.json({ error: error.message });
    }

    const SITE = "https://kmpbaski.com";
    const now  = new Date().toISOString();

    const rows = [
      { loc: SITE,                  lastmod: now, freq: "weekly",  pri: "1.0" },
      { loc: `${SITE}/tum-urunler`, lastmod: now, freq: "weekly",  pri: "0.8" },
      ...(data ?? [])
        .filter((p) => p.slug)
        .map((p) => ({
          loc:     `${SITE}/urun/${p.slug}`,
          lastmod: now,
          freq:    "monthly",
          pri:     "0.7",
        })),
    ];

    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      rows.map((r) =>
        `  <url>\n    <loc>${r.loc}</loc>\n    <lastmod>${r.lastmod}</lastmod>\n    <changefreq>${r.freq}</changefreq>\n    <priority>${r.pri}</priority>\n  </url>`
      ).join("\n") +
      `\n</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) });
  }
}
