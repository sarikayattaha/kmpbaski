"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Product = {
  name: string;
  price?: string | null;
  is_price_on_request?: boolean;
  features?: string | null;
};

export default function TeklifButton({ product }: { product: Product }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{
    full_name: string;
    phone: string;
    address: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const { data: listener } = supabase.auth.onAuthStateChange(async (_e, session) => {
      if (cancelled) return;
      if (!session) {
        setProfile(null);
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone, address")
        .eq("id", session.user.id)
        .single();
      if (!cancelled) {
        setProfile(data ?? null);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, []);

  const buildMessage = () => {
    const name    = profile?.full_name?.trim() || "Misafir Musteri";
    const phone   = profile?.phone?.trim()     || "-";
    const address = profile?.address?.trim()   || "-";

    const featureLines = (product.features ?? "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const featuresText = featureLines.length > 0
      ? featureLines.map((f) => `- ${f}`).join("\n")
      : "- Belirtilmedi";

    const priceText = product.is_price_on_request
      ? "Fiyat alabilir miyim?"
      : (product.price ? product.price + " +KDV" : "Fiyat alabilir miyim?");

    return [
      "MUSTERI BILGILERI",
      `Ad Soyad: ${name}`,
      `Telefon: ${phone}`,
      `Adres: ${address}`,
      "",
      "URUN BILGILERI",
      `Urun: ${product.name}`,
      "Ozellikler:",
      featuresText,
      `Fiyat: ${priceText}`,
      "",
      "Bu mesaj kmpbaski.com uzerinden otomatik olusturulmustur.",
    ].join("\n");
  };

  const handleClick = () => {
    const msg = buildMessage();
    window.open(`https://wa.me/905541630031?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <button disabled
        className="w-full flex items-center justify-center gap-2.5 bg-[#25d366] text-white font-black px-6 py-4 rounded-2xl text-sm opacity-70 cursor-not-allowed">
        <Loader2 size={18} className="animate-spin" />
        Yükleniyor…
      </button>
    );
  }

  return (
    <button onClick={handleClick}
      className="w-full flex items-center justify-center gap-2.5 bg-[#25d366] hover:bg-[#1da851] active:bg-[#179443] text-white font-black px-6 py-4 rounded-2xl transition-colors shadow-lg shadow-green-400/20 text-sm">
      <MessageCircle size={18} />
      Fiyat Teklifi Al
    </button>
  );
}
