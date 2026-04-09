"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Package, Tag, Ruler, ChevronRight, LayoutGrid } from "lucide-react";
import type { AmbalajCategory, AmbalajProduct } from "@/lib/supabase";

export default function AmbalajClient({
  categories,
  products,
}: {
  categories: AmbalajCategory[];
  products: AmbalajProduct[];
}) {
  const [activeCatId, setActiveCatId] = useState<string | null>(null);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  const filtered = useMemo(
    () => activeCatId ? products.filter(p => p.category_id === activeCatId) : products,
    [products, activeCatId],
  );

  const countByCat = useMemo(() => {
    const m: Record<string, number> = {};
    for (const p of products) m[p.category_id] = (m[p.category_id] ?? 0) + 1;
    return m;
  }, [products]);

  const activeCat = categories.find(c => c.id === activeCatId);

  return (
    <div className="flex gap-8 items-start">

      {/* ── SOL SİDEBAR (masaüstü) ── */}
      <aside className="w-64 flex-shrink-0 hidden md:block sticky top-24 self-start">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-[#07446c] px-5 py-4">
            <h2 className="text-sm font-black text-white tracking-wide uppercase">Ambalaj Kategorileri</h2>
          </div>
          <nav className="py-2">
            <button onClick={() => setActiveCatId(null)}
              className={`w-full flex items-center justify-between px-5 py-3 text-sm transition-colors ${
                !activeCatId ? "bg-[#e0f2fe] text-[#0f75bc] font-bold" : "text-gray-700 hover:bg-gray-50 font-medium"
              }`}>
              <span className="flex items-center gap-2"><LayoutGrid size={14} />Tümü</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${!activeCatId ? "bg-[#0f75bc] text-white" : "bg-gray-100 text-gray-500"}`}>
                {products.length}
              </span>
            </button>
            <div className="h-px bg-gray-100 mx-3 my-1" />
            {categories.map((cat) => {
              const isActive = activeCatId === cat.id;
              return (
                <button key={cat.id} onClick={() => setActiveCatId(cat.id)}
                  className={`w-full flex items-center justify-between px-5 py-2.5 text-sm transition-colors group ${
                    isActive ? "bg-[#e0f2fe] text-[#0f75bc] font-bold border-r-2 border-[#0f75bc]" : "text-gray-600 hover:bg-gray-50 hover:text-[#0f75bc]"
                  }`}>
                  <span className="flex items-center gap-2">
                    <ChevronRight size={12} className={`transition-transform ${isActive ? "rotate-90 text-[#0f75bc]" : "text-gray-300 group-hover:text-[#0f75bc]"}`} />
                    <span className="text-base">{cat.icon}</span>
                    {cat.name}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? "bg-[#0f75bc] text-white" : "bg-gray-100 text-gray-500"}`}>
                    {countByCat[cat.id] ?? 0}
                  </span>
                </button>
              );
            })}
          </nav>
          <div className="border-t border-gray-100 bg-[#f0fdf4] px-5 py-4 mt-1">
            <p className="text-[11px] text-green-700 font-semibold leading-relaxed">
              ✓ Gıda onaylı malzeme<br />✓ Özel ebat seçeneği<br />✓ Kalite garantisi
            </p>
          </div>
        </div>
      </aside>

      {/* ── SAĞ İÇERİK ── */}
      <div className="flex-1 min-w-0">

        {/* Başlık */}
        <div className="mb-5">
          <h1 className="text-2xl font-black text-[#07446c] leading-tight">
            {activeCat ? `${activeCat.icon} ${activeCat.name}` : "Tüm Ambalaj Ürünleri"}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            <span className="font-semibold text-[#0f75bc]">{filtered.length}</span> ürün listeleniyor
          </p>
        </div>

        {/* Mobil kategori butonu */}
        <button onClick={() => setMobileOpen(v => !v)}
          className="md:hidden mb-4 flex items-center gap-1.5 text-xs font-bold text-[#07446c] bg-[#e0f2fe] px-3 py-1.5 rounded-lg">
          <LayoutGrid size={13} />{activeCat ? `${activeCat.icon} ${activeCat.name}` : "Kategori Seç"}
        </button>

        {mobileOpen && (
          <div className="md:hidden bg-white rounded-2xl border border-gray-100 shadow-sm mb-5 overflow-x-auto">
            <div className="flex gap-2 p-4">
              <button onClick={() => { setActiveCatId(null); setMobileOpen(false); }}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold border flex-shrink-0 transition-all ${!activeCatId ? "bg-[#07446c] text-white border-[#07446c]" : "border-gray-200 text-gray-600"}`}>
                Tümü ({products.length})
              </button>
              {categories.map(cat => (
                <button key={cat.id} onClick={() => { setActiveCatId(cat.id); setMobileOpen(false); }}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold border flex-shrink-0 transition-all ${activeCatId === cat.id ? "bg-[#07446c] text-white border-[#07446c]" : "border-gray-200 text-gray-600"}`}>
                  {cat.icon} {cat.name} ({countByCat[cat.id] ?? 0})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Boş durum */}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 py-20 flex flex-col items-center gap-4 text-center">
            <div className="text-6xl opacity-20">📦</div>
            <p className="text-gray-400 text-sm font-medium">Bu kategoride henüz ürün bulunmuyor.</p>
            <button onClick={() => setActiveCatId(null)} className="text-[#0f75bc] text-sm font-bold hover:underline">
              Tüm ürünleri gör →
            </button>
          </div>
        )}

        {/* IZGARA */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {filtered.map(p => <AmbalajCard key={p.id} product={p} categories={categories} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function AmbalajCard({ product: p, categories }: { product: AmbalajProduct; categories: AmbalajCategory[] }) {
  const cat = categories.find(c => c.id === p.category_id);
  const features = (p.features ?? "").split("\n").map(l => l.trim()).filter(Boolean);

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#bae6fd] hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden">
      {/* Görsel */}
      <div className="relative h-48 bg-gradient-to-br from-[#e8f4fc] to-[#ddf0fb] overflow-hidden">
        {p.image_url ? (
          <Image src={p.image_url} alt={p.name} fill sizes="(max-width:768px) 50vw, 33vw"
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">📦</div>
        )}
      </div>

      {/* Bilgi */}
      <div className="p-4 flex flex-col flex-1">
        {cat && (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#25aae1] uppercase tracking-wider mb-1.5">
            <Tag size={8} />{cat.icon} {cat.name}
          </span>
        )}
        <h3 className="text-sm font-bold text-[#07446c] leading-snug group-hover:text-[#0f75bc] transition-colors flex-1">
          {p.name}
        </h3>

        {p.description && (
          <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">{p.description}</p>
        )}

        {/* Ebatlar */}
        {(p.width || p.height || p.depth) && (
          <div className="mt-2.5 flex items-center gap-1 text-xs font-mono text-[#07446c] bg-blue-50 px-2 py-1 rounded-lg w-fit">
            <Ruler size={10} className="shrink-0 text-[#0f75bc]" />
            {[p.width, p.height, p.depth].filter(Boolean).join(" × ")} cm
          </div>
        )}

        {/* Özellikler (ilk 2) */}
        {features.length > 0 && (
          <ul className="mt-2.5 space-y-0.5">
            {features.slice(0, 2).map((f, i) => (
              <li key={i} className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <span className="w-1 h-1 rounded-full bg-[#0f75bc] shrink-0" />
                {f}
              </li>
            ))}
            {features.length > 2 && (
              <li className="text-[11px] text-[#0f75bc] font-semibold">+{features.length - 2} özellik daha</li>
            )}
          </ul>
        )}

        <div className="mt-3 pt-3 border-t border-gray-50">
          <a href={`tel:+905541630031`}
            className="flex items-center justify-center gap-1.5 w-full bg-[#0f75bc] hover:bg-[#07446c] text-white text-xs font-bold py-2 rounded-xl transition-colors">
            <Package size={12} /> Fiyat Teklifi Al
          </a>
        </div>
      </div>
    </div>
  );
}
