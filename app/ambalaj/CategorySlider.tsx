"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MessageCircle, Eye, X, Ruler, CheckCircle2 } from "lucide-react";
import type { AmbalajProduct } from "@/lib/supabase";

export default function CategorySlider({ products }: { products: AmbalajProduct[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [modalProduct, setModalProduct] = useState<AmbalajProduct | null>(null);

  const scroll = (dir: "left" | "right") => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir === "right" ? 268 : -268, behavior: "smooth" });
  };

  return (
    <>
      <div className="relative group/slider">
        {/* ← Önceki */}
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

        {/* → Sonraki */}
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

        {/* Track */}
        <div
          ref={ref}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map(p => (
            <ProductCard key={p.id} product={p} onInspect={() => setModalProduct(p)} />
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalProduct && (
        <ProductModal product={modalProduct} onClose={() => setModalProduct(null)} />
      )}
    </>
  );
}

/* ─── Kart ─────────────────────────────────────────── */
function ProductCard({ product: p, onInspect }: { product: AmbalajProduct; onInspect: () => void }) {
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

        {/* Butonlar */}
        <div className="mt-3 flex gap-2">
          <button
            onClick={onInspect}
            className="
              flex-1 flex items-center justify-center gap-1.5
              border border-gray-300 text-gray-700 text-xs font-semibold
              py-2.5 rounded-xl transition-colors
              hover:bg-gray-100 hover:border-gray-400
            "
          >
            <Eye size={13} /> İncele
          </button>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe57] text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
          >
            <MessageCircle size={13} /> Teklif Al
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Modal ─────────────────────────────────────────── */
function ProductModal({ product: p, onClose }: { product: AmbalajProduct; onClose: () => void }) {
  const features = (p.features ?? "").split("\n").map(l => l.trim()).filter(Boolean);
  const hasDims  = p.width || p.height || p.depth;
  const waLink   = `https://wa.me/905541630031?text=${encodeURIComponent(
    `Merhaba, "${p.name}" ürünü hakkında fiyat teklifi almak istiyorum.`
  )}`;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Kapat */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Görsel */}
        {p.image_url && (
          <div className="relative h-56 bg-gradient-to-br from-[#f0f7ff] to-[#e0f2fe] rounded-t-3xl overflow-hidden">
            <Image src={p.image_url} alt={p.name} fill sizes="512px" className="object-contain p-8" />
          </div>
        )}

        <div className="p-6 space-y-5">
          {/* Başlık */}
          <h2 className="text-xl font-black text-[#07446c] leading-snug pr-8">{p.name}</h2>

          {/* Açıklama */}
          {p.description && (
            <p className="text-sm text-gray-600 leading-relaxed">{p.description}</p>
          )}

          {/* Özellikler */}
          {features.length > 0 && (
            <div>
              <h3 className="text-xs font-black text-[#07446c] uppercase tracking-wide mb-2.5">
                Teknik Özellikler
              </h3>
              <ul className="space-y-1.5">
                {features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 size={14} className="text-[#0f75bc] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Ebatlar */}
          {hasDims && (
            <div>
              <h3 className="text-xs font-black text-[#07446c] uppercase tracking-wide mb-2.5">
                Varsayılan Ebatlar
              </h3>
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2.5 rounded-xl w-fit">
                <Ruler size={15} className="text-[#0f75bc]" />
                <span className="font-mono font-bold text-[#07446c] text-sm">
                  {[p.width, p.height, p.depth].filter(Boolean).join(" × ")} cm
                </span>
              </div>
            </div>
          )}

          {/* CTA */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold py-3.5 rounded-2xl transition-colors shadow-md text-sm"
          >
            <MessageCircle size={16} /> Şimdi Teklif Al
          </a>
        </div>
      </div>
    </div>
  );
}
