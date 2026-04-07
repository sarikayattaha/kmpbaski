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
} from "lucide-react";

const categories = [
  { label: "Tüm Ürünler", href: "#", bold: true },
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
            {categories.map((cat, i) => (
              <a
                key={i}
                href={cat.href}
                className={`flex items-center gap-1 whitespace-nowrap px-3 py-1.5 text-sm rounded-lg transition-colors
                  ${cat.bold ? "font-bold text-[#07446c] bg-[#e0f2fe] hover:bg-[#bae6fd]" : ""}
                  ${cat.highlight ? "font-semibold text-[#0f75bc] hover:bg-blue-50" : ""}
                  ${!cat.bold && !cat.highlight ? "text-gray-600 hover:text-[#0f75bc] hover:bg-blue-50 font-medium" : ""}
                `}
              >
                {cat.bold && <ChevronDown size={13} />}
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
          {categories.map((cat, i) => (
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
