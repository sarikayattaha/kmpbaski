import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code  = searchParams.get("code");
  const next  = searchParams.get("next") ?? "/";
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Hata durumu
  if (error) {
    const msg = errorDescription ?? error;
    return NextResponse.redirect(
      `${origin}/auth/error?message=${encodeURIComponent(msg)}`
    );
  }

  if (code) {
    const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(url, key);

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      // Başarılı onay → /auth/success sayfasına yönlendir
      return NextResponse.redirect(`${origin}/auth/success?next=${encodeURIComponent(next)}`);
    }

    return NextResponse.redirect(
      `${origin}/auth/error?message=${encodeURIComponent(exchangeError.message)}`
    );
  }

  return NextResponse.redirect(`${origin}/login`);
}
