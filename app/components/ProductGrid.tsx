"use client";

import { Star, ChevronRight } from "lucide-react";

const products = [
  {
    name: "Selofanlı Kartvizit",
    qty: "1000 adet",
    price: "420,00 TL",
    rating: 4.5,
    reviewCount: 1847,
    badge: "Çok Satan",
    gradient: "from-[#dbeafe] to-[#bfdbfe]",
  },
  {
    name: "3'lü Katlama Broşür",
    qty: "1000 adet",
    price: "890,00 TL",
    rating: 4.3,
    reviewCount: 632,
    badge: null,
    gradient: "from-[#e0f2fe] to-[#bae6fd]",
  },
  {
    name: "Roll-Up Banner",
    qty: "1 adet",
    price: "349,00 TL",
    rating: 4.7,
    reviewCount: 415,
    badge: "Popüler",
    gradient: "from-[#ede9fe] to-[#ddd6fe]",
  },
  {
    name: "Kraft Kese",
    qty: "500 adet",
    price: "1.250,00 TL",
    rating: 4.4,
    reviewCount: 228,
    badge: null,
    gradient: "from-[#fef9c3] to-[#fde68a]",
  },
];

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1 mt-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={12}
            className={s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
          />
        ))}
      </div>
      <span className="text-[11px] text-gray-400">({count})</span>
    </div>
  );
}

export default function ProductGrid() {
  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Başlık */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-[#07446c]">Öne Çıkan Ürünler</h2>
          <a
            href="#"
            className="flex items-center gap-1 text-sm font-semibold text-[#0f75bc] hover:text-[#07446c] transition-colors"
          >
            Tümünü Gör <ChevronRight size={16} />
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p, i) => (
            <a
              key={i}
              href="#"
              className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
            >
              {/* Görsel alanı */}
              <div className={`relative bg-gradient-to-br ${p.gradient} h-48 flex items-center justify-center overflow-hidden`}>
                {p.badge && (
                  <span className="absolute top-3 left-3 bg-[#0f75bc] text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                    {p.badge}
                  </span>
                )}
                {/* Placeholder ürün görseli */}
                <div className="w-28 h-28 bg-white/50 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                  <span className="text-4xl opacity-30">🖨️</span>
                </div>
              </div>

              {/* Bilgi */}
              <div className="p-4 flex flex-col flex-1">
                <p className="text-xs text-gray-400 mb-0.5">{p.qty}</p>
                <h3 className="font-bold text-[#07446c] text-sm leading-snug group-hover:text-[#0f75bc] transition-colors">
                  {p.name}
                </h3>
                <StarRating rating={p.rating} count={p.reviewCount} />
                <div className="mt-auto pt-3 flex items-end justify-between">
                  <div>
                    <span className="text-lg font-black text-[#07446c]">{p.price}</span>
                    <span className="text-[10px] text-gray-400 ml-1">+KDV</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
