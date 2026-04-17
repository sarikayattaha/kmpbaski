/**
 * GET  /api/index-pages?limit=200&offset=0
 *   → Gönderilecek URL'lerin önizlemesini döner (Google'a istek atmaz).
 *
 * POST /api/index-pages?limit=200&offset=0
 *   → Google Indexing API'ye gerçekten bildirim gönderir.
 *   → Koruma: Authorization: Bearer <CRON_SECRET>
 */

import { NextRequest, NextResponse } from "next/server";
import { SITE_URL }          from "@/lib/seo";
import { getSupabase }        from "@/lib/supabase";
import { notifyGoogle }       from "@/lib/google-indexing";

function parseIntParam(value: string | null, fallback: number): number {
  const n = parseInt(value ?? "", 10);
  return isNaN(n) || n < 0 ? fallback : n;
}

async function buildAllUrls(): Promise<string[]> {
  const urls: string[] = [SITE_URL, `${SITE_URL}/tum-urunler`];

  const supabase = getSupabase();
  if (supabase) {
    const { data } = await supabase
      .from("products")
      .select("slug")
      .not("slug", "is", null)
      .order("created_at", { ascending: false });

    for (const prod of data ?? []) {
      if (prod.slug) urls.push(`${SITE_URL}/urun/${prod.slug}`);
    }
  }

  return urls;
}

// GET: önizleme — Google'a hiçbir şey göndermez
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const limit  = parseIntParam(searchParams.get("limit"),  200);
  const offset = parseIntParam(searchParams.get("offset"), 0);

  const allUrls = await buildAllUrls();
  const batch   = allUrls.slice(offset, offset + limit);

  return NextResponse.json({
    total:     allUrls.length,
    offset,
    limit,
    batchSize: batch.length,
    hasMore:   offset + limit < allUrls.length,
    urls:      batch,
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

  const allUrls = await buildAllUrls();
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

    await new Promise(r => setTimeout(r, 250));
  }

  const successCount = results.filter(r => r.success).length;
  const failedCount  = batch.length - successCount;

  return NextResponse.json({
    total:     allUrls.length,
    offset,
    limit,
    batchSize: batch.length,
    hasMore:   offset + limit < allUrls.length,
    success:   successCount,
    failed:    failedCount,
    results,
  });
}
