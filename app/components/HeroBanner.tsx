"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { supabase, type Banner } from "@/lib/supabase";

export default function HeroBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      supabase
        .from("banners")
        .select("*")
        .order("order_index", { ascending: true })
        .then(({ data }: { data: Banner[] | null }) => {
          if (data && data.length > 0) setBanners(data);
          setLoading(false);
        });
    } catch {
      setLoading(false);
    }
  }, []);

  const next = useCallback(() => setCurrent((c) => (c + 1) % banners.length), [banners.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + banners.length) % banners.length), [banners.length]);

  // Otomatik kaydırma
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [banners.length, next]);

  if (loading) {
    return (
      <div className="w-full h-[180px] md:h-[420px] bg-slate-50 animate-pulse flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0f75bc] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (banners.length === 0) {
    return <FallbackBanner />;
  }

  const b = banners[current];

  return (
    <section className="relative w-full bg-gradient-to-br from-slate-50 via-white to-[#e0f2fe] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 lg:py-14 flex flex-col lg:flex-row items-center gap-6 lg:gap-10 min-h-[220px] lg:min-h-[400px]">

        {/* SOL — Metin */}
        <div className="flex-1 z-10 text-center lg:text-left">
          <p className="text-xs font-bold text-[#25aae1] uppercase tracking-widest mb-2 md:mb-3">
            Öne Çıkan Ürün
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#07446c] leading-tight mb-3 md:mb-4">
            {b.title}
          </h2>
          {b.subtitle && (
            <p className="text-base md:text-lg text-[#25aae1] font-medium mb-5 md:mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
              {b.subtitle}
            </p>
          )}
          <a
            href={b.button_link || "#"}
            className="inline-flex items-center gap-2 bg-[#0f75bc] hover:bg-[#07446c] text-white font-bold px-5 py-3 md:px-7 md:py-3.5 rounded-2xl transition-colors shadow-lg shadow-[#0f75bc]/25 text-sm"
          >
            <ShoppingCart size={16} />
            {b.button_text || "Hemen Sipariş Ver"}
          </a>
        </div>

        {/* SAĞ — Görsel */}
        <div className="flex-1 flex items-center justify-center relative">
          {/* Dekoratif arka plan dairesi */}
          <div className="absolute w-[180px] h-[180px] md:w-[340px] md:h-[340px] bg-[#0f75bc]/8 rounded-full" />
          <div className="absolute w-[130px] h-[130px] md:w-[260px] md:h-[260px] bg-[#25aae1]/10 rounded-full translate-x-4 translate-y-3 md:translate-x-6 md:translate-y-4" />

          {b.image_url ? (
            <div className="relative z-10 drop-shadow-2xl" style={{ transform: "perspective(800px) rotateY(-8deg) rotateX(2deg)" }}>
              <Image
                src={b.image_url}
                alt={b.title}
                width={420}
                height={320}
                sizes="(max-width: 1024px) 90vw, 420px"
                fetchPriority={current === 0 ? "high" : "low"}
                loading={current === 0 ? "eager" : "lazy"}
                className="object-contain max-h-[150px] md:max-h-[260px] lg:max-h-[300px] w-auto rounded-2xl"
              />
            </div>
          ) : (
            <div className="relative z-10 w-48 h-36 md:w-72 md:h-56 bg-gradient-to-br from-[#e0f2fe] to-[#bae6fd] rounded-2xl flex items-center justify-center shadow-xl">
              <ShoppingCart size={40} className="text-[#0f75bc]/40 md:w-16 md:h-16" />
            </div>
          )}
        </div>
      </div>

      {/* Carousel kontrolleri */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-md flex items-center justify-center text-[#07446c] transition-all hover:scale-110 z-20"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-md flex items-center justify-center text-[#07446c] transition-all hover:scale-110 z-20"
          >
            <ChevronRight size={20} />
          </button>

          {/* Nokta navigasyonu */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current ? "w-6 h-2 bg-[#0f75bc]" : "w-2 h-2 bg-[#0f75bc]/30 hover:bg-[#0f75bc]/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

/* Supabase'de henüz banner yoksa gösterilecek varsayılan alan */
function FallbackBanner() {
  return (
    <section className="w-full bg-gradient-to-br from-slate-50 via-white to-[#e0f2fe] border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 lg:py-14 flex flex-col lg:flex-row items-center gap-6 lg:gap-10 min-h-[220px] lg:min-h-[400px]">
        <div className="flex-1 text-center lg:text-left">
          <p className="text-xs font-bold text-[#25aae1] uppercase tracking-widest mb-2 md:mb-3">Öne Çıkan Ürün</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#07446c] leading-tight mb-3 md:mb-4">
            Profesyonel Baskı<br />Çözümleri
          </h2>
          <p className="text-base md:text-lg text-[#25aae1] font-medium mb-5 md:mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
            Yüksek kaliteli baskı hizmetleri ile markanızı öne çıkarın.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-[#0f75bc] hover:bg-[#07446c] text-white font-bold px-5 py-3 md:px-7 md:py-3.5 rounded-2xl transition-colors shadow-lg shadow-[#0f75bc]/25 text-sm"
          >
            <ShoppingCart size={16} />
            Hemen Sipariş Ver
          </a>
        </div>
        <div className="flex-1 flex items-center justify-center relative">
          <div className="absolute w-[340px] h-[340px] bg-[#0f75bc]/8 rounded-full" />
          <div className="w-72 h-56 bg-gradient-to-br from-[#e0f2fe] to-[#bae6fd] rounded-2xl flex items-center justify-center shadow-xl relative z-10">
            <ShoppingCart size={64} className="text-[#0f75bc]/40" />
          </div>
        </div>
      </div>
    </section>
  );
}
