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

    return NextResponse.json({
      envOk: true,
      error: error?.message ?? null,
      count: data?.length ?? 0,
      slugs: data?.map((p) => p.slug) ?? [],
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) });
  }
}
