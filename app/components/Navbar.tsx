"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search, Phone, Mail, Clock,
  Menu, X, ChevronDown, AlignJustify, Loader2, ChevronRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import MegaMenu, { type NavCategory, type NavProduct } from "./MegaMenu";

// ── Tipler ──────────────────────────────────────────────────────────────────
type SearchResult   = { name: string; slug: string; image_url: string; category: string };
type NavbarCategory = { name: string; navbar_order: number };

// ── Bileşen ──────────────────────────────────────────────────────────────────
export default function Navbar() {
  const router = useRouter();

  const [query, setQuery]                     = useState("");
  const [mobileOpen, setMobileOpen]           = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen]               = useState(false);
  const [activeCategory, setActiveCategory]   = useState(0);
  const [openMobileCat, setOpenMobileCat]     = useState<string | null>(null);
  const [menuData, setMenuData]               = useState<NavCategory[]>([]);
  const [menuLoading, setMenuLoading]         = useState(true);
  const [navbarCats, setNavbarCats]           = useState<NavbarCategory[]>([]);

  const [searchResults, setSearchResults]     = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading]     = useState(false);
  const [searchOpen, setSearchOpen]           = useState(false);

  const closeTimer      = useRef<ReturnType<typeof setTimeout>>(undefined);
  const searchDebounce  = useRef<ReturnType<typeof setTimeout>>(undefined);
  const searchRef       = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  /* ── Ürün menüsü (mega menu) ── */
  useEffect(() => {
    supabase
      .from("products")
      .select("name, slug, image_url, category")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!data) { setMenuLoading(false); return; }
        const map: Record<string, NavProduct[]> = {};
        for (const p of data as (NavProduct & { category: string })[]) {
          if (!map[p.category]) map[p.category] = [];
          map[p.category].push({ name: p.name, slug: p.slug, image_url: p.image_url });
        }
        setMenuData(Object.entries(map).map(([name, products]) => ({ name, products })));
        setMenuLoading(false);
      });
  }, []);

  /* ── Navbar kategori barı ── */
  useEffect(() => {
    supabase
      .from("categories")
      .select("name, navbar_order")
      .eq("show_in_navbar", true)
      .order("navbar_order", { ascending: true })
      .then(({ data }) => setNavbarCats((data as NavbarCategory[]) ?? []));
  }, []);

  /* ── Dışa tıklayınca kapat ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setSearchOpen(false);
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target as Node))
        setMobileSearchOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Arama ── */
  const handleSearchChange = (value: string) => {
    setQuery(value);
    clearTimeout(searchDebounce.current);
    if (!value.trim()) { setSearchResults([]); setSearchOpen(false); return; }
    setSearchLoading(true);
    setSearchOpen(true);
    searchDebounce.current = setTimeout(async () => {
      const { data } = await supabase
        .from("products")
        .select("name, slug, image_url, category")
        .ilike("name", `%${value.trim()}%`)
        .limit(8);
      setSearchResults((data as SearchResult[]) ?? []);
      setSearchLoading(false);
    }, 300);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchOpen(false);
    setMobileSearchOpen(false);
    setMobileOpen(false);
    router.push(`/tum-urunler?q=${encodeURIComponent(query.trim())}`);
  };

  const openMegaMenu  = () => { clearTimeout(closeTimer.current); setMegaOpen(true); };
  const closeMegaMenu = () => {
    closeTimer.current = setTimeout(() => { setMegaOpen(false); setActiveCategory(0); }, 120);
  };

  /* ── Arama sonuçları kutusu ── */
  const SearchDropdown = () => (
    <div
      className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
      style={{ zIndex: 9999 }}
    >
      {searchLoading ? (
        <div className="flex items-center justify-center py-5 text-gray-300">
          <Loader2 size={18} className="animate-spin" />
        </div>
      ) : searchResults.length === 0 ? (
        <div className="px-4 py-4 text-sm text-gray-400 text-center">
          &quot;{query}&quot; için sonuç bulunamadı.
        </div>
      ) : (
        <>
          {searchResults.map((r, i) => (
            <Link
              key={i}
              href={`/urun/${r.slug}`}
              onClick={() => { setSearchOpen(false); setMobileSearchOpen(false); }}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-[#e0f2fe] flex-shrink-0 relative overflow-hidden">
                {r.image_url
                  ? <Image src={r.image_url} alt={r.name} fill sizes="36px" className="object-contain p-1" />
                  : <span className="text-base flex items-center justify-center h-full opacity-30">🖨️</span>}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{r.name}</p>
                <p className="text-xs text-gray-400 truncate">{r.category}</p>
              </div>
            </Link>
          ))}
          <div className="border-t border-gray-100">
            <button
              onClick={handleSearchSubmit as unknown as React.MouseEventHandler}
              className="w-full px-4 py-2.5 text-xs font-bold text-[#0f75bc] hover:bg-blue-50 transition-colors text-left"
            >
              &quot;{query}&quot; için tüm sonuçları gör →
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">

      {/* ── TOP BAR (sadece desktop) ── */}
      <div className="bg-[#07446c] text-blue-100 text-xs py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-5">
            <a href="tel:+905541630031" className="flex items-center gap-1 hover:text-white transition-colors">
              <Phone size={11} /> +90 554 163 00 31
            </a>
            <a href="mailto:info@kmpprint.net" className="flex items-center gap-1 hover:text-white transition-colors">
              <Mail size={11} /> info@kmpprint.net
            </a>
          </div>
          <span className="flex items-center gap-1 text-[#25aae1]">
            <Clock size={11} /> Pzt – Cum: 08:00 – 18:00
          </span>
        </div>
      </div>

      {/* ── ANA HEADER ── */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center gap-3 md:gap-5">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="/kmpbaskilogo.png"
              alt="KMP Baskı"
              width={36}
              height={36}
              className="object-contain h-8 md:h-10 w-auto"
              fetchPriority="high"
              loading="eager"
            />
            <span className="text-lg md:text-xl font-black tracking-tight leading-none">
              <span className="text-[#07446c]">KMP</span>
              <span className="text-[#25aae1]"> BASKI</span>
            </span>
          </Link>

          {/* Desktop arama */}
          <div className="hidden md:block flex-1 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                value={query}
                onChange={e => handleSearchChange(e.target.value)}
                onFocus={() => { if (query.trim() && searchResults.length > 0) setSearchOpen(true); }}
                placeholder="Ne bastırmak istiyorsunuz?"
                className="w-full h-10 pl-4 pr-12 rounded-xl border border-gray-200 bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f75bc] focus:border-transparent transition-all"
                autoComplete="off"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-10 w-12 flex items-center justify-center bg-[#0f75bc] hover:bg-[#07446c] text-white rounded-r-xl transition-colors"
              >
                <Search size={17} />
              </button>
            </form>
            {searchOpen && <SearchDropdown />}
          </div>

          {/* Sağ ikonlar (mobil) */}
          <div className="flex items-center gap-1 ml-auto md:ml-0 flex-shrink-0">
            <button
              className="md:hidden p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
              onClick={() => { setMobileSearchOpen(!mobileSearchOpen); setMobileOpen(false); }}
            >
              <Search size={20} />
            </button>
            <button
              className="md:hidden p-2.5 rounded-xl text-[#07446c] hover:bg-blue-50 transition-colors"
              onClick={() => { setMobileOpen(!mobileOpen); setMobileSearchOpen(false); }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobil arama barı */}
        {mobileSearchOpen && (
          <div className="md:hidden px-4 pb-3 relative" ref={mobileSearchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                autoFocus
                type="text"
                value={query}
                onChange={e => handleSearchChange(e.target.value)}
                placeholder="Ne bastırmak istiyorsunuz?"
                className="w-full h-11 pl-4 pr-12 rounded-xl border border-gray-200 bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f75bc] transition-all"
                autoComplete="off"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-11 w-12 flex items-center justify-center bg-[#0f75bc] text-white rounded-r-xl"
              >
                <Search size={17} />
              </button>
            </form>
            {searchOpen && <SearchDropdown />}
          </div>
        )}
      </div>

      {/* ── KATEGORİ BARI + MEGA PANEL (sadece desktop) ── */}
      <div
        className="hidden md:block bg-white border-b border-gray-100 relative"
        onMouseLeave={closeMegaMenu}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center h-11 gap-1">
          <button
            onMouseEnter={openMegaMenu}
            className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-sm rounded-lg font-bold transition-colors flex-shrink-0 ${
              megaOpen
                ? "bg-[#0f75bc] text-white"
                : "bg-[#e0f2fe] text-[#07446c] hover:bg-[#bae6fd]"
            }`}
          >
            <AlignJustify size={14} />
            Tüm Ürünler
            <ChevronDown
              size={13}
              className={`transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`}
            />
          </button>

          <nav className="flex items-center gap-0.5 overflow-x-auto scrollbar-none flex-1 ml-1">
            {navbarCats.map((cat, i) => (
              <Link
                key={i}
                href={`/tum-urunler?kategori=${encodeURIComponent(cat.name)}`}
                className="whitespace-nowrap px-3 py-1.5 text-sm rounded-lg font-medium text-gray-600 hover:text-[#0f75bc] hover:bg-blue-50 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>

        {megaOpen && (
          <MegaMenu
            menuData={menuData}
            menuLoading={menuLoading}
            activeCategory={activeCategory}
            onCategoryHover={setActiveCategory}
            onMouseEnter={openMegaMenu}
          />
        )}
      </div>

      {/* ── MOBİL MENÜ ── */}
      {mobileOpen && (
        <div
          className="md:hidden border-t bg-white overflow-y-auto"
          style={{ maxHeight: "calc(100dvh - 56px)" }}
        >
          {/* Hızlı link */}
          <div className="px-4 pt-2 pb-1 space-y-1.5">
            <Link
              href="/tum-urunler"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-[#0f75bc] bg-[#e0f2fe]"
            >
              <span className="flex items-center gap-2">
                <AlignJustify size={15} /> Tüm Ürünler
              </span>
              <ChevronRight size={15} />
            </Link>
          </div>

          {/* Kategoriler accordion */}
          <div className="px-4 py-2 space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">
              Kategoriler
            </p>
            {menuLoading ? (
              <div className="flex items-center justify-center py-6 text-gray-200">
                <Loader2 size={20} className="animate-spin" />
              </div>
            ) : menuData.map((cat, ci) => (
              <div key={ci} className="rounded-xl overflow-hidden border border-gray-100">
                <button
                  onClick={() => setOpenMobileCat(openMobileCat === cat.name ? null : cat.name)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-[#07446c] bg-white hover:bg-blue-50 transition-colors"
                >
                  <span>{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{cat.products.length}</span>
                    <ChevronDown
                      size={15}
                      className={`text-gray-400 transition-transform duration-200 ${
                        openMobileCat === cat.name ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>
                {openMobileCat === cat.name && (
                  <div className="bg-gray-50 border-t border-gray-100 px-2 py-1.5 space-y-0.5">
                    {cat.products.map(p => (
                      <Link
                        key={p.slug}
                        href={`/urun/${p.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-[#0f75bc] hover:bg-white transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#25aae1] flex-shrink-0" />
                        {p.name}
                      </Link>
                    ))}
                    <Link
                      href={`/tum-urunler?kategori=${encodeURIComponent(cat.name)}`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#0f75bc]"
                    >
                      Tümünü gör →
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="h-6" />
        </div>
      )}
    </header>
  );
}
