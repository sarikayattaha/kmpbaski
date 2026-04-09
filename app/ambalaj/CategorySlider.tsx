"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import type { AmbalajProduct } from "@/lib/supabase";

export default function CategorySlider({ products }: { products: AmbalajProduct[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir === "right" ? 268 : -268, behavior: "smooth" });
  };

  return (
    <div className="relative group/slider">
      {/* Önceki ok */}
      <button
        onClick={() => scroll("left")}
        aria-label="Önceki"
        className="
          absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10
          w-9 h-9 rounded-full bg-white shadow-md border border-gray-100
          flex items-center justify-center text-[#07446c]
          transition-all duration-200
          md:opacity-0 md:group-hover/slider:opacity-100
          hover:bg-[#07446c] hover:text-white hover:border-[#07446c]
        ">
        <ChevronLeft size={18} />
      </button>

      {/* Sonraki ok */}
      <button
        onClick={() => scroll("right")}
        aria-label="Sonraki"
        className="
          absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10
          w-9 h-9 rounded-full bg-white shadow-md border border-gray-100
          flex items-center justify-center text-[#07446c]
          transition-all duration-200
          md:opacity-0 md:group-hover/slider:opacity-100
          hover:bg-[#07446c] hover:text-white hover:border-[#07446c]
        ">
        <ChevronRight size={18} />
      </button>

      {/* Slider track */}
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2"
        style={{ scrollbarWidth: "none" }}
      >
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}

function ProductCard({ product: p }: { product: AmbalajProduct }) {
  const waLink = `https://wa.me/905541630031?text=${encodeURIComponent(
    `Merhaba, "${p.name}" ürünü hakkında fiyat teklifi almak istiyorum.`
  )}`;

  return (
    <div className="
      group snap-start flex-shrink-0 w-52 md:w-60
      bg-white rounded-2xl border border-gray-100 shadow-sm
      hover:shadow-xl hover:border-[#bae6fd] hover:-translate-y-1
      transition-all duration-200 flex flex-col overflow-hidden
    ">
      {/* Görsel */}
      <div className="relative h-44 bg-gradient-to-br from-[#f0f7ff] to-[#e0f2fe] overflow-hidden">
        {p.image_url ? (
          <Image
            src={p.image_url}
            alt={p.name}
            fill
            sizes="240px"
            className="object-contain p-5 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-10">📦</div>
        )}
      </div>

      {/* Bilgi */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-[#07446c] leading-snug flex-1 group-hover:text-[#0f75bc] transition-colors">
          {p.name}
        </h3>
        {p.description && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{p.description}</p>
        )}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-1.5 w-full bg-[#25D366] hover:bg-[#1ebe57] text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
        >
          <MessageCircle size={13} /> Teklif Al
        </a>
      </div>
    </div>
  );
}
