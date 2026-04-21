"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ImageOff, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive]   = useState(0);
  const [zoomed, setZoomed]   = useState(false);
  const [origin, setOrigin]   = useState("50% 50%");
  const thumbRef              = useRef<HTMLDivElement>(null);
  const touchStartX           = useRef<number | null>(null);

  const calcOrigin = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left)  / r.width  * 100).toFixed(1);
    const y = ((e.clientY - r.top)   / r.height * 100).toFixed(1);
    return `${x}% ${y}%`;
  };

  const handleEnter = (e: React.MouseEvent<HTMLDivElement>) => { setOrigin(calcOrigin(e)); setZoomed(true); };
  const handleMove  = (e: React.MouseEvent<HTMLDivElement>) => setOrigin(calcOrigin(e));
  const handleLeave = () => { setZoomed(false); setOrigin("50% 50%"); };

  const changeActive = (i: number) => { setActive(i); setZoomed(false); setOrigin("50% 50%"); };

  const prev = () => changeActive((active - 1 + images.length) % images.length);
  const next = () => changeActive((active + 1) % images.length);

  const scrollThumbs = (dir: "left" | "right") => {
    if (!thumbRef.current) return;
    thumbRef.current.scrollBy({ left: dir === "left" ? -120 : 120, behavior: "smooth" });
  };

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    touchStartX.current = null;
  };

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] rounded-3xl bg-white border border-gray-100 flex flex-col items-center justify-center gap-3 text-gray-200">
        <ImageOff size={48} />
        <span className="text-xs font-medium text-gray-300">Görsel Hazırlanıyor</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">

      {/* ── Ana görsel ────────────────────────────────────────────────────── */}
      <div
        className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white border border-gray-100 select-none group"
        style={{ cursor: zoomed ? "zoom-out" : "zoom-in" }}
        onMouseEnter={handleEnter}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="absolute inset-0"
          style={{
            transform:       zoomed ? "scale(1.75)" : "scale(1)",
            transformOrigin: origin,
            transition:      "transform 0.35s ease",
            willChange:      "transform",
          }}
        >
          <Image
            src={images[active]}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            fetchPriority="high"
            loading="eager"
            draggable={false}
            className="object-contain p-6 pointer-events-none"
          />
        </div>

        {/* Prev / Next overlay butonları */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10
                         bg-white/70 hover:bg-white text-[#0f75bc]
                         rounded-full p-1.5 shadow
                         opacity-0 group-hover:opacity-100
                         transition-opacity duration-200
                         cursor-pointer"
              aria-label="Önceki görsel"
            >
              <ChevronLeft size={22} strokeWidth={2.5} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10
                         bg-white/70 hover:bg-white text-[#0f75bc]
                         rounded-full p-1.5 shadow
                         opacity-0 group-hover:opacity-100
                         transition-opacity duration-200
                         cursor-pointer"
              aria-label="Sonraki görsel"
            >
              <ChevronRight size={22} strokeWidth={2.5} />
            </button>
          </>
        )}
      </div>

      {/* ── Thumbnail sırası ──────────────────────────────────────────────── */}
      {images.length > 1 && (
        <div className="relative flex items-center gap-1">

          {/* Sol ok */}
          <button
            onClick={() => scrollThumbs("left")}
            className="flex-shrink-0 bg-white border border-gray-100 hover:border-[#0f75bc]
                       text-[#0f75bc] rounded-full p-1 shadow-sm transition-colors cursor-pointer"
            aria-label="Küçük resimleri sola kaydır"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>

          <div ref={thumbRef} className="flex gap-2 overflow-x-auto scrollbar-none flex-1">
            {images.map((url, i) => (
              <button
                key={i}
                onClick={() => changeActive(i)}
                className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  active === i
                    ? "border-[#0f75bc] shadow-sm"
                    : "border-gray-100 hover:border-[#25aae1]"
                }`}
              >
                <div className="relative w-full h-full bg-white">
                  <Image
                    src={url}
                    alt={`${name} ${i + 1}`}
                    fill
                    sizes="64px"
                    loading="lazy"
                    className="object-contain p-1"
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Sağ ok */}
          <button
            onClick={() => scrollThumbs("right")}
            className="flex-shrink-0 bg-white border border-gray-100 hover:border-[#0f75bc]
                       text-[#0f75bc] rounded-full p-1 shadow-sm transition-colors cursor-pointer"
            aria-label="Küçük resimleri sağa kaydır"
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>

        </div>
      )}

    </div>
  );
}
