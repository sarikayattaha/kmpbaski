"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/supabase";

type ProductCard = {
  groupLabel: string;
  groupColor: string;
  code: string;
  price: string;
  features: { col: string; val: string }[];
  variantImage: string; // varyanta özel görsel — yoksa ürün ana görseli
};

function buildCards(product: Product): ProductCard[] {
  const matrix = product.price_matrix;
  if (!matrix || !matrix.groups?.length) return [];

  const cols = matrix.columns;
  const priceIdx = cols.length - 1;

  return matrix.groups.flatMap((group) =>
    group.rows.map((row, ri) => ({
      groupLabel: group.label,
      groupColor: group.color,
      code: row[0] ?? "",
      price: row[priceIdx] ?? "",
      features: cols
        .slice(1, priceIdx)
        .map((col, i) => ({ col, val: row[i + 1] ?? "" }))
        .filter((f) => f.val),
      // Varyanta özel görsel → yoksa ürünün ana görseli
      variantImage:
        (group.rowImages?.[ri] ?? "") || product.image_url || "",
    }))
  );
}

export default function ProductShowcase({ product }: { product: Product }) {
  const searchParams = useSearchParams();
  const [activeGroup, setActiveGroup] = useState<string | null>(
    searchParams.get("group")
  );

  useEffect(() => {
    setActiveGroup(searchParams.get("group"));
  }, [searchParams]);

  const allCards = buildCards(product);
  const groups = product.price_matrix?.groups ?? [];

  if (allCards.length === 0) return null;

  const shown = activeGroup
    ? allCards.filter((c) => c.groupLabel === activeGroup)
    : allCards;

  return (
    <section>
      {/* ── Filtre sekmeleri ── */}
      <div className="flex items-center gap-2 flex-wrap mb-8">
        <button
          onClick={() => setActiveGroup(null)}
          className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
            activeGroup === null
              ? "bg-[#07446c] text-white border-[#07446c]"
              : "bg-white text-gray-600 border-gray-200 hover:border-[#07446c] hover:text-[#07446c]"
          }`}
        >
          Tümü ({allCards.length})
        </button>

        {groups.map((g) => {
          const count = allCards.filter((c) => c.groupLabel === g.label).length;
          const isActive = activeGroup === g.label;
          return (
            <button
              key={g.label}
              onClick={() => setActiveGroup(isActive ? null : g.label)}
              className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                isActive
                  ? "text-white border-transparent"
                  : "bg-white text-gray-600 border-gray-200"
              }`}
              style={{ backgroundColor: isActive ? g.color : undefined }}
              onMouseEnter={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = g.color + "22";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "";
              }}
            >
              {g.label} ({count})
            </button>
          );
        })}
      </div>

      {/* ── Kart ızgarası ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {shown.map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden group"
          >
            {/* Görsel */}
            <div className="relative h-44 bg-gradient-to-br from-[#e8f4fc] to-[#ddf0fb] overflow-hidden">
              {card.variantImage ? (
                <Image
                  src={card.variantImage}
                  alt={`${product.name} ${card.code}`}
                  fill
                  sizes="(max-width:768px) 50vw, 25vw"
                  className="object-contain p-5 group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl opacity-10">
                  🖨️
                </div>
              )}
              {/* Grup rozeti */}
              <span
                className="absolute top-2.5 left-2.5 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm"
                style={{ backgroundColor: card.groupColor }}
              >
                {card.groupLabel}
              </span>
            </div>

            {/* İçerik */}
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-sm font-bold text-[#07446c] leading-snug mb-2">
                {product.name}
                {card.code && (
                  <span className="text-[#25aae1] font-black"> — {card.code}</span>
                )}
              </h3>

              {card.features.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {card.features.map((f, fi) => (
                    <span key={fi}
                      className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                      {f.val}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-auto pt-2">
                <p className="text-xl font-black text-[#07446c] mb-3 leading-none">
                  {card.price}
                  <span className="text-xs font-normal text-gray-400 ml-1">+KDV</span>
                </p>
                <button className="w-full flex items-center justify-center gap-2 bg-[#e30613] hover:bg-red-700 active:scale-95 text-white font-black py-2.5 rounded-xl transition-all text-xs tracking-wide uppercase shadow-md shadow-red-600/20">
                  <ShoppingCart size={14} />
                  Sepete Ekle
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
