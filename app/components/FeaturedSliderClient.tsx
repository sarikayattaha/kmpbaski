"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import type { Product } from "@/lib/supabase";

// ── Ortalama puan hesapla ─────────────────────────────────────────────────────
function avgRating(product: Product): number | null {
  const reviews = Array.isArray(product.reviews) ? product.reviews : [];
  if (reviews.length === 0) return null;
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
}

// ── Tek ürün kartı ────────────────────────────────────────────────────────────
function ProductCard({ product: p }: { product: Product }) {
  const mainImage =
    (Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null) ??
    p.image_url ?? null;

  const rating = avgRating(p);

  return (
    <Link
      href={`/urun/${p.slug}`}
      className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden
                 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 h-full"
    >
      {/* Görsel — 4:3 beyaz kutu */}
      <div className="relative aspect-[4/3] bg-white flex-shrink-0 overflow-hidden">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={p.name}
            fill
            sizes="(max-width: 640px) 70vw, (max-width: 1024px) 50vw, 25vw"
            loading="lazy"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-200">
            <ImageOff size={36} />
          </div>
        )}
        {/* Kategori badge */}
        {p.category && (
          <span className="absolute top-2.5 left-2.5 bg-[#0f75bc] text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10 leading-none">
            {p.category}
          </span>
        )}
      </div>

      {/* Bilgi */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-[#07446c] text-sm leading-snug group-hover:text-[#0f75bc] transition-colors line-clamp-2">
          {p.name}
        </h3>

        {/* Yıldız puanı — sadece reviews varsa */}
        {rating !== null && (
          <div className="flex items-center gap-1 mt-1.5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(s => (
                <svg key={s} width="11" height="11" viewBox="0 0 24 24" fill={s <= Math.round(rating) ? "#fbbf24" : "#e5e7eb"}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <span className="text-[11px] text-gray-400">({(Array.isArray(p.reviews) ? p.reviews : []).length})</span>
          </div>
        )}

        {/* Fiyat */}
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

// ── Ana slider bileşeni ───────────────────────────────────────────────────────
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

        {/* Başlık + navigasyon */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-[#07446c]">Öne Çıkan Ürünler</h2>
          <div className="flex items-center gap-3">
            {/* Oklar — desktop */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => scroll("left")}
                aria-label="Önceki"
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-[#0f75bc] hover:text-[#0f75bc] transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scroll("right")}
                aria-label="Sonraki"
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-[#0f75bc] hover:text-[#0f75bc] transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <Link
              href="/tum-urunler"
              className="flex items-center gap-1 text-sm font-semibold text-[#0f75bc] hover:text-[#07446c] transition-colors"
            >
              Tümünü Gör <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/*
          Slider track:
          - Mobil:   w-[72%]  → 1.4 kart görünür, kaydırılabilir olduğu belli
          - Tablet:  sm:w-[calc(50%-8px)]  → 2 kart
          - Desktop: lg:w-[calc(25%-12px)] → 4 kart
        */}
        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 -mx-4 px-4"
        >
          {products.map(p => (
            <div
              key={p.id}
              className="snap-start flex-shrink-0 w-[72%] sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]"
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
