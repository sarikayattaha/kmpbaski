"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Banner } from "@/lib/supabase";

export default function HeroBannerSlider({
  banners,
  overlay = false,
  className = "",
}: {
  banners: Banner[];
  overlay?: boolean;
  className?: string;
}) {
  const [current, setCurrent] = useState(0);
  const hoveredRef = useRef(false);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % banners.length),
    [banners.length]
  );
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + banners.length) % banners.length),
    [banners.length]
  );

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      if (!hoveredRef.current) next();
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length, next]);

  const b = banners[current];
  const link = b?.button_link && b.button_link !== "#" ? b.button_link : null;
  const btnX = b?.button_x ?? 85;
  const btnY = b?.button_y ?? 80;

  return (
    <section
      className={`relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: "1920 / 520", minHeight: 160 }}
      onMouseEnter={() => { hoveredRef.current = true; }}
      onMouseLeave={() => { hoveredRef.current = false; }}
    >
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{
          width: `${banners.length * 100}%`,
          transform: `translateX(-${(current / banners.length) * 100}%)`,
        }}
      >
        {banners.map((ban, i) => (
          <div
            key={ban.id}
            className="relative h-full flex-shrink-0"
            style={{ width: `${100 / banners.length}%` }}
          >
            {ban.image_url && (
              <Image
                src={ban.image_url}
                alt={ban.title || "Banner"}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            )}
            {overlay && (
              <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>

      {link && (
        <Link
          href={link}
          className="absolute inset-0 z-[5]"
          aria-label={b?.button_text || "Banner linkine git"}
        />
      )}

      {b?.button_text && (
        <div
          className="absolute z-10"
          style={{ left: `${btnX}%`, top: `${btnY}%`, transform: "translate(-50%, -50%)" }}
        >
          <Link
            href={link || "#"}
            className="inline-block bg-[#0f75bc] hover:bg-[#07446c] active:scale-95 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-lg shadow-black/25 whitespace-nowrap"
          >
            {b.button_text}
          </Link>
        </div>
      )}

      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Önceki banner"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center text-[#07446c] shadow-lg transition-all duration-300 hover:bg-white hover:scale-110 opacity-0 hover:opacity-100 focus:opacity-100"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
          <button
            onClick={next}
            aria-label="Sonraki banner"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center text-[#07446c] shadow-lg transition-all duration-300 hover:bg-white hover:scale-110 opacity-0 hover:opacity-100 focus:opacity-100"
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Banner ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === current ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
