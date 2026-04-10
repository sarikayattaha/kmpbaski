"use client";

import { useState } from "react";
import {
  Search, X, Package, ShoppingBag, FileText,
  MessageCircle, ChevronRight, Globe,
} from "lucide-react";

export type LinkProduct = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
};

// ── İkon yardımcısı ───────────────────────────────────────────────────────────

function ProductIcon({ name }: { name: string }) {
  const n = name.toLowerCase();
  if (n.includes("çanta") || n.includes("canta")) return <ShoppingBag size={26} />;
  if (n.includes("kağıt") || n.includes("kagit") || n.includes("dürüm") || n.includes("durum") || n.includes("wrap")) return <FileText size={26} />;
  return <Package size={26} />;
}

// Renk paleti — kartlara sırayla atanır
const PALETTE = [
  { bg: "bg-[#07446c]", text: "text-white", icon: "text-[#93c5fd]" },
  { bg: "bg-[#0f75bc]", text: "text-white", icon: "text-blue-200"  },
  { bg: "bg-[#0e7490]", text: "text-white", icon: "text-cyan-200"  },
  { bg: "bg-[#065f46]", text: "text-white", icon: "text-emerald-200" },
  { bg: "bg-[#7c3aed]", text: "text-white", icon: "text-violet-200" },
  { bg: "bg-[#b45309]", text: "text-white", icon: "text-amber-200"  },
  { bg: "bg-[#be185d]", text: "text-white", icon: "text-pink-200"   },
];

const WA_NUMBER = "905541630031";

// ── Ana bileşen ───────────────────────────────────────────────────────────────

export default function LinkSearch({ products }: { products: LinkProduct[] }) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    : products;

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">

      {/* ── Arama Kutusu ────────────────────────────────────────────────────── */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Ürün ara… (baklava, pide, pizza…)"
          className="w-full bg-white border border-blue-100 rounded-2xl pl-11 pr-10 py-3.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc] transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* ── Ürün Kartları ───────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Package size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">"{query}" için ürün bulunamadı.</p>
          <button
            onClick={() => setQuery("")}
            className="mt-3 text-xs text-[#0f75bc] font-semibold hover:underline"
          >
            Tüm ürünleri göster
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((product, i) => {
            const color = PALETTE[i % PALETTE.length];
            const waText = encodeURIComponent(
              `Merhaba, ${product.name} hakkında fiyat teklifi almak istiyorum.`
            );
            return (
              <a
                key={product.id}
                href={`/ambalaj/istanbul/${product.slug}`}
                className={`${color.bg} ${color.text} rounded-2xl p-4 flex flex-col justify-between min-h-[110px] shadow-md active:scale-95 transition-transform`}
              >
                <span className={`${color.icon} mb-2`}>
                  <ProductIcon name={product.name} />
                </span>
                <div>
                  <p className="font-black text-sm leading-tight">{product.name}</p>
                  <p className="text-[11px] opacity-70 mt-0.5 flex items-center gap-0.5">
                    81 il <Globe size={9} />
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      )}

      {/* ── WhatsApp CTA ────────────────────────────────────────────────────── */}
      <div className="bg-white border border-green-100 rounded-3xl p-5 shadow-sm text-center">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1">
          Hızlı Teklif Hattı
        </p>
        <p className="text-[#07446c] font-black text-base mb-1">
          Ne istediğini söyle, fiyatı anında gelsin.
        </p>
        <p className="text-xs text-gray-400 mb-4">
          Ortalama yanıt süresi: <strong className="text-gray-600">15 dakika</strong>
        </p>
        <a
          href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Merhaba, ambalaj fiyatları hakkında bilgi almak istiyorum.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe57] active:bg-[#17a34a] text-white font-black px-6 py-4 rounded-2xl transition-colors shadow-lg text-sm w-full"
        >
          <MessageCircle size={20} />
          WhatsApp ile Teklif Al
          <ChevronRight size={16} className="opacity-70" />
        </a>
        <a
          href="tel:+905541630031"
          className="mt-2 block text-xs text-gray-400 hover:text-[#0f75bc] transition-colors py-1"
        >
          veya ara: +90 554 163 00 31
        </a>
      </div>

      {/* ── Tüm Site Linki ──────────────────────────────────────────────────── */}
      <div className="text-center pb-4">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#0f75bc] transition-colors font-medium"
        >
          kmpbaski.com&apos;u tam olarak görüntüle <ChevronRight size={12} />
        </a>
      </div>

    </div>
  );
}
