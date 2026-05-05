"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";

// ── Tipler ──────────────────────────────────────────────────────────────────
export type NavProduct  = { name: string; slug: string; image_url: string };
export type NavCategory = { name: string; products: NavProduct[] };

interface MegaMenuProps {
  menuData:        NavCategory[];
  menuLoading:     boolean;
  activeCategory:  number;
  onCategoryHover: (idx: number) => void;
  onMouseEnter:    () => void;
}

// ── Bileşen ──────────────────────────────────────────────────────────────────
export default function MegaMenu({
  menuData,
  menuLoading,
  activeCategory,
  onCategoryHover,
  onMouseEnter,
}: MegaMenuProps) {
  const activeCat = menuData[activeCategory];

  return (
    <div
      className="absolute top-full left-0 right-0 bg-white border-t border-b border-gray-200 shadow-xl"
      style={{ zIndex: 9999 }}
      onMouseEnter={onMouseEnter}
    >
      <div className="max-w-7xl mx-auto flex" style={{ minHeight: 300 }}>

        {/* ── SOL: Kategori listesi ─────────────────────────────────────────── */}
        <aside className="w-52 border-r border-gray-100 py-3 flex-shrink-0 bg-slate-50">
          {menuLoading ? (
            <div className="flex items-center justify-center py-8 text-gray-300">
              <Loader2 size={20} className="animate-spin" />
            </div>
          ) : menuData.length === 0 ? (
            <p className="px-5 py-4 text-sm text-gray-400">Henüz ürün eklenmemiş.</p>
          ) : (
            <>
              {menuData.map((cat, idx) => (
                <button
                  key={idx}
                  onMouseEnter={() => onCategoryHover(idx)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-all flex items-center justify-between border-l-2 ${
                    activeCategory === idx
                      ? "bg-blue-50 border-[#0f75bc] text-[#0f75bc] font-semibold"
                      : "border-transparent text-gray-700 hover:bg-blue-50/50 hover:text-[#0f75bc]"
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span
                    className={`text-xs flex-shrink-0 ml-1.5 tabular-nums ${
                      activeCategory === idx ? "text-[#0f75bc]/50" : "text-gray-400"
                    }`}
                  >
                    {cat.products.length}
                  </span>
                </button>
              ))}
              <div className="border-t border-gray-200 mt-2 pt-2 px-4">
                <Link
                  href="/tum-urunler"
                  className="text-xs font-bold text-[#0f75bc] hover:underline"
                >
                  Tüm Ürünleri Gör →
                </Link>
              </div>
            </>
          )}
        </aside>

        {/* ── ORTA: 3 sütunlu linkler + CTA butonu ────────────────────────── */}
        <section
          className="flex-1 px-8 py-6 overflow-y-auto"
          style={{ maxHeight: 400 }}
        >
          {activeCat && (
            <>
              <h3 className="text-sm font-black text-gray-800 mb-4 pb-2 border-b border-gray-100">
                {activeCat.name}
              </h3>

              <ul className="grid grid-cols-3 gap-x-8 gap-y-1.5">
                {activeCat.products.map((product) => (
                  <li key={product.slug}>
                    <Link
                      href={`/urun/${product.slug}`}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#0f75bc] transition-colors py-1 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#25aae1] flex-shrink-0 group-hover:bg-[#0f75bc] transition-colors" />
                      <span className="truncate">{product.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <Link
                  href={`/tum-urunler?kategori=${encodeURIComponent(activeCat.name)}`}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-[#0f75bc] hover:bg-[#07446c] text-white text-sm font-bold rounded-lg transition-colors"
                >
                  Tüm {activeCat.name} Ürünleri →
                </Link>
              </div>
            </>
          )}
        </section>

        {/* ── SAĞ: Öne çıkan ürün kartları ────────────────────────────────── */}
        <aside className="w-60 border-l border-gray-100 py-5 px-4 flex-shrink-0 bg-slate-50/60">
          {activeCat && activeCat.products.length > 0 && (
            <>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                Öne Çıkanlar
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {activeCat.products.slice(0, 4).map((product) => (
                  <Link
                    key={product.slug}
                    href={`/urun/${product.slug}`}
                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border border-transparent hover:border-[#bae6fd] hover:bg-white hover:shadow-sm transition-all group"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden relative bg-gradient-to-br from-[#e8f4fc] to-[#ddf0fb] flex items-center justify-center flex-shrink-0">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          sizes="64px"
                          className="object-contain p-1.5 group-hover:scale-110 transition-transform duration-200"
                        />
                      ) : (
                        <span className="text-2xl opacity-20">🖨️</span>
                      )}
                    </div>
                    <p className="text-[10px] text-center text-gray-500 group-hover:text-[#0f75bc] leading-tight line-clamp-2 transition-colors font-medium w-full">
                      {product.name}
                    </p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </aside>

      </div>
    </div>
  );
}
