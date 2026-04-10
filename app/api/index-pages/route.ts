/**
 * POST /api/index-pages
 *
 * Tüm şehir+ürün sayfalarını Google Indexing API'ye bildirir.
 * Deploy sonrası veya içerik güncellemesinde çağrılır.
 *
 * Koruma: CRON_SECRET header ile basit token kontrolü.
 *
 * Kullanım:
 *   curl -X POST https://kmpbaski.com/api/index-pages \
 *     -H "Authorization: Bearer <CRON_SECRET>"
 *
 * Vercel'de zamanlı tetiklemek için vercel.json'a cron eklenebilir.
 */

import { NextRequest, NextResponse } from "next/server";
import { CITIES, AMBALAJ_SEO_PRODUCTS, SITE_URL } from "@/lib/seo";
import { notifyGoogle } from "@/lib/google-indexing";

export async function POST(req: NextRequest) {
  // Basit bearer token koruması
  const auth   = req.headers.get("authorization") ?? "";
  const secret = process.env.CRON_SECRET;

  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Tüm şehir × ürün URL'lerini oluştur
  const urls: string[] = CITIES.flatMap(city =>
    AMBALAJ_SEO_PRODUCTS.map(
      product => `${SITE_URL}/ambalaj/${city.slug}/${product.slug}`
    )
  );

  // Sitemap ve ambalaj ana sayfasını da ekle
  urls.unshift(`${SITE_URL}/ambalaj`, SITE_URL);

  const results: { url: string; success: boolean; message: string }[] = [];

  for (const url of urls) {
    const result = await notifyGoogle(url, "URL_UPDATED");
    results.push({ url, ...result });
    // Rate-limit önlemi (Google: maks 200 istek/sn)
    await new Promise(r => setTimeout(r, 250));
  }

  const successCount = results.filter(r => r.success).length;

  return NextResponse.json({
    total:   urls.length,
    success: successCount,
    failed:  urls.length - successCount,
    results,
  });
}

// GET: hangi sayfaların bildirileceğini önizle
export async function GET() {
  const urls = CITIES.flatMap(city =>
    AMBALAJ_SEO_PRODUCTS.map(
      product => `${SITE_URL}/ambalaj/${city.slug}/${product.slug}`
    )
  );
  return NextResponse.json({ total: urls.length, urls });
}
