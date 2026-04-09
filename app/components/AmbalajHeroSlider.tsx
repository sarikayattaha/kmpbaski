"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";

const SLIDES = [
  {
    badge:     "Özel Ambalaj Çözümleri",
    title:     "Markanızı Yansıtan",
    highlight: "Ambalaj Tasarımları",
    subtitle:  "Pastane kutularından fast food ambalajlarına, özel ebat ve tasarımlarla markanıza özel baskılı ambalaj çözümleri üretiyoruz.",
    from:      "#07446c",
    to:        "#0a5a8a",
    waText:    "Merhaba, ambalaj ürünleri hakkında bilgi almak istiyorum.",
    emoji:     "📦",
  },
  {
    badge:     "Pastane & Tatlıcı Grubu",
    title:     "Pastane ve Tatlıcılar İçin",
    highlight: "Sızdırmaz Çözümler",
    subtitle:  "Baklava kutusundan pasta kutusuna, ürünlerinizi koruyacak ve markanızı yansıtacak özel ambalaj çözümleri.",
    from:      "#1a3a5c",
    to:        "#0e4f70",
    waText:    "Merhaba, pastane ambalaj çözümleri hakkında bilgi almak istiyorum.",
    emoji:     "🎂",
  },
  {
    badge:     "Hızlı & Kaliteli Üretim",
    title:     "Hızlı Teslimat ve",
    highlight: "Kaliteli Baskı Güvencesi",
    subtitle:  "Siparişinizi zamanında teslim ediyor, renk tutarlılığı ve baskı kalitesiyle fark yaratıyoruz.",
    from:      "#0c3b5e",
    to:        "#1a5276",
    waText:    "Merhaba, ambalaj siparişi vermek istiyorum.",
    emoji:     "🚀",
  },
];

const INTERVAL = 5000;

export default function AmbalajHeroSlider() {
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);

  const next = useCallback(() => setCurrent(c => (c + 1) % SLIDES.length), []);
  const prev = useCallback(() => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, INTERVAL);
    return () => clearInterval(t);
  }, [next, paused]);

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ─── Slaytlar ─────────────────────────────────── */}
      <div className="relative min-h-[300px] md:min-h-[380px]">
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 text-white transition-opacity duration-700 ${
              i === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
            style={{ background: `linear-gradient(135deg, ${s.from}, ${s.to})` }}
          >
            <div className="max-w-7xl mx-auto px-6 h-full min-h-[300px] md:min-h-[380px] flex items-center">
              <div className="flex-1 py-10 md:py-14">
                <span className="inline-block text-xs font-bold text-[#25aae1] uppercase tracking-widest mb-3">
                  {s.badge}
                </span>
                <h1 className="text-2xl md:text-4xl font-black leading-tight mb-4">
                  {s.title}<br />
                  <span className="text-[#25aae1]">{s.highlight}</span>
                </h1>
                <p className="text-blue-200 text-sm md:text-base max-w-lg leading-relaxed">
                  {s.subtitle}
                </p>
                <a
                  href={`https://wa.me/905541630031?text=${encodeURIComponent(s.waText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold px-6 py-3 rounded-2xl transition-colors shadow-lg text-sm"
                >
                  <MessageCircle size={17} /> WhatsApp ile Teklif Al
                </a>
              </div>
              <div className="text-8xl md:text-9xl opacity-10 hidden md:block select-none pl-8 flex-shrink-0">
                {s.emoji}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Sol ok ──────────────────────────────────────── */}
      <button
        onClick={prev}
        aria-label="Önceki slayt"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
      >
        <ChevronLeft size={20} />
      </button>

      {/* ─── Sağ ok ──────────────────────────────────────── */}
      <button
        onClick={next}
        aria-label="Sonraki slayt"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      {/* ─── Noktalar ────────────────────────────────────── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slayt ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
