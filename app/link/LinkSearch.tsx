"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search, X, Package, MessageCircle,
  ChevronRight, ArrowLeft,
} from "lucide-react";

// ── Tipler ────────────────────────────────────────────────────────────────────
export type LinkProduct = {
  id:        string;
  name:      string;
  slug:      string;
  image_url: string | null;
  category:  string;
};

export type LinkCategory = {
  name: string;
};

// ── Sabitler ──────────────────────────────────────────────────────────────────
const WA_NUMBER  = "905541630031";
const WA_DEFAULT = encodeURIComponent(
  "Merhaba, baskı ve ambalaj fiyatları hakkında bilgi almak istiyorum."
);

const CAT_COLORS = [
  "bg-[#07446c]", "bg-[#0f75bc]", "bg-[#0e7490]", "bg-[#065f46]",
  "bg-[#7c3aed]", "bg-[#b45309]", "bg-[#be185d]", "bg-[#0f766e]",
  "bg-[#1d4ed8]", "bg-[#b91c1c]",
];

// ── Alt bileşenler ────────────────────────────────────────────────────────────

function CategoryGrid({
  categories,
  onSelect,
}: {
  categories: LinkCategory[];
  onSelect: (name: string) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">
        Kategoriler
      </p>
      <div className="grid grid-cols-2 gap-3">
        {categories.map((cat, i) => (
          <button
            key={cat.name}
            onClick={() => onSelect(cat.name)}
            className={`${CAT_COLORS[i % CAT_COLORS.length]} text-white rounded-2xl px-4 py-5 text-left flex items-center justify-between shadow-md active:scale-95 transition-transform`}
          >
            <span className="font-bold text-sm leading-tight">{cat.name}</span>
            <ChevronRight size={16} className="opacity-60 flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductGrid({ products }: { products: LinkProduct[] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/urun/${product.slug}`}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-full aspect-square rounded-2xl overflow-hidden relative bg-white shadow-sm group-active:shadow-md transition-shadow">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                sizes="(max-width: 512px) 45vw, 200px"
                className="object-contain p-3"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package size={32} className="text-gray-200" />
              </div>
            )}
          </div>
          <p className="text-xs font-semibold text-center text-gray-700 group-hover:text-[#0f75bc] leading-tight line-clamp-2 transition-colors w-full">
            {product.name}
          </p>
        </Link>
      ))}
    </div>
  );
}

function EmptyState({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div className="text-center py-14 text-gray-400">
      <Package size={40} className="mx-auto mb-3 opacity-25" />
      <p className="text-sm font-semibold">&quot;{query}&quot; için ürün bulunamadı.</p>
      <button
        onClick={onClear}
        className="mt-3 text-xs text-[#0f75bc] font-bold hover:underline"
      >
        Tüm kategorilere dön
      </button>
    </div>
  );
}

function WhatsAppCTA() {
  return (
    <div className="pt-2">
      <a
        href={`https://wa.me/${WA_NUMBER}?text=${WA_DEFAULT}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 bg-[#25D366] active:bg-[#17a34a] text-white font-black px-6 py-5 rounded-2xl shadow-lg text-base w-full transition-colors"
      >
        <MessageCircle size={22} />
        WhatsApp ile Hızlı Teklif Al
      </a>
      <a
        href="tel:+905541630031"
        className="mt-2.5 block text-center text-xs text-gray-400 hover:text-[#0f75bc] transition-colors py-1"
      >
        veya ara: +90 554 163 00 31
      </a>
    </div>
  );
}

// ── Ana bileşen ───────────────────────────────────────────────────────────────
export default function LinkSearch({
  products,
  categories,
}: {
  products:   LinkProduct[];
  categories: LinkCategory[];
}) {
  const [query, setQuery]         = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const handleCatSelect = (name: string) => {
    setActiveCat(name);
    setQuery("");
  };

  const handleClear = () => {
    setQuery("");
    setActiveCat(null);
  };

  const isSearching    = query.trim().length > 0;
  const showCategories = !isSearching && !activeCat;

  const filtered = isSearching
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : activeCat
    ? products.filter(p => p.category === activeCat)
    : [];

  return (
    <div className="max-w-lg mx-auto px-4 pt-5 pb-8 space-y-5">

      {/* ── Arama ───────────────────────────────────────────────────────────── */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="search"
          inputMode="search"
          value={query}
          onChange={e => { setQuery(e.target.value); setActiveCat(null); }}
          placeholder="Ürün ara… (kartvizit, kutu, çanta…)"
          className="w-full bg-white border border-blue-100 rounded-2xl pl-11 pr-10 py-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc] transition-all"
        />
        {(query || activeCat) && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* ── Kategoriler (varsayılan görünüm) ────────────────────────────────── */}
      {showCategories && (
        <CategoryGrid categories={categories} onSelect={handleCatSelect} />
      )}

      {/* ── Ürün listesi (kategori seçili veya arama yapılıyor) ─────────────── */}
      {!showCategories && (
        <div className="space-y-3">
          {activeCat && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 text-sm font-semibold text-[#0f75bc]"
              >
                <ArrowLeft size={16} />
                Geri
              </button>
              <span className="text-gray-300">|</span>
              <span className="text-sm font-bold text-gray-700">{activeCat}</span>
            </div>
          )}

          {filtered.length === 0
            ? <EmptyState query={query} onClear={handleClear} />
            : <ProductGrid products={filtered} />
          }
        </div>
      )}

      {/* ── WhatsApp CTA ────────────────────────────────────────────────────── */}
      <WhatsAppCTA />

      {/* ── Ana site linki ──────────────────────────────────────────────────── */}
      <div className="text-center pb-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-[#0f75bc] transition-colors"
        >
          kmpbaski.com&apos;u tam görüntüle
          <ChevronRight size={12} />
        </Link>
      </div>

    </div>
  );
}
