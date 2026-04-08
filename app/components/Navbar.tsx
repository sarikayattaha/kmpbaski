"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Search, User, ShoppingCart, Phone, Mail, Clock,
  Menu, X, ChevronDown, AlignJustify, Loader2, LogOut,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/lib/cart-context";

type NavProduct = { name: string; slug: string; image_url: string; };
type NavCategory = { name: string; products: NavProduct[]; };

export default function Navbar() {
  const [query, setQuery]           = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen]     = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [menuData, setMenuData]     = useState<NavCategory[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const { totalCount } = useCart();

  const [userFullName, setUserFullName] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session?.user) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", data.session.user.id)
          .single();
        setUserFullName((prof as { full_name?: string } | null)?.full_name ?? data.session.user.email ?? "Hesabım");
      }
      setAuthReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", session.user.id)
          .single();
        setUserFullName((prof as { full_name?: string } | null)?.full_name ?? session.user.email ?? "Hesabım");
      } else {
        setUserFullName(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserFullName(null);
    window.location.href = "/";
  };

  /* ── Supabase'den ürünleri çek ── */
  useEffect(() => {
    try {
      supabase
        .from("products")
        .select("name, slug, image_url, category")
        .order("created_at", { ascending: false })
        .then((res) => {
          const data = res.data as (NavProduct & { category: string })[] | null;
          if (!data) { setMenuLoading(false); return; }

          const map: Record<string, NavProduct[]> = {};
          for (const p of data) {
            if (!map[p.category]) map[p.category] = [];
            map[p.category].push({ name: p.name, slug: p.slug, image_url: p.image_url });
          }

          setMenuData(Object.entries(map).map(([name, products]) => ({ name, products })));
          setMenuLoading(false);
        });
    } catch {
      setMenuLoading(false);
    }
  }, []);

  /* ── Gecikmeli kapama ── */
  const openMega = () => { clearTimeout(closeTimer.current); setMegaOpen(true); };
  const closeMega = () => {
    closeTimer.current = setTimeout(() => { setMegaOpen(false); setActiveCategory(0); }, 120);
  };

  const activeCat = menuData[activeCategory];

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

      {/* ── ANA HEADER ── */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-5">
          <a href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <Image src="/kmpbaskilogo.png" alt="KMP Baskı" width={40} height={40}
              className="object-contain h-10 w-auto" priority />
            <span className="text-xl font-black tracking-tight leading-none">
              <span className="text-[#07446c]">KMP</span>
              <span className="text-[#25aae1]"> BASKI</span>
            </span>
          </a>

          <div className="flex-1 relative">
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Ne bastırmak istiyorsunuz?"
              className="w-full h-10 pl-4 pr-12 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f75bc] focus:border-transparent transition-all" />
            <button className="absolute right-0 top-0 h-10 w-12 flex items-center justify-center bg-[#0f75bc] hover:bg-[#07446c] text-white rounded-r-xl transition-colors">
              <Search size={17} />
            </button>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {authReady && (
              userFullName ? (
                <div className="hidden md:flex items-center gap-1">
                  <a href="/hesabim" className="flex items-center gap-2 px-3 py-2 text-[#07446c] hover:text-[#0f75bc] transition-colors">
                    <User size={18} />
                    <span className="text-sm font-semibold max-w-[120px] truncate">{userFullName.split(" ")[0]}</span>
                  </a>
                  <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Çıkış Yap">
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <a href="/login" className="hidden md:flex items-center gap-2 px-3 py-2 text-[#07446c] hover:text-[#0f75bc] transition-colors">
                  <User size={20} />
                  <span className="text-sm font-medium">Giriş Yap</span>
                </a>
              )
            )}
            <a href="/sepet" className="flex items-center gap-2 bg-[#0f75bc] hover:bg-[#07446c] text-white px-4 py-2 rounded-xl transition-colors">
              <ShoppingCart size={18} />
              <span className="text-sm font-bold hidden md:block">Sepetim</span>
              <span className="bg-white text-[#0f75bc] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                {totalCount}
              </span>
            </a>
            <button className="md:hidden p-2 rounded-lg text-[#07446c] hover:bg-blue-50 ml-1"
              onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── KATEGORİ BARI + MEGA PANEL ── */}
      <div className="hidden md:block bg-white border-b border-gray-100 relative" onMouseLeave={closeMega}>
        <div className="max-w-7xl mx-auto px-6 flex items-center h-11 gap-1">
          <button
            onMouseEnter={openMega}
            className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-sm rounded-lg font-bold transition-colors flex-shrink-0
              ${megaOpen ? "bg-[#0f75bc] text-white" : "bg-[#e0f2fe] text-[#07446c] hover:bg-[#bae6fd]"}`}
          >
            <AlignJustify size={14} />
            Tüm Ürünler
            <ChevronDown size={13} className={`transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`} />
          </button>

          <nav className="flex items-center gap-0.5 overflow-x-auto scrollbar-none flex-1 ml-1">
            {menuData.slice(0, 8).map((cat, i) => (
              <a key={i} href={`/tum-urunler?kategori=${encodeURIComponent(cat.name)}`}
                className="whitespace-nowrap px-3 py-1.5 text-sm rounded-lg font-medium text-gray-600 hover:text-[#0f75bc] hover:bg-blue-50 transition-colors">
                {cat.name}
              </a>
            ))}
            <a href="#"
              className="whitespace-nowrap px-3 py-1.5 text-sm rounded-lg font-semibold text-[#0f75bc] hover:bg-blue-50 transition-colors ml-auto flex-shrink-0">
              Kampanyalar
            </a>
          </nav>
        </div>

        {/* ── MEGA PANEL ── */}
        {megaOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-t border-b border-gray-200 shadow-xl" style={{ zIndex: 9999 }}
            onMouseEnter={openMega}>
            <div className="max-w-7xl mx-auto flex" style={{ minHeight: 280 }}>

              {/* SOL — Kategori listesi */}
              <div className="w-56 border-r border-gray-100 py-3 flex-shrink-0">
                {menuLoading ? (
                  <div className="flex items-center justify-center py-8 text-gray-300">
                    <Loader2 size={20} className="animate-spin" />
                  </div>
                ) : menuData.length === 0 ? (
                  <p className="px-5 py-4 text-sm text-gray-400">Henüz ürün eklenmemiş.</p>
                ) : (
                  <>
                    {menuData.map((cat, idx) => (
                      <button key={idx} onMouseEnter={() => setActiveCategory(idx)}
                        className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${
                          activeCategory === idx ? "bg-blue-50 text-[#0f75bc] font-semibold" : "text-gray-700 hover:bg-gray-50"
                        }`}>
                        {cat.name}
                        <span className="text-xs text-gray-400 ml-1.5">({cat.products.length})</span>
                      </button>
                    ))}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <a href="/tum-urunler" className="block px-5 py-2.5 text-sm text-[#0f75bc] font-semibold hover:bg-blue-50 transition-colors">
                        → Tüm Ürünleri Gör
                      </a>
                    </div>
                  </>
                )}
              </div>

              {/* ORTA — Ürün linkleri */}
              <div className="flex-1 px-8 py-6 overflow-y-auto" style={{ maxHeight: 380 }}>
                {activeCat && (
                  <>
                    <h3 className="text-sm font-black text-gray-800 mb-4 pb-2 border-b border-gray-100">
                      {activeCat.name}
                    </h3>
                    <div className="grid grid-cols-3 gap-x-6 gap-y-2">
                      {activeCat.products.map((product, pi) => (
                        <a key={pi} href={`/urun/${product.slug}`}
                          className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#0f75bc] transition-colors py-1 group">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#25aae1] flex-shrink-0" />
                          {product.name}
                        </a>
                      ))}
                    </div>
                    <a href={`/tum-urunler?kategori=${encodeURIComponent(activeCat.name)}`}
                      className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-[#0f75bc] hover:underline">
                      {activeCat.name} ürünlerini gör →
                    </a>
                  </>
                )}
              </div>

              {/* SAĞ — Kategori ürün görselleri */}
              <div className="w-56 border-l border-gray-100 py-5 px-4 flex-shrink-0">
                {activeCat && (
                  <div className="grid grid-cols-2 gap-2">
                    {activeCat.products.slice(0, 6).map((product, pi) => (
                      <a key={pi} href={`/urun/${product.slug}`}
                        className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 transition-colors group">
                        <div className="w-14 h-14 rounded-lg overflow-hidden relative bg-gradient-to-br from-[#e8f4fc] to-[#ddf0fb] flex items-center justify-center">
                          {product.image_url ? (
                            <Image src={product.image_url} alt={product.name} fill sizes="56px"
                              className="object-contain p-1 group-hover:scale-110 transition-transform duration-200" />
                          ) : (
                            <span className="text-xl opacity-25">🖨️</span>
                          )}
                        </div>
                        <p className="text-[9px] text-center text-gray-400 group-hover:text-[#0f75bc] leading-tight line-clamp-2 transition-colors font-medium">
                          {product.name}
                        </p>
                      </a>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </div>

      {/* ── MOBİL MENÜ ── */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 max-h-[70vh] overflow-y-auto space-y-1">
          <div className="relative mb-3">
            <input type="text" placeholder="Ne bastırmak istiyorsunuz?"
              className="w-full h-10 pl-4 pr-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc]" />
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {menuLoading ? (
            <div className="flex items-center justify-center py-6 text-gray-300">
              <Loader2 size={20} className="animate-spin" />
            </div>
          ) : menuData.length === 0 ? (
            <p className="text-sm text-gray-400 px-3 py-4">Henüz ürün eklenmemiş.</p>
          ) : (
            menuData.map((cat, ci) => (
              <div key={ci}>
                <a href={`/tum-urunler?kategori=${encodeURIComponent(cat.name)}`}
                  className="block text-[10px] font-bold text-[#25aae1] uppercase tracking-widest px-2 pt-3 pb-1">
                  {cat.name}
                </a>
                {cat.products.map((p) => (
                  <a key={p.slug} href={`/urun/${p.slug}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0f75bc] transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#25aae1] flex-shrink-0" />
                    {p.name}
                  </a>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </header>
  );
}
