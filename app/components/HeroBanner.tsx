"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase, type Banner } from "@/lib/supabase";

type CTAPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";

interface HeroBannerProps {
  /** Supabase'den banner bulunamazsa gösterilecek yedek görsel URL'i */
  fallbackSrc?: string;
  ctaPosition?: CTAPosition;
  overlay?: boolean;
  className?: string;
}

const CTA_POSITIONS: Record<CTAPosition, string> = {
  "top-left":     "top-6 left-6 md:top-10 md:left-10",
  "top-right":    "top-6 right-6 md:top-10 md:right-10",
  "bottom-left":  "bottom-6 left-6 md:bottom-10 md:left-10",
  "bottom-right": "bottom-6 right-6 md:bottom-10 md:right-10",
  center:         "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
};

export default function HeroBanner({
  fallbackSrc,
  ctaPosition = "bottom-right",
  overlay = true,
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
        className={`relative w-full overflow-hidden h-[280px] sm:h-[380px] md:h-[520px] bg-slate-100 animate-pulse ${className}`}
      />
    );
  }

  if (!src) return null;

  return (
    <section
      className={`relative w-full overflow-hidden h-[280px] sm:h-[380px] md:h-[520px] ${className}`}
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

      {banner?.button_text && (
        <div className={`absolute z-10 ${CTA_POSITIONS[ctaPosition]}`}>
          <Link
            href={banner.button_link || "#"}
            className="inline-block bg-[#0f75bc] hover:bg-[#07446c] active:scale-95 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-lg shadow-black/25 whitespace-nowrap"
          >
            {banner.button_text}
          </Link>
        </div>
      )}
    </section>
  );
}
