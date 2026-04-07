"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  Search, User, ShoppingCart, Phone, Mail, Clock,
  Menu, X, ChevronDown, AlignJustify, ArrowRight,
} from "lucide-react";

/* ─── MEGA MENÜ VERİSİ ─── */
const megaCategories = [
  {
    label: "Kartvizitler",
    items: [
      "Standart Kartvizit", "Sıvama Kartvizit", "Kabartma Laklı Kartvizit",
      "Kraft Kartvizit", "Gofreli Kartvizit", "Kare Kartvizit",
      "Katlamalı Kartvizit", "Oval Kartvizit", "PVC Kaplı Kartvizit",
      "Takvimli Kartvizit", "Tuale Fantazi Kartvizit", "Varak Yaldızlı Kartvizit",
    ],
  },
  {
    label: "El İlanları ve Broşürler",
    items: [
      "Ekonomik El İlanı", "El İlanı", "Kapı Askısı El İlanı", "Broşür",
      "3'lü Katlama Broşür", "Z Katlama Broşür",
    ],
  },
  {
    label: "Kurumsal Ürünler",
    items: [
      "Antetli Kağıt", "Zarflar", "Klasör & Dosya", "Bloknot",
      "Dosya Kapağı", "Teklif Dosyası", "Fatura Formu", "İrsaliye Formu",
    ],
  },
  {
    label: "Reklam Ürünleri",
    items: [
      "Sticker / Etiket Baskı", "Magnet Çeşitleri", "Çantalar / Poşetler",
      "Bardak Altlıkları", "Mouse Padler", "İmsakiyeler", "Diğer Reklam Ürünleri",
    ],
  },
  {
    label: "Promosyon Ürünleri",
    items: [
      "Logolu Kalem", "Defter Baskı", "Ajanda", "Post-it",
      "Bez Çanta", "T-Shirt Baskı", "Masa Takvimi", "Duvar Takvimi",
    ],
  },
  {
    label: "Restoran / Cafe Ürünleri",
    items: [
      "Menü Kartları", "Amerikan Servis", "Peçete Baskı",
      "Şeker Paketi", "Bardak Altlığı", "Yemek Listesi",
    ],
  },
  {
    label: "İç-Dış Mekan Reklam",
    items: [
      "Branda Baskı", "Afiş & Poster", "Roll-Up Banner",
      "X-Banner", "Fuar Standı", "Araç Giydirme", "Cam Folyo",
    ],
  },
  {
    label: "Ambalaj ve Paketleme",
    items: [
      "Karton Kutu", "Kraft Kutu", "Hediye Kutusu",
      "Kağıt Torba", "Kraft Kese", "Rulo Etiket", "Şeffaf Etiket",
    ],
  },
];

/* Sağda gösterilecek ürün isimleri (kategori index → 3-6 ürün) */
const megaFeatured: Record<number, string[]> = {
  0: ["Sıvama Kartvizit", "Kabartma Laklı Kartvizit", "Yumuşak Dokulu Kartvizit", "Kare Kartvizit", "Kraft Kartvizit", "Oval Kartvizit"],
  1: ["Ekonomik El İlanı", "El İlanı", "Broşür", "Kapı Askısı El İlanı"],
  2: ["Antetli Kağıt", "Zarflar", "Bloknot", "Fatura Formu", "Teklif Dosyası", "Klasör"],
  3: ["Kuşe Sticker", "Magnet Baskı", "Spiralli Masa Takvimi", "Afiş / Poster", "Ürün Etiketi", "Oto Kokusu"],
  4: ["Logolu Kalem", "Defter Baskı", "Masa Takvimi", "Bez Çanta", "Ajanda", "Post-it"],
  5: ["Menü Kartları", "Amerikan Servis", "Bardak Altlığı", "Peçete Baskı"],
  6: ["Branda Baskı", "Roll-Up Banner", "Afiş", "X-Banner", "Fuar Standı", "Araç Giydirme"],
  7: ["Karton Kutu", "Kraft Kese", "Hediye Kutusu", "Rulo Etiket", "Şeffaf Etiket", "Kağıt Torba"],
};

const quickLinks = [
  { label: "Ekspres Baskı", href: "#" },
  { label: "Kartvizitler", href: "#" },
  { label: "Fotoğraf Baskı", href: "#" },
  { label: "Sticker / Etiket", href: "#" },
  { label: "Yeni Ürünler", href: "#", highlight: true },
  { label: "Kampanyalar", href: "#", highlight: true },
];

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  /* Gecikmeli kapama — fare butón→panel arası geçerken kapanmasın */
  const openMega = () => {
    clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    closeTimer.current = setTimeout(() => {
      setMegaOpen(false);
      setActiveCategory(0);
    }, 120);
  };

  const featured = megaFeatured[activeCategory] ?? [];
  const activeCat = megaCategories[activeCategory];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">

      {/* ── TOP BAR ── */}
      <div className="bg-[#07446c] text-blue-100 text-xs py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-5">
            <a href="tel:08500000000" className="flex items-center gap-1 hover:text-white transition-colors">
              <Phone size={11} /> 0850 000 00 00
            </a>
            <a href="mailto:info@kmpbaski.com" className="flex items-center gap-1 hover:text-white transition-colors">
              <Mail size={11} /> info@kmpbaski.com
            </a>
          </div>
          <span className="flex items-center gap-1 text-[#25aae1]">
            <Clock size={11} /> Pzt – Cum: 08:00 – 18:00
          </span>
        </div>
      </div>

      {/* ── ANA HEADER: Logo | Arama | Giriş + Sepet ── */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-5">

          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <Image src="/kmpbaskilogo.png" alt="KMP Baskı" width={40} height={40}
              className="object-contain h-10 w-auto" priority />
            <span className="text-xl font-black tracking-tight leading-none">
              <span className="text-[#07446c]">KMP</span>
              <span className="text-[#25aae1]"> BASKI</span>
            </span>
          </a>

          {/* Arama */}
          <div className="flex-1 relative">
            <input
              type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Ne bastırmak istiyorsunuz?"
              className="w-full h-10 pl-4 pr-12 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f75bc] focus:border-transparent transition-all"
            />
            <button className="absolute right-0 top-0 h-10 w-12 flex items-center justify-center bg-[#0f75bc] hover:bg-[#07446c] text-white rounded-r-xl transition-colors">
              <Search size={17} />
            </button>
          </div>

          {/* Giriş + Sepet */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <a href="#" className="hidden md:flex items-center gap-2 px-3 py-2 text-[#07446c] hover:text-[#0f75bc] transition-colors">
              <User size={20} />
              <span className="text-sm font-medium">Giriş Yap</span>
            </a>
            <a href="#" className="relative flex items-center gap-2 bg-[#0f75bc] hover:bg-[#07446c] text-white px-4 py-2 rounded-xl transition-colors">
              <ShoppingCart size={18} />
              <span className="text-sm font-bold hidden md:block">Sepetim</span>
              <span className="bg-white text-[#0f75bc] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">0</span>
            </a>
            <button className="md:hidden p-2 rounded-lg text-[#07446c] hover:bg-blue-50 transition-colors ml-1"
              onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── KATEGORİ BARI + MEGA MENÜ PANEL ──
          position:relative burada — panel bu div'e göre absolute açılır.
          onMouseLeave burada — fare hem butondan hem panelden çıkınca kapanır.
      ── */}
      <div
        className="hidden md:block bg-white border-b border-gray-100 relative"
        onMouseLeave={closeMega}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center h-11 gap-1">

          {/* Tüm Ürünler butonu */}
          <button
            onMouseEnter={() => { openMega(); }}
            className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-sm rounded-lg font-bold transition-colors flex-shrink-0
              ${megaOpen ? "bg-[#0f75bc] text-white" : "bg-[#e0f2fe] text-[#07446c] hover:bg-[#bae6fd]"}`}
          >
            <AlignJustify size={14} />
            Tüm Ürünler
            <ChevronDown size={13} className={`transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Hızlı linkler */}
          {quickLinks.map((cat, i) => (
            <a key={i} href={cat.href}
              className={`whitespace-nowrap px-3 py-1.5 text-sm rounded-lg font-medium transition-colors
                ${cat.highlight ? "text-[#0f75bc] font-semibold hover:bg-blue-50" : "text-gray-600 hover:text-[#0f75bc] hover:bg-blue-50"}`}>
              {cat.label}
            </a>
          ))}
        </div>

        {/* ── MEGA PANEL ──
            top-full → kategori barının hemen altı
            left-0 right-0 → tam genişlik
            onMouseEnter → fareyle üstüne gelince kapanma zamanlayıcısını iptal et
        ── */}
        {megaOpen && (
          <div
            className="absolute top-full left-0 right-0 bg-white border-t border-b border-gray-200 shadow-xl"
            style={{ zIndex: 9999 }}
            onMouseEnter={openMega}
          >
            <div className="max-w-7xl mx-auto flex" style={{ minHeight: 340 }}>

              {/* SOL — Kategori listesi */}
              <div className="w-64 border-r border-gray-100 py-2 flex-shrink-0">
                {megaCategories.map((cat, idx) => (
                  <button
                    key={idx}
                    onMouseEnter={() => setActiveCategory(idx)}
                    className={`w-full text-left px-5 py-2.5 text-sm transition-colors
                      ${activeCategory === idx
                        ? "bg-blue-50 text-[#0f75bc] font-semibold"
                        : "text-gray-700 hover:bg-gray-50 font-normal"}`}
                  >
                    {cat.label}
                  </button>
                ))}
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <a href="#" className="block px-5 py-2.5 text-sm text-gray-500 hover:bg-gray-50 transition-colors">
                    Tüm Ürünler
                  </a>
                </div>
              </div>

              {/* ORTA — Ürün linkleri */}
              <div className="flex-1 px-8 py-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{activeCat.label}</h3>
                <div className="grid grid-cols-3 gap-x-8 gap-y-2 mb-6">
                  {activeCat.items.map((item, ii) => (
                    <a key={ii} href="#"
                      className="text-sm text-gray-600 hover:text-[#0f75bc] py-0.5 transition-colors">
                      {item}
                    </a>
                  ))}
                </div>
                <a href="#"
                  className="inline-flex items-center gap-2 border border-gray-300 hover:border-[#0f75bc] hover:text-[#0f75bc] text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                  Tüm {activeCat.label} Ürünleri <ArrowRight size={14} />
                </a>
              </div>

              {/* SAĞ — Öne çıkan ürün kartları */}
              <div className="w-72 border-l border-gray-100 py-6 px-4 flex-shrink-0">
                <div className="grid grid-cols-3 gap-2">
                  {featured.slice(0, 6).map((name, fi) => (
                    <a key={fi} href="#"
                      className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 transition-colors group">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center overflow-hidden">
                        <span className="text-2xl opacity-40 group-hover:opacity-60 transition-opacity">🖨️</span>
                      </div>
                      <p className="text-[10px] text-center text-gray-500 group-hover:text-[#0f75bc] leading-tight transition-colors line-clamp-2">
                        {name}
                      </p>
                    </a>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* ── MOBİL MENÜ ── */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
          <div className="relative mb-3">
            <input type="text" placeholder="Ne bastırmak istiyorsunuz?"
              className="w-full h-10 pl-4 pr-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc]" />
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <p className="text-[10px] font-bold text-[#25aae1] uppercase tracking-widest px-2 mb-1">Kategoriler</p>
          {megaCategories.map((cat, i) => (
            <a key={i} href="#"
              className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0f75bc] transition-colors font-medium">
              {cat.label}
            </a>
          ))}
          <div className="border-t border-gray-100 pt-2 mt-2">
            {quickLinks.map((cat, i) => (
              <a key={i} href="#"
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${cat.highlight ? "text-[#0f75bc]" : "text-gray-700"} hover:bg-blue-50`}>
                {cat.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
