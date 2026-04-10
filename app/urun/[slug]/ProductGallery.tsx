"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive]   = useState(0);
  const [zoomed, setZoomed]   = useState(false);
  const [origin, setOrigin]   = useState("50% 50%");

  /* ── Mouse koordinatlarını container'a göre yüzde cinsinden hesapla ── */
  const calcOrigin = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left)  / r.width  * 100).toFixed(1);
    const y = ((e.clientY - r.top)   / r.height * 100).toFixed(1);
    return `${x}% ${y}%`;
  };

  const handleEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setOrigin(calcOrigin(e));
    setZoomed(true);
  };
  const handleMove  = (e: React.MouseEvent<HTMLDivElement>) => setOrigin(calcOrigin(e));
  const handleLeave = () => { setZoomed(false); setOrigin("50% 50%"); };

  /* Thumbnail değişince zoom sıfırla */
  const changeActive = (i: number) => { setActive(i); setZoomed(false); setOrigin("50% 50%"); };

  /* ── Placeholder ──────────────────────────────────────────────────────── */
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
        className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white border border-gray-100 select-none"
        style={{ cursor: zoomed ? "zoom-out" : "zoom-in" }}
        onMouseEnter={handleEnter}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        {/*
          Zoom katmanı: transition sadece transform'u etkiler.
          transformOrigin anında (geçişsiz) güncellenir — böylece zoom
          noktası mouse'u takip eder; ölçek değişimi ise yumuşak geçer.
        */}
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
      </div>

      {/* ── Thumbnail'ler ─────────────────────────────────────────────────── */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => changeActive(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
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
      )}

    </div>
  );
}
