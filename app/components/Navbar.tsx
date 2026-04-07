"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Search,
  User,
  ShoppingCart,
  Phone,
  Mail,
  Clock,
  Menu,
  X,
  ChevronDown,
  AlignJustify,
  ArrowRight,
  Layers,
  BookOpen,
  Printer,
  ImageIcon,
  Package,
  Gift,
} from "lucide-react";

/* ── MEGA MENÜ VERİSİ ── */
const megaCategories = [
  {
    category: "Kartvizitler",
    icon: <Layers size={15} />,
    subgroups: [
      { title: "Standart", items: ["Selofanlı", "Mat Selofanlı", "Lak Baskı", "Ekonomik"] },
      { title: "Özel", items: ["Kabartma Laklı", "Sıvama Altın", "Spot Selofan", "Plastik"] },
      { title: "Özel Kesim", items: ["Oval", "Köşe Yuvarlak", "Özel Şekil", "Mini"] },
    ],
  },
  {
    category: "Broşür & Katalog",
    icon: <BookOpen size={15} />,
    subgroups: [
      { title: "Broşürler", items: ["2'li Katlama", "3'lü Katlama", "4'lü Katlama", "Z Katlama"] },
      { title: "Kataloglar", items: ["Tel Zımbalı", "Dikişli Ciltli", "Spiralli", "Lüks"] },
      { title: "Kitap & Dergi", items: ["Kitap Baskı", "Dergi Baskı", "Ajanda", "Yıllık Rapor"] },
    ],
  },
  {
    category: "Kurumsal",
    icon: <Printer size={15} />,
    subgroups: [
      { title: "Evrak", items: ["Antetli Kağıt", "Zarflar", "Klasör", "Bloknot"] },
      { title: "Sunum", items: ["Dosya Kapağı", "Karton Kutu", "Teklif Dosyası", "Kartvizit Kutusu"] },
      { title: "Formlar", items: ["Fatura Formu", "İrsaliye", "Sipariş Formu", "Anket"] },
    ],
  },
  {
    category: "Reklam",
    icon: <ImageIcon size={15} />,
    subgroups: [
      { title: "Büyük Format", items: ["Branda", "Afiş & Poster", "Germe Branda", "Mesh"] },
      { title: "Sunum", items: ["Roll-Up", "X-Banner", "Fuar Standı", "Pop-Up"] },
      { title: "Araç & Cam", items: ["Araç Giydirme", "Cam Folyo", "Duvar Kağıdı", "Zemin"] },
    ],
  },
  {
    category: "Ambalaj",
    icon: <Package size={15} />,
    subgroups: [
      { title: "Kutular", items: ["Karton Kutu", "Kraft Kutu", "Oluklu Mukavva", "Hediye"] },
      { title: "Poşet", items: ["Kağıt Torba", "Bez Çanta", "Kraft Kese", "Plastik"] },
      { title: "Etiket", items: ["Rulo Etiket", "Şeffaf Etiket", "Kontur Kesim", "QR"] },
    ],
  },
  {
    category: "Promosyon",
    icon: <Gift size={15} />,
    subgroups: [
      { title: "Yazı", items: ["Logolu Kalem", "Defter", "Ajanda", "Post-it"] },
      { title: "Tekstil", items: ["Bez Çanta", "T-Shirt", "Şapka", "Yelek"] },
      { title: "Takvim", items: ["Masa Takvimi", "Duvar Takvimi", "Bayrak", "Magnet"] },
    ],
  },
];

const quickLinks = [
  { label: "Ekspres Baskı", href: "#" },
  { label: "Kartvizitler", href: "#" },
  { label: "Broşür & Katalog", href: "#" },
  { label: "Sticker / Etiket", href: "#" },
  { label: "Tabela & Afiş", href: "#" },
  { label: "Ambalaj", href: "#" },
  { label: "Yeni Ürünler", href: "#", highlight: true },
  { label: "Kampanyalar", href: "#", highlight: true },
];

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* ── TOP BAR ── */}
      <div className="bg-[#07446c] text-blue-100 text-xs py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
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

      {/* ── MAIN HEADER ── */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">

          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <Image
              src="/kmpbaskilogo.png"
              alt="KMP Baskı"
              width={40}
              height={40}
              className="object-contain h-10 w-auto"
              priority
            />
            <span className="text-xl font-black tracking-tight leading-none">
              <span className="text-[#07446c]">KMP</span>
              <span className="text-[#25aae1]"> BASKI</span>
            </span>
          </a>

          {/* Arama — orta */}
          <div className="flex-1 max-w-2xl mx-auto relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ürün, kategori veya hizmet arayın…"
              className="w-full h-10 pl-4 pr-12 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f75bc] focus:border-transparent transition-all"
            />
            <button className="absolute right-0 top-0 h-10 w-12 flex items-center justify-center bg-[#0f75bc] hover:bg-[#07446c] text-white rounded-r-xl transition-colors">
              <Search size={17} />
            </button>
          </div>

          {/* Sağ — giriş + sepet */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href="#"
              className="hidden md:flex flex-col items-center text-[#07446c] hover:text-[#0f75bc] transition-colors px-3 py-1"
            >
              <User size={20} />
              <span className="text-[10px] font-semibold mt-0.5">Giriş Yap</span>
            </a>
            <a
              href="#"
              className="relative flex flex-col items-center text-[#07446c] hover:text-[#0f75bc] transition-colors px-3 py-1"
            >
              <ShoppingCart size={20} />
              <span className="text-[10px] font-semibold mt-0.5">Sepetim</span>
              <span className="absolute -top-0.5 right-1.5 bg-[#0f75bc] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span>
            </a>
            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-[#07446c] hover:bg-blue-50"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── KATEGORİ BARI ── */}
      <div className="bg-white border-b border-gray-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-0.5 h-10 overflow-x-auto scrollbar-none">

            {/* TÜM ÜRÜNLER — mega menü tetikleyici */}
            <div
              className="relative flex-shrink-0"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => { setMegaOpen(false); setActiveCategory(0); }}
            >
              <button
                className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-sm rounded-lg font-bold transition-colors
                  ${megaOpen ? "bg-[#0f75bc] text-white" : "bg-[#e0f2fe] text-[#07446c] hover:bg-[#bae6fd]"}`}
              >
                <AlignJustify size={14} />
                Tüm Ürünler
                <ChevronDown size={13} className={`transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`} />
              </button>

              {/* MEGA PANEL */}
              {megaOpen && (
                <div
                  className="absolute top-full left-0 mt-1 w-[820px] bg-white rounded-2xl shadow-2xl border border-blue-100 z-50 flex overflow-hidden"
                  style={{ minHeight: 380 }}
                >
                  {/* Sol — Kategori listesi */}
                  <div className="w-48 bg-[#f0f8ff] border-r border-blue-100 py-2 flex-shrink-0">
                    <p className="px-4 pt-1 pb-2 text-[10px] font-bold text-[#25aae1] uppercase tracking-widest">
                      Kategoriler
                    </p>
                    {megaCategories.map((cat, idx) => (
                      <button
                        key={idx}
                        onMouseEnter={() => setActiveCategory(idx)}
                        className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-left transition-colors
                          ${activeCategory === idx ? "bg-[#0f75bc] text-white" : "text-[#07446c] hover:bg-blue-100"}`}
                      >
                        <span className={activeCategory === idx ? "text-white" : "text-[#25aae1]"}>
                          {cat.icon}
                        </span>
                        {cat.category}
                        {activeCategory === idx && <ArrowRight size={12} className="ml-auto" />}
                      </button>
                    ))}
                  </div>

                  {/* Orta — Alt ürünler */}
                  <div className="flex-1 p-5 overflow-y-auto">
                    <p className="text-xs font-bold text-[#25aae1] uppercase tracking-widest mb-4">
                      {megaCategories[activeCategory].category}
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      {megaCategories[activeCategory].subgroups.map((group, gi) => (
                        <div key={gi}>
                          <p className="text-[11px] font-bold text-[#07446c] uppercase tracking-wide mb-2 border-b border-blue-100 pb-1">
                            {group.title}
                          </p>
                          <ul className="space-y-1">
                            {group.items.map((item, ii) => (
                              <li key={ii}>
                                <a
                                  href="#"
                                  className="text-sm text-slate-500 hover:text-[#0f75bc] hover:translate-x-0.5 inline-block transition-all"
                                >
                                  {item}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Hızlı linkler */}
            {quickLinks.map((cat, i) => (
              <a
                key={i}
                href={cat.href}
                className={`whitespace-nowrap px-3 py-1.5 text-sm rounded-lg transition-colors font-medium
                  ${cat.highlight ? "text-[#0f75bc] font-semibold hover:bg-blue-50" : "text-gray-600 hover:text-[#0f75bc] hover:bg-blue-50"}
                `}
              >
                {cat.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* ── MOBİL MENÜ ── */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-2 max-h-[70vh] overflow-y-auto">
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Ürün arayın…"
              className="w-full h-10 pl-4 pr-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc]"
            />
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          {quickLinks.map((cat, i) => (
            <a
              key={i}
              href={cat.href}
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${cat.highlight ? "text-[#0f75bc]" : "text-gray-700"}
                hover:bg-blue-50 hover:text-[#0f75bc]`}
            >
              {cat.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
