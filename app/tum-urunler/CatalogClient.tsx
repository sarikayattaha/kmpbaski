"use client";

import { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Tag, ChevronRight, LayoutGrid, List, Flame, Sparkles, Star } from "lucide-react";
import type { Product } from "@/lib/supabase";

const FILTERS = [
  { key: "tumu", label: "Tümü", icon: null },
  { key: "yeni", label: "Yeni Ürünler", icon: Sparkles },
  { key: "firsat", label: "Fırsat Ürünü", icon: Flame },
  { key: "populer", label: "Popüler", icon: Star },
];

/* Ürünün en düşük fiyatını price_matrix'ten çek */
function getStartingPrice(product: Product): string | null {
  const groups = product.price_matrix?.groups;
  if (!groups?.length) return null;

  const prices: number[] = [];
  const colLen = product.price_matrix!.columns.length;

  for (const g of groups) {
    for (const row of g.rows) {
      const raw = row[colLen - 1] ?? "";
      // "₺420,00" / "420" / "₺1.200,00" formatlarını parse et
      const cleaned = raw.replace(/[₺\s.]/g, "").replace(",", ".");
      const num = parseFloat(cleaned);
      if (!isNaN(num) && num > 0) prices.push(num);
    }
  }

  if (!prices.length) return null;
  const min = Math.min(...prices);
  return min.toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function CatalogClient({
  products,
  categories,
  activeCategory,
  activeFilter,
}: {
  products: Product[];
  categories: string[];
  activeCategory: string | null;
  activeFilter: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const updateQuery = (key: string, value: string | null) => {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  };

  const filtered = useMemo(() => {
    let result = [...products];
    if (activeCategory) result = result.filter((p) => p.category === activeCategory);
    // Filtreler: şimdilik sıralama/etiket mantığı (ileride is_new, is_featured vb. alanlarla genişletilebilir)
    if (activeFilter === "yeni") result = result.slice(0, Math.ceil(result.length * 0.4));
    if (activeFilter === "firsat") result = result.filter((_, i) => i % 3 === 0);
    if (activeFilter === "populer") result = result.filter((p) => p.is_featured);
    return result;
  }, [products, activeCategory, activeFilter]);

  return (
    <div className="flex gap-8 items-start">

      {/* ── SOL SİDEBAR (desktop) ── */}
      <aside className="w-64 flex-shrink-0 hidden md:block sticky top-24 self-start">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-[#07446c] px-5 py-4">
            <h2 className="text-sm font-black text-white tracking-wide uppercase">
              Kategori Ağacı
            </h2>
          </div>

          <nav className="py-2">
            <button
              onClick={() => updateQuery("kategori", null)}
              className={`w-full flex items-center justify-between px-5 py-3 text-sm transition-colors ${
                !activeCategory
                  ? "bg-[#e0f2fe] text-[#0f75bc] font-bold"
                  : "text-gray-700 hover:bg-gray-50 font-medium"
              }`}
            >
              <span className="flex items-center gap-2">
                <LayoutGrid size={14} />
                Tüm Kategoriler
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                !activeCategory ? "bg-[#0f75bc] text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {products.length}
              </span>
            </button>

            <div className="h-px bg-gray-100 mx-3 my-1" />

            {categories.map((cat) => {
              const count = products.filter((p) => p.category === cat).length;
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => updateQuery("kategori", cat)}
                  className={`w-full flex items-center justify-between px-5 py-2.5 text-sm transition-colors group ${
                    isActive
                      ? "bg-[#e0f2fe] text-[#0f75bc] font-bold border-r-2 border-[#0f75bc]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-[#0f75bc]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <ChevronRight
                      size={12}
                      className={`transition-transform ${isActive ? "rotate-90 text-[#0f75bc]" : "text-gray-300 group-hover:text-[#0f75bc]"}`}
                    />
                    {cat}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive ? "bg-[#0f75bc] text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Alt bilgi kutusu */}
          <div className="border-t border-gray-100 bg-[#f0fdf4] px-5 py-4 mt-1">
            <p className="text-[11px] text-green-700 font-semibold leading-relaxed">
              ✓ Hızlı teslimat<br />
              ✓ Kalite garantisi<br />
              ✓ Ücretsiz kargo seçenekleri
            </p>
          </div>
        </div>
      </aside>

      {/* ── SAĞ İÇERİK ── */}
      <div className="flex-1 min-w-0">

        {/* Başlık satırı */}
        <div className="mb-5">
          <h1 className="text-2xl font-black text-[#07446c] leading-tight">
            {activeCategory ? activeCategory : "Tüm Matbaa ve Baskı Ürünleri"}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            <span className="font-semibold text-[#0f75bc]">{filtered.length}</span> ürün listeleniyor
          </p>
        </div>

        {/* Filtre + görünüm çubuğu */}
        <div className="bg-white rounded-2xl border border-gray-100 px-4 py-3 mb-6 flex flex-wrap items-center gap-3 shadow-sm">
          {/* Mobil kategori toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center gap-1.5 text-xs font-bold text-[#07446c] bg-[#e0f2fe] px-3 py-1.5 rounded-lg"
          >
            <LayoutGrid size={13} />
            {activeCategory ?? "Kategori"}
          </button>

          <div className="flex items-center gap-2 flex-wrap flex-1">
            {FILTERS.map((f) => {
              const Icon = f.icon;
              const isActive = (activeFilter ?? "tumu") === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => updateQuery("filtre", f.key === "tumu" ? null : f.key)}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                    isActive
                      ? "bg-[#07446c] text-white border-[#07446c] shadow-sm"
                      : "bg-white text-gray-500 border-gray-200 hover:border-[#07446c] hover:text-[#07446c]"
                  }`}
                >
                  {Icon && <Icon size={11} />}
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Grid / List toggle */}
          <div className="hidden md:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-white shadow-sm text-[#0f75bc]" : "text-gray-400 hover:text-gray-600"}`}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-white shadow-sm text-[#0f75bc]" : "text-gray-400 hover:text-gray-600"}`}
            >
              <List size={15} />
            </button>
          </div>
        </div>

        {/* Mobil kategori listesi */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white rounded-2xl border border-gray-100 shadow-sm mb-5 py-2 overflow-x-auto">
            <div className="flex gap-2 px-4 pb-1">
              <button
                onClick={() => { updateQuery("kategori", null); setMobileMenuOpen(false); }}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                  !activeCategory ? "bg-[#07446c] text-white border-[#07446c]" : "border-gray-200 text-gray-600"
                }`}
              >
                Tümü ({products.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { updateQuery("kategori", cat); setMobileMenuOpen(false); }}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                    activeCategory === cat
                      ? "bg-[#07446c] text-white border-[#07446c]"
                      : "border-gray-200 text-gray-600 hover:border-[#07446c]"
                  }`}
                >
                  {cat} ({products.filter((p) => p.category === cat).length})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ürün yok */}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 py-20 flex flex-col items-center gap-4 text-center">
            <div className="text-6xl opacity-20">🖨️</div>
            <p className="text-gray-400 text-sm font-medium">
              Bu kategoride henüz ürün bulunmuyor.
            </p>
            <button
              onClick={() => updateQuery("kategori", null)}
              className="text-[#0f75bc] text-sm font-bold hover:underline"
            >
              Tüm ürünleri gör →
            </button>
          </div>
        )}

        {/* IZGARA görünümü */}
        {viewMode === "grid" && filtered.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* LİSTE görünümü */}
        {viewMode === "list" && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── KART bileşeni ── */
function ProductCard({ product }: { product: Product }) {
  const startingPrice = getStartingPrice(product);
  const groupCount = product.price_matrix?.groups?.length ?? 0;

  return (
    <a
      href={`/urun/${product.slug}`}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#bae6fd] hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden"
    >
      {/* Görsel */}
      <div className="relative h-48 bg-gradient-to-br from-[#e8f4fc] to-[#ddf0fb] overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width:768px) 50vw, 33vw"
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-10">
            🖨️
          </div>
        )}
        {product.is_featured && (
          <span className="absolute top-2.5 left-2.5 bg-[#e30613] text-white text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-wide">
            Popüler
          </span>
        )}
        {groupCount > 0 && (
          <span className="absolute top-2.5 right-2.5 bg-white/90 text-[#07446c] text-[9px] font-black px-2 py-1 rounded-full border border-gray-100">
            {groupCount} grup
          </span>
        )}
      </div>

      {/* İçerik */}
      <div className="p-4 flex flex-col flex-1">
        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#25aae1] uppercase tracking-wider mb-1.5">
          <Tag size={8} /> {product.category}
        </span>
        <h3 className="text-sm font-bold text-[#07446c] leading-snug mb-3 group-hover:text-[#0f75bc] transition-colors">
          {product.name}
        </h3>

        <div className="mt-auto pt-3 border-t border-gray-50 flex items-end justify-between">
          <div>
            {startingPrice ? (
              <>
                <p className="text-[10px] text-gray-400 font-medium">başlayan fiyatlarla</p>
                <p className="text-lg font-black text-[#07446c] leading-none">
                  ₺{startingPrice}
                  <span className="text-xs font-normal text-gray-400 ml-1">+KDV</span>
                </p>
              </>
            ) : (
              <p className="text-xs text-gray-400 font-medium">Fiyat için arayın</p>
            )}
          </div>
          <span className="text-[10px] font-bold text-[#0f75bc] bg-[#e0f2fe] px-2.5 py-1 rounded-lg group-hover:bg-[#0f75bc] group-hover:text-white transition-colors">
            İncele →
          </span>
        </div>
      </div>
    </a>
  );
}

/* ── LİSTE SATIRI bileşeni ── */
function ProductRow({ product }: { product: Product }) {
  const startingPrice = getStartingPrice(product);

  return (
    <a
      href={`/urun/${product.slug}`}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#bae6fd] transition-all duration-200 flex items-center gap-5 p-4"
    >
      <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-[#e8f4fc] to-[#ddf0fb]">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="80px"
            className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl opacity-10">🖨️</div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <span className="text-[9px] font-bold text-[#25aae1] uppercase tracking-wider">{product.category}</span>
        <h3 className="text-sm font-bold text-[#07446c] group-hover:text-[#0f75bc] transition-colors leading-snug mt-0.5 truncate">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-1">{product.description}</p>
        )}
      </div>

      <div className="flex-shrink-0 text-right">
        {startingPrice ? (
          <>
            <p className="text-[10px] text-gray-400">başlayan fiyatlarla</p>
            <p className="text-base font-black text-[#07446c]">₺{startingPrice}<span className="text-xs font-normal text-gray-400 ml-0.5">+KDV</span></p>
          </>
        ) : (
          <p className="text-xs text-gray-400">Fiyat için arayın</p>
        )}
        <span className="text-[10px] font-bold text-[#0f75bc] group-hover:underline">İncele →</span>
      </div>
    </a>
  );
}
