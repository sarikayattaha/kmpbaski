"use client";

import { useEffect } from "react";

/**
 * Supabase şifre sıfırlama/magic-link e-postaları Site URL'e (kmpbaski.com kökü)
 * yönlendiriyor. Bu bileşen, URL hash'inde Supabase auth token'ı veya hata
 * kodu görürse kullanıcıyı işleyebileceği asıl sayfaya (/admin/reset-password)
 * taşır. Diğer tüm sayfalarda hash boş olduğu için no-op'tur.
 */
export default function AuthRecoveryRedirect() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    if (window.location.pathname === "/admin/reset-password") return;

    if (hash.includes("type=recovery") || hash.includes("error=") || hash.includes("error_code=")) {
      window.location.replace(`/admin/reset-password${hash}`);
    }
  }, []);

  return null;
}
