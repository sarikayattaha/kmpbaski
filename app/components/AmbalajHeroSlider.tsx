"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { supabase, type AmbalajBanner } from "@/lib/supabase";

export default function AmbalajHeroSlider() {
  const [banners, setBanners] = useState<AmbalajBanner[]>([]);
  const [current, setCurrent] = useState(0);
  const [imgIndex, setImgIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("ambalaj_banners")
      .select("*")
      .order("order_index", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setBanners(data as AmbalajBanner[]);
        setLoading(false);
      });
  }, []);

  // Banner değişince görsel index sıfırla
  useEffect(() => { setImgIndex(0); }, [current]);

  const next = useCallback(() => setCurrent(c => (c + 1) % banners.length), [banners.length]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + banners.length) % banners.length), [banners.length]);

  // Banner otomatik kaydırma
  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [banners.length, next]);

  // Görsel otomatik kaydırma (banner içindeki görseller)
  useEffect(() => {
    const b = banners[current];
    if (!b || !b.images || b.images.length <= 1) return;
    const t = setInterval(() => setImgIndex(i => (i + 1) % b.images.length), 3000);
    return () => clearInterval(t);
  }, [banners, current]);

  if (loading) {
    return (
      <div className="w-full h-[420px] bg-slate-50 animate-pulse flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0f75bc] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (banners.length === 0) return <FallbackBanner />;

  const b = banners[current];
  const images = b.images ?? [];
  const currentImg = images[imgIndex] ?? null;

  return (
    <section className="relative w-full bg-gradient-to-br from-slate-50 via-white to-[#e0f2fe] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-14 flex flex-col lg:flex-row items-center gap-10 min-h-[400px]">

        {/* SOL — Metin */}
        <div className="flex-1 z-10">
          <h2 className="text-4xl md:text-5xl font-black text-[#07446c] leading-tight mb-4">
            {b.title}
          </h2>
          {b.subtitle && (
            <p className="text-lg text-[#25aae1] font-medium mb-8 max-w-md leading-relaxed">
              {b.subtitle}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            {b.button_text && b.button_link && (
              <a
                href={b.button_link}
                className="inline-flex items-center gap-2.5 bg-[#0f75bc] hover:bg-[#07446c] text-white font-bold px-7 py-3.5 rounded-2xl transition-colors shadow-lg shadow-[#0f75bc]/25 text-sm"
              >
                {b.button_text}
              </a>
            )}
            <a
              href="https://wa.me/905541630031?text=Merhaba%2C%20ambalaj%20%C3%BCr%C3%BCnleri%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold px-7 py-3.5 rounded-2xl transition-colors shadow-lg text-sm"
            >
              <MessageCircle size={16} /> WhatsApp ile Teklif Al
            </a>
          </div>
        </div>

        {/* SAG — Gorsel */}
        <div className="flex-1 flex items-center justify-center relative">
          <div className="absolute w-[340px] h-[340px] bg-[#0f75bc]/8 rounded-full" />
          <div className="absolute w-[260px] h-[260px] bg-[#25aae1]/10 rounded-full translate-x-6 translate-y-4" />

          {currentImg ? (
            <div className="relative z-10 drop-shadow-2xl" style={{ transform: "perspective(800px) rotateY(-8deg) rotateX(2deg)" }}>
              <Image
                key={`${current}-${imgIndex}`}
                src={currentImg}
                alt={b.title}
                width={420}
                height={320}
                sizes="(max-width: 1024px) 90vw, 420px"
                fetchPriority={current === 0 && imgIndex === 0 ? "high" : "low"}
                loading={current === 0 && imgIndex === 0 ? "eager" : "lazy"}
                className="object-contain max-h-[300px] w-auto rounded-2xl transition-opacity duration-700"
              />
              {/* Görsel nokta indikatörleri */}
              {images.length > 1 && (
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button key={i} onClick={() => setImgIndex(i)}
                      className={`rounded-full transition-all duration-300 ${i === imgIndex ? "w-4 h-1.5 bg-[#0f75bc]" : "w-1.5 h-1.5 bg-[#0f75bc]/30 hover:bg-[#0f75bc]/60"}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="relative z-10 w-72 h-56 bg-gradient-to-br from-[#e0f2fe] to-[#bae6fd] rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-6xl opacity-10">■</span>
            </div>
          )}
        </div>
      </div>

      {/* Banner okları */}
      {banners.length > 1 && (
        <>
          <button onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-md flex items-center justify-center text-[#07446c] transition-all hover:scale-110 z-20">
            <ChevronLeft size={20} />
          </button>
          <button onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-md flex items-center justify-center text-[#07446c] transition-all hover:scale-110 z-20">
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {banners.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
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

function FallbackBanner() {
  return (
    <section className="w-full bg-gradient-to-br from-slate-50 via-white to-[#e0f2fe] border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-6 py-14 flex flex-col lg:flex-row items-center gap-10 min-h-[400px]">
        <div className="flex-1">
          <h2 className="text-4xl md:text-5xl font-black text-[#07446c] leading-tight mb-4">
            Markanızı Yansıtan Ambalaj Tasarımları
          </h2>
          <p className="text-lg text-[#25aae1] font-medium mb-8 max-w-md leading-relaxed">
            Özel ebat ve baskı seçenekleriyle markanıza özel ambalaj çözümleri üretiyoruz.
          </p>
          <a href="https://wa.me/905541630031?text=Merhaba%2C%20ambalaj%20%C3%BCr%C3%BCnleri%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold px-7 py-3.5 rounded-2xl transition-colors shadow-lg text-sm">
            <MessageCircle size={16} /> WhatsApp ile Teklif Al
          </a>
        </div>
        <div className="flex-1 flex items-center justify-center relative">
          <div className="absolute w-[340px] h-[340px] bg-[#0f75bc]/8 rounded-full" />
          <div className="w-72 h-56 bg-gradient-to-br from-[#e0f2fe] to-[#bae6fd] rounded-2xl flex items-center justify-center shadow-xl relative z-10">
            <span className="text-6xl opacity-10">■</span>
          </div>
        </div>
      </div>
    </section>
  );
}
