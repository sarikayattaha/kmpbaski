/**
 * GET  /api/index-pages?limit=200&offset=0
 *   → Gönderilecek URL'lerin önizlemesini döner (Google'a istek atmaz).
 *
 * POST /api/index-pages?limit=200&offset=0
 *   → Google Indexing API'ye gerçekten bildirim gönderir.
 *   → Koruma: Authorization: Bearer <CRON_SECRET>
 *
 * Sıralama:
 *   1. Statik sayfalar (anasayfa, /ambalaj)
 *   2. Yüksek trafikli iller önce, ardından geri kalan 71 il
 *   3. Her il içinde kategoriler DB'deki creation sırasıyla (en yeni önce)
 *
 * Kota: Google Indexing API ücretsiz kotası günlük 200 URL.
 * limit=200 ile her gün bir batch gönderin; ertesi gün offset=200 ile devam edin.
 */

import { NextRequest, NextResponse } from "next/server";
import { CITIES, SITE_URL }          from "@/lib/seo";
import { getAmbalajCategories }       from "@/lib/ambalaj-data";
import { notifyGoogle }               from "@/lib/google-indexing";

// Nüfus/trafik önceliğine göre sıralanmış iller
const PRIORITY_SLUGS = [
  "istanbul", "ankara", "izmir", "bursa", "antalya",
  "gaziantep", "konya", "adana", "mersin", "kocaeli",
];

function buildOrderedUrls(categories: { slug: string }[]): string[] {
  const priorityCities = PRIORITY_SLUGS
    .map(s => CITIES.find(c => c.slug === s))
    .filter(Boolean) as typeof CITIES;

  const otherCities = CITIES.filter(c => !PRIORITY_SLUGS.includes(c.slug));
  const orderedCities = [...priorityCities, ...otherCities];

  // En yeni kategoriler önce (DB'den created_at desc ile geliyor)
  const urls: string[] = [];
  for (const city of orderedCities) {
    for (const cat of categories) {
      urls.push(`${SITE_URL}/ambalaj/${city.slug}/${cat.slug}`);
    }
  }

  // Statik sayfaları en başa ekle
  urls.unshift(`${SITE_URL}/ambalaj`, SITE_URL);
  return urls;
}

function parseIntParam(value: string | null, fallback: number): number {
  const n = parseInt(value ?? "", 10);
  return isNaN(n) || n < 0 ? fallback : n;
}

// GET: önizleme — Google'a hiçbir şey göndermez
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const limit  = parseIntParam(searchParams.get("limit"),  200);
  const offset = parseIntParam(searchParams.get("offset"), 0);

  const categories = await getAmbalajCategories();
  // En yeni önce: getAmbalajCategories created_at asc döner, biz tersine çeviririz
  categories.reverse();

  const allUrls = buildOrderedUrls(categories);
  const batch   = allUrls.slice(offset, offset + limit);

  return NextResponse.json({
    total:      allUrls.length,
    offset,
    limit,
    batchSize:  batch.length,
    hasMore:    offset + limit < allUrls.length,
    urls:       batch,
  });
}

// POST: Google'a gerçekten gönder
export async function POST(req: NextRequest) {
  const auth   = req.headers.get("authorization") ?? "";
  const secret = process.env.CRON_SECRET;

  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const limit  = parseIntParam(searchParams.get("limit"),  200);
  const offset = parseIntParam(searchParams.get("offset"), 0);

  const categories = await getAmbalajCategories();
  categories.reverse(); // en yeni önce

  const allUrls = buildOrderedUrls(categories);
  const batch   = allUrls.slice(offset, offset + limit);

  const results: { url: string; success: boolean; message: string }[] = [];

  for (const url of batch) {
    const result = await notifyGoogle(url, "URL_UPDATED");
    results.push({ url, ...result });

    if (result.success) {
      console.log(`Google Indexing: ${url} sent successfully`);
    } else {
      console.error(`Google Indexing: ${url} FAILED — ${result.message}`);
    }

    // Rate-limit önlemi (Google: maks 200 istek/sn)
    await new Promise(r => setTimeout(r, 250));
  }

  const successCount = results.filter(r => r.success).length;
  const failedCount  = batch.length - successCount;

  return NextResponse.json({
    total:      allUrls.length,
    offset,
    limit,
    batchSize:  batch.length,
    hasMore:    offset + limit < allUrls.length,
    success:    successCount,
    failed:     failedCount,
    results,
  });
}
