"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import type { Product } from "@/lib/supabase";

// ── Puan hesapla — ReviewsSection ile aynı fallback mantığı ─────────────────
// Ürünün gerçek yorumu varsa onu kullan; yoksa slug'a göre deterministik
// statik havuzdan üret (ürün sayfasıyla tutarlı).
const STATIC_RATINGS = [5,4.5,5,4,5,5,4.5,5,4.5,5,4,5,5,4.5,5,4,5,5,4.5,5,4.5,5,4,5,5,4.5,5,5,4.5,5];

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const out = [...arr];
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function getCardRating(p: Product): { avg: number; count: number } {
  const reviews = Array.isArray(p.reviews) ? p.reviews : [];
  if (reviews.length > 0) {
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    return { avg: Math.round(avg * 10) / 10, count: reviews.length };
  }
  // Statik fallback
  const seed = (p.slug ?? p.name ?? "").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const count = 4 + (seed % 3);
  const picked = seededShuffle(STATIC_RATINGS, seed).slice(0, count);
  const avg = picked.reduce((s, r) => s + r, 0) / count;
  return { avg: Math.round(avg * 10) / 10, count };
}

// ── Ürün kartı ────────────────────────────────────────────────────────────────
function ProductCard({ product: p }: { product: Product }) {
  const mainImage =
    (Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null) ??
    p.image_url ?? null;
  const { avg: rating, count: reviewCount } = getCardRating(p);

  return (
    <Link
      href={`/urun/${p.slug}`}
      className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden
                 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 h-full"
    >
      {/* Görsel — 4:3 beyaz kutu */}
      <div className="relative aspect-[4/3] bg-white overflow-hidden flex-shrink-0">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={p.name}
            fill
            sizes="(max-width: 640px) 66vw, (max-width: 1024px) 50vw, 25vw"
            loading="lazy"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-200">
            <ImageOff size={36} />
          </div>
        )}
        {p.category && (
          <span className="absolute top-2.5 left-2.5 bg-[#0f75bc] text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10 leading-none">
            {p.category}
          </span>
        )}
      </div>

      {/* Bilgi */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-[#07446c] text-sm leading-snug group-hover:text-[#0f75bc] transition-colors">
          {p.name}
        </h3>

        <div className="flex items-center gap-1 mt-1.5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(s => (
                <svg key={s} width="11" height="11" viewBox="0 0 24 24"
                  fill={s <= Math.round(rating) ? "#fbbf24" : "#e5e7eb"}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-[11px] text-gray-400">({reviewCount})</span>
          </div>

        <div className="mt-auto pt-3">
          {p.is_price_on_request ? (
            <p className="text-sm font-black text-orange-500">Fiyat Alınız</p>
          ) : p.price ? (
            <p className="text-base font-black text-[#07446c]">
              {p.price}
              <span className="text-[10px] font-normal text-gray-400 ml-1">+KDV</span>
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

// ── Ok butonu ─────────────────────────────────────────────────────────────────
function ArrowBtn({
  dir,
  onClick,
}: {
  dir: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === "left" ? "Önceki" : "Sonraki"}
      className={`
        absolute top-1/2 -translate-y-1/2 z-20
        ${dir === "left" ? "-left-5" : "-right-5"}
        hidden md:flex
        w-10 h-10 items-center justify-center
        rounded-full bg-white shadow-lg border border-gray-200
        text-[#07446c] hover:bg-[#07446c] hover:text-white hover:border-[#07446c]
        transition-all duration-200
      `}
    >
      {dir === "left" ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
    </button>
  );
}

// ── Ana bileşen ───────────────────────────────────────────────────────────────
export default function FeaturedSliderClient({ products }: { products: Product[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({
      left: dir === "right"
        ? trackRef.current.clientWidth * 0.8
        : -trackRef.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-white py-12 border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-4">

        {/* Başlık */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-[#07446c]">Öne Çıkan Ürünler</h2>
          <Link
            href="/tum-urunler"
            className="flex items-center gap-1 text-sm font-semibold text-[#0f75bc] hover:text-[#07446c] transition-colors"
          >
            Tümünü Gör <ChevronRight size={16} />
          </Link>
        </div>

        {/*
          Slider wrapper: oklar position:absolute ile bu div'e göre konumlanır.
          px-6 md:px-8 → ok butonlarına alan açar.
        */}
        <div className="relative px-0 md:px-6">

          <ArrowBtn dir="left"  onClick={() => scroll("left")}  />
          <ArrowBtn dir="right" onClick={() => scroll("right")} />

          {/*
            Track:
            Mobil  → w-[66%]            (1.5 kart görünür)
            Tablet → sm:w-[calc(50%-8px)]  (2 kart)
            Desktop→ lg:w-[calc(25%-12px)] (4 kart)
          */}
          <div
            ref={trackRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2"
          >
            {products.map(p => (
              <div
                key={p.id}
                className="snap-start flex-shrink-0 w-[66%] sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]"
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
