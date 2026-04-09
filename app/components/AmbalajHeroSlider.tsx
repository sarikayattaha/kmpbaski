"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { supabase, type AmbalajBanner } from "@/lib/supabase";

const FALLBACK: AmbalajBanner[] = [
  { id: "1", badge: "Özel Ambalaj Çözümleri", title: "Markanızı Yansıtan", highlight: "Ambalaj Tasarımları", subtitle: "Pastane kutularından fast food ambalajlarına, özel ebat ve tasarımlarla markanıza özel baskılı ambalaj çözümleri üretiyoruz.", from_color: "#07446c", to_color: "#0a5a8a", image_url: "", button_text: "", button_link: "", wa_text: "Merhaba, ambalaj ürünleri hakkında bilgi almak istiyorum.", order_index: 0, is_active: true, created_at: "" },
  { id: "2", badge: "Pastane & Tatlıcı Grubu", title: "Pastane ve Tatlıcılar İçin", highlight: "Sızdırmaz Çözümler", subtitle: "Baklava kutusundan pasta kutusuna, ürünlerinizi koruyacak ve markanızı yansıtacak özel ambalaj çözümleri.", from_color: "#1a3a5c", to_color: "#0e4f70", image_url: "", button_text: "", button_link: "", wa_text: "Merhaba, pastane ambalaj çözümleri hakkında bilgi almak istiyorum.", order_index: 1, is_active: true, created_at: "" },
  { id: "3", badge: "Hızlı & Kaliteli Üretim", title: "Hızlı Teslimat ve", highlight: "Kaliteli Baskı Güvencesi", subtitle: "Siparişinizi zamanında teslim ediyor, renk tutarlılığı ve baskı kalitesiyle fark yaratıyoruz.", from_color: "#0c3b5e", to_color: "#1a5276", image_url: "", button_text: "", button_link: "", wa_text: "Merhaba, ambalaj siparişi vermek istiyorum.", order_index: 2, is_active: true, created_at: "" },
];

const INTERVAL = 5000;

export default function AmbalajHeroSlider() {
  const [slides,  setSlides]  = useState<AmbalajBanner[]>(FALLBACK);
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);

  useEffect(() => {
    supabase
      .from("ambalaj_banners")
      .select("*")
      .eq("is_active", true)
      .order("order_index", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setSlides(data as AmbalajBanner[]);
      });
  }, []);

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, INTERVAL);
    return () => clearInterval(t);
  }, [next, paused]);

  useEffect(() => { setCurrent(0); }, [slides.length]);

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Slaytlar ── */}
      <div className="relative min-h-[300px] md:min-h-[380px]">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`absolute inset-0 text-white transition-opacity duration-700 ${
              i === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
            style={{ background: `linear-gradient(135deg, ${s.from_color}, ${s.to_color})` }}
          >
            <div className="max-w-7xl mx-auto px-6 h-full min-h-[300px] md:min-h-[380px] flex items-center gap-8">

              {/* Metin */}
              <div className="flex-1 py-10 md:py-14">
                {s.badge && (
                  <span className="inline-block text-xs font-bold text-[#25aae1] uppercase tracking-widest mb-3">
                    {s.badge}
                  </span>
                )}
                <h1 className="text-2xl md:text-4xl font-black leading-tight mb-4">
                  {s.title}<br />
                  {s.highlight && <span className="text-[#25aae1]">{s.highlight}</span>}
                </h1>
                {s.subtitle && (
                  <p className="text-blue-200 text-sm md:text-base max-w-lg leading-relaxed mb-6">
                    {s.subtitle}
                  </p>
                )}

                {/* Butonlar */}
                <div className="flex flex-wrap gap-3">
                  {/* Özel buton (varsa) */}
                  {s.button_text && s.button_link && (
                    <a
                      href={s.button_link}
                      className="inline-flex items-center gap-2 bg-white text-[#07446c] hover:bg-blue-50 font-bold px-6 py-3 rounded-2xl transition-colors shadow-lg text-sm"
                    >
                      {s.button_text}
                    </a>
                  )}
                  {/* WhatsApp butonu */}
                  <a
                    href={`https://wa.me/905541630031?text=${encodeURIComponent(
                      s.wa_text || "Merhaba, ambalaj ürünleri hakkında bilgi almak istiyorum."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold px-6 py-3 rounded-2xl transition-colors shadow-lg text-sm"
                  >
                    <MessageCircle size={17} /> WhatsApp ile Teklif Al
                  </a>
                </div>
              </div>

              {/* Görsel (varsa, masaüstünde sağ tarafta) */}
              {s.image_url && (
                <div className="hidden md:flex flex-shrink-0 w-64 lg:w-80 h-56 lg:h-72 relative">
                  <Image
                    src={s.image_url}
                    alt={s.title}
                    fill
                    sizes="320px"
                    className="object-contain drop-shadow-2xl"
                    priority={i === 0}
                  />
                </div>
              )}

            </div>
          </div>
        ))}
      </div>

      {/* ── Sol ok ── */}
      {slides.length > 1 && (
        <button onClick={prev} aria-label="Önceki slayt"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
          <ChevronLeft size={20} />
        </button>
      )}

      {/* ── Sağ ok ── */}
      {slides.length > 1 && (
        <button onClick={next} aria-label="Sonraki slayt"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
          <ChevronRight size={20} />
        </button>
      )}

      {/* ── Noktalar ── */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} aria-label={`Slayt ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
