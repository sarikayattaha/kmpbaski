"use client";

import { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Tag, ChevronRight, LayoutGrid, List, Flame, Sparkles, Star } from "lucide-react";
import type { Product } from "@/lib/supabase";

const FILTERS = [
  { key: "tumu",    label: "Tümü",         icon: null      },
  { key: "yeni",    label: "Yeni Ürünler",  icon: Sparkles  },
  { key: "firsat",  label: "Fırsat Ürünü",  icon: Flame     },
  { key: "populer", label: "Popüler",        icon: Star      },
];

export default function CatalogClient({
  products,
  categories,
  activeCategory,
  activeFilter,
  searchQuery,
}: {
  products: Product[];
  categories: string[];
  activeCategory: string | null;
  activeFilter: string | null;
  searchQuery: string | null;
}) {
  const router   = useRouter();
  const pathname = usePathname();
  const [viewMode, setViewMode]         = useState<"grid" | "list">("grid");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const updateQuery = (key: string, value: string | null) => {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set(key, value); else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  };

  /* Kategori + filtre + arama uygula */
  const filtered = useMemo(() => {
    let result = [...products];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (activeCategory) result = result.filter((p) => p.category === activeCategory);
    if (activeFilter === "yeni")    result = result.slice(0, Math.ceil(result.length * 0.5) || result.length);
    if (activeFilter === "firsat")  result = result.filter((_, i) => i % 2 === 0);
    if (activeFilter === "populer") result = result.filter((p) => p.is_featured);
    return result;
  }, [products, activeCategory, activeFilter, searchQuery]);

  /* Sidebar sayaçları */
  const countByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of products) map[p.category] = (map[p.category] ?? 0) + 1;
    return map;
  }, [products]);

  return (
    <div className="flex gap-8 items-start">

      {/* ── SOL SİDEBAR ── */}
      <aside className="w-64 flex-shrink-0 hidden md:block sticky top-24 self-start">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-[#07446c] px-5 py-4">
            <h2 className="text-sm font-black text-white tracking-wide uppercase">Kategori Ağacı</h2>
          </div>
          <nav className="py-2">
            <button onClick={() => updateQuery("kategori", null)}
              className={`w-full flex items-center justify-between px-5 py-3 text-sm transition-colors ${
                !activeCategory ? "bg-[#e0f2fe] text-[#0f75bc] font-bold" : "text-gray-700 hover:bg-gray-50 font-medium"
              }`}>
              <span className="flex items-center gap-2"><LayoutGrid size={14} />Tüm Kategoriler</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${!activeCategory ? "bg-[#0f75bc] text-white" : "bg-gray-100 text-gray-500"}`}>
                {products.length}
              </span>
            </button>
            <div className="h-px bg-gray-100 mx-3 my-1" />
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button key={cat} onClick={() => updateQuery("kategori", cat)}
                  className={`w-full flex items-center justify-between px-5 py-2.5 text-sm transition-colors group ${
                    isActive ? "bg-[#e0f2fe] text-[#0f75bc] font-bold border-r-2 border-[#0f75bc]" : "text-gray-600 hover:bg-gray-50 hover:text-[#0f75bc]"
                  }`}>
                  <span className="flex items-center gap-2">
                    <ChevronRight size={12} className={`transition-transform ${isActive ? "rotate-90 text-[#0f75bc]" : "text-gray-300 group-hover:text-[#0f75bc]"}`} />
                    {cat}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? "bg-[#0f75bc] text-white" : "bg-gray-100 text-gray-500"}`}>
                    {countByCategory[cat] ?? 0}
                  </span>
                </button>
              );
            })}
          </nav>
          <div className="border-t border-gray-100 bg-[#f0fdf4] px-5 py-4 mt-1">
            <p className="text-[11px] text-green-700 font-semibold leading-relaxed">
              ✓ Hızlı teslimat<br />✓ Kalite garantisi<br />✓ Zamanında teslim güvencesi
            </p>
          </div>
        </div>
      </aside>

      {/* ── SAĞ İÇERİK ── */}
      <div className="flex-1 min-w-0">

        {/* Başlık */}
        <div className="mb-5">
          <h1 className="text-2xl font-black text-[#07446c] leading-tight">
            {searchQuery
              ? `"${searchQuery}" için arama sonuçları`
              : (activeCategory ?? "Tüm Matbaa ve Baskı Ürünleri")}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            <span className="font-semibold text-[#0f75bc]">{filtered.length}</span> ürün listeleniyor
          </p>
        </div>

        {/* Filtre + görünüm çubuğu */}
        <div className="bg-white rounded-2xl border border-gray-100 px-4 py-3 mb-6 flex flex-wrap items-center gap-3 shadow-sm">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center gap-1.5 text-xs font-bold text-[#07446c] bg-[#e0f2fe] px-3 py-1.5 rounded-lg">
            <LayoutGrid size={13} />{activeCategory ?? "Kategori"}
          </button>

          <div className="flex items-center gap-2 flex-wrap flex-1">
            {FILTERS.map((f) => {
              const Icon = f.icon;
              const isActive = (activeFilter ?? "tumu") === f.key;
              return (
                <button key={f.key} onClick={() => updateQuery("filtre", f.key === "tumu" ? null : f.key)}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                    isActive ? "bg-[#07446c] text-white border-[#07446c] shadow-sm" : "bg-white text-gray-500 border-gray-200 hover:border-[#07446c] hover:text-[#07446c]"
                  }`}>
                  {Icon && <Icon size={11} />}{f.label}
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {(["grid", "list"] as const).map((mode) => (
              <button key={mode} onClick={() => setViewMode(mode)}
                className={`p-1.5 rounded-md transition-colors ${viewMode === mode ? "bg-white shadow-sm text-[#0f75bc]" : "text-gray-400 hover:text-gray-600"}`}>
                {mode === "grid" ? <LayoutGrid size={15} /> : <List size={15} />}
              </button>
            ))}
          </div>
        </div>

        {/* Mobil kategori pills */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white rounded-2xl border border-gray-100 shadow-sm mb-5 overflow-x-auto">
            <div className="flex gap-2 p-4">
              <button onClick={() => { updateQuery("kategori", null); setMobileMenuOpen(false); }}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold border flex-shrink-0 transition-all ${!activeCategory ? "bg-[#07446c] text-white border-[#07446c]" : "border-gray-200 text-gray-600"}`}>
                Tümü ({products.length})
              </button>
              {categories.map((cat) => (
                <button key={cat} onClick={() => { updateQuery("kategori", cat); setMobileMenuOpen(false); }}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold border flex-shrink-0 transition-all ${activeCategory === cat ? "bg-[#07446c] text-white border-[#07446c]" : "border-gray-200 text-gray-600"}`}>
                  {cat} ({countByCategory[cat] ?? 0})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Boş durum */}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 py-20 flex flex-col items-center gap-4 text-center">
            <div className="text-6xl opacity-20">🖨️</div>
            <p className="text-gray-400 text-sm font-medium">Bu kategoride henüz ürün bulunmuyor.</p>
            <button onClick={() => updateQuery("kategori", null)} className="text-[#0f75bc] text-sm font-bold hover:underline">
              Tüm ürünleri gör →
            </button>
          </div>
        )}

        {/* IZGARA */}
        {viewMode === "grid" && filtered.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {filtered.map((p) => <ProductGridCard key={p.id} product={p} />)}
          </div>
        )}

        {/* LİSTE */}
        {viewMode === "list" && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((p) => <ProductListRow key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── IZGARA KARTI ── */
function ProductGridCard({ product: p }: { product: Product }) {
  return (
    <a href={`/urun/${p.slug}`}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#bae6fd] hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden">
      <div className="relative aspect-[4/3] bg-white overflow-hidden">
        {p.image_url ? (
          <Image src={p.image_url} alt={p.name} fill sizes="(max-width:768px) 50vw, 33vw"
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          </div>
        )}
        {p.is_featured && (
          <span className="absolute top-2.5 left-2.5 bg-[#e30613] text-white text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-wide">
            Popüler
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#25aae1] uppercase tracking-wider mb-1.5">
          <Tag size={8} />{p.category}
        </span>
        <h3 className="text-sm font-bold text-[#07446c] leading-snug group-hover:text-[#0f75bc] transition-colors flex-1">
          {p.name}
        </h3>
        <div className="mt-3 pt-3 border-t border-gray-50 flex items-end justify-between">
          <div>
            {p.is_price_on_request ? (
              <p className="text-sm font-black text-orange-500 tracking-wide">Fiyat Alınız</p>
            ) : p.price ? (
              <>
                <p className="text-[9px] text-gray-400 font-medium">başlayan fiyat</p>
                <p className="text-lg font-black text-[#07446c] leading-none">
                  {p.price}<span className="text-xs font-normal text-gray-400 ml-1">+KDV</span>
                </p>
              </>
            ) : (
              <p className="text-xs text-gray-400">Fiyat için arayın</p>
            )}
          </div>
          <span className="text-[10px] font-bold text-[#0f75bc] bg-[#e0f2fe] px-2.5 py-1 rounded-lg group-hover:bg-[#0f75bc] group-hover:text-white transition-colors whitespace-nowrap">
            İncele →
          </span>
        </div>
      </div>
    </a>
  );
}

/* ── LİSTE SATIRI ── */
function ProductListRow({ product: p }: { product: Product }) {
  const firstFeature = (p.features ?? "").split("\n").map((l) => l.trim()).filter(Boolean)[0];

  return (
    <a href={`/urun/${p.slug}`}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#bae6fd] transition-all duration-200 flex items-center gap-5 p-4">
      <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-white border border-gray-100">
        {p.image_url ? (
          <Image src={p.image_url} alt={p.name} fill sizes="80px"
            className="object-contain p-2 group-hover:scale-110 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[9px] font-bold text-[#25aae1] uppercase tracking-wider">{p.category}</span>
        <h3 className="text-sm font-bold text-[#07446c] group-hover:text-[#0f75bc] transition-colors leading-snug mt-0.5 truncate">
          {p.name}
        </h3>
        {firstFeature && <p className="text-xs text-gray-400 mt-1 truncate">{firstFeature}</p>}
      </div>
      <div className="flex-shrink-0 text-right">
        {p.is_price_on_request ? (
          <p className="text-sm font-black text-orange-500 tracking-wide">Fiyat Alınız</p>
        ) : p.price ? (
          <>
            <p className="text-base font-black text-[#07446c]">{p.price}</p>
            <p className="text-[10px] text-gray-400">+KDV</p>
          </>
        ) : (
          <p className="text-xs text-gray-400">Fiyat için arayın</p>
        )}
        <span className="text-[10px] font-bold text-[#0f75bc] group-hover:underline">İncele →</span>
      </div>
    </a>
  );
}
