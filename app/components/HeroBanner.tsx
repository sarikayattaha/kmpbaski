"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase, type Banner } from "@/lib/supabase";

interface HeroBannerProps {
  fallbackSrc?: string;
  overlay?: boolean;
  className?: string;
}

export default function HeroBanner({
  fallbackSrc,
  overlay = false,
  className = "",
}: HeroBannerProps) {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("banners")
      .select("*")
      .order("order_index", { ascending: true })
      .limit(1)
      .then(({ data }: { data: Banner[] | null }) => {
        if (data && data.length > 0) setBanner(data[0]);
        setLoading(false);
      });
  }, []);

  const src = banner?.image_url || fallbackSrc;

  if (loading) {
    return (
      <div
        className={`relative w-full overflow-hidden bg-slate-100 animate-pulse ${className}`}
        style={{ aspectRatio: "1920 / 520", minHeight: 160 }}
      />
    );
  }

  if (!src) return null;

  const btnX = banner?.button_x ?? 85;
  const btnY = banner?.button_y ?? 80;
  const link = banner?.button_link && banner.button_link !== "#"
    ? banner.button_link
    : null;

  return (
    <section
      className={`relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: "1920 / 520", minHeight: 160 }}
    >
      <Image
        src={src}
        alt={banner?.title ?? "Hero Banner"}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {overlay && (
        <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
      )}

      {/* Tüm bannera tıklanabilir şeffaf overlay — butonun arkasında (z-5) */}
      {link && (
        <Link
          href={link}
          className="absolute inset-0 z-[5]"
          aria-label={banner?.button_text || "Banner linkine git"}
        />
      )}

      {/* İsteğe bağlı buton — overlay'in üstünde (z-10) */}
      {banner?.button_text && (
        <div
          className="absolute z-10"
          style={{
            left: `${btnX}%`,
            top: `${btnY}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <Link
            href={link || "#"}
            className="inline-block bg-[#0f75bc] hover:bg-[#07446c] active:scale-95 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-lg shadow-black/25 whitespace-nowrap"
          >
            {banner.button_text}
          </Link>
        </div>
      )}
    </section>
  );
}
