"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Menu,
  X,
  ChevronDown,
  Printer,
  Package,
  BookOpen,
  Image as ImageIcon,
  Layers,
  Gift,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  Star,
  Zap,
  ShieldCheck,
  AlignJustify,
} from "lucide-react";

/* ─────────────────────────────────────────────
   TÜM ÜRÜNLER MEGA MENÜ VERİSİ
───────────────────────────────────────────── */
const allProductsMenu = [
  {
    category: "Kartvizitler",
    icon: <Layers size={16} />,
    subgroups: [
      {
        title: "Standart Kartvizitler",
        items: ["Selofanlı Kartvizit", "Mat Selofanlı", "Lak Baskı", "Ekonomik Kartvizit"],
      },
      {
        title: "Özel Kartvizitler",
        items: ["Kabartma Laklı", "Sıvama Altın/Gümüş", "Spot Selofan", "Plastik Kartvizit"],
      },
      {
        title: "Özel Kesim",
        items: ["Oval Kartvizit", "Köşe Yuvarlak", "Özel Şekil Kesim", "Mini Kartvizit"],
      },
    ],
    popular: [
      { name: "Selofanlı Kartvizit", tag: "Çok Satan" },
      { name: "Kabartma Laklı", tag: "Popüler" },
      { name: "Spot Selofan", tag: "Yeni" },
    ],
  },
  {
    category: "Broşür & Katalog",
    icon: <BookOpen size={16} />,
    subgroups: [
      {
        title: "Broşürler",
        items: ["2'li Katlama", "3'lü Katlama", "4'lü Katlama", "Z Katlama"],
      },
      {
        title: "Kataloglar",
        items: ["Tel Zımbalı Katalog", "Dikişli Ciltli", "Spiralli Katalog", "Lüks Katalog"],
      },
      {
        title: "Kitap & Dergi",
        items: ["Kitap Baskı", "Dergi Baskı", "Ajanda Baskı", "Yıllık Rapor"],
      },
    ],
    popular: [
      { name: "3'lü Katlama Broşür", tag: "Çok Satan" },
      { name: "Tel Zımbalı Katalog", tag: "Popüler" },
      { name: "Dikişli Cilt", tag: "Lüks" },
    ],
  },
  {
    category: "Kurumsal Ürünler",
    icon: <Printer size={16} />,
    subgroups: [
      {
        title: "Evrak & Yazışma",
        items: ["Antetli Kağıt", "Zarflar", "Klasör & Dosya", "Bloknot"],
      },
      {
        title: "Sunum Ürünleri",
        items: ["Dosya Kapağı", "Karton Kutu", "Kartvizit Kutusu", "Teklif Dosyası"],
      },
      {
        title: "Ofis Materyalleri",
        items: ["Fatura Formu", "İrsaliye Formu", "Sipariş Formu", "Anket Formu"],
      },
    ],
    popular: [
      { name: "Antetli Kağıt", tag: "Çok Satan" },
      { name: "Kurumsal Zarf", tag: "Popüler" },
      { name: "Teklif Dosyası", tag: "Profesyonel" },
    ],
  },
  {
    category: "Reklam Ürünleri",
    icon: <ImageIcon size={16} />,
    subgroups: [
      {
        title: "Büyük Format",
        items: ["Branda Baskı", "Afiş & Poster", "Germe Branda", "Mesh Branda"],
      },
      {
        title: "Sunum Sistemleri",
        items: ["Roll-Up", "X-Banner", "Fuar Standı", "Pop-Up Stand"],
      },
      {
        title: "Araç & Cam",
        items: ["Araç Giydirme", "Cam Folyo", "Duvar Kağıdı", "Zemin Baskı"],
      },
    ],
    popular: [
      { name: "Branda Baskı", tag: "Çok Satan" },
      { name: "Roll-Up", tag: "Popüler" },
      { name: "Araç Giydirme", tag: "Özel" },
    ],
  },
  {
    category: "Ambalaj",
    icon: <Package size={16} />,
    subgroups: [
      {
        title: "Kutular",
        items: ["Karton Kutu", "Kraft Kutu", "Oluklu Mukavva", "Hediye Kutusu"],
      },
      {
        title: "Poşet & Torba",
        items: ["Kağıt Torba", "Bez Çanta", "Plastik Poşet", "Kraft Kese"],
      },
      {
        title: "Etiket & Sticker",
        items: ["Rulo Etiket", "Şeffaf Etiket", "Kontur Kesim", "QR Etiket"],
      },
    ],
    popular: [
      { name: "Kraft Kese", tag: "Çok Satan" },
      { name: "Rulo Etiket", tag: "Popüler" },
      { name: "Hediye Kutusu", tag: "Lüks" },
    ],
  },
  {
    category: "Promosyon",
    icon: <Gift size={16} />,
    subgroups: [
      {
        title: "Yazı Ürünleri",
        items: ["Logolu Kalem", "Defter Baskı", "Ajanda", "Post-it"],
      },
      {
        title: "Tekstil",
        items: ["Bez Çanta", "T-Shirt Baskı", "Şapka Baskı", "Yeleк"],
      },
      {
        title: "Takvim & Diğer",
        items: ["Masa Takvimi", "Duvar Takvimi", "Bayrak & Flama", "Magnet"],
      },
    ],
    popular: [
      { name: "Logolu Kalem", tag: "Çok Satan" },
      { name: "Bez Çanta", tag: "Popüler" },
      { name: "Masa Takvimi", tag: "Sezonluk" },
    ],
  },
];

/* ─────────────────────────────────────────────
   KATEGORİ BAZLI KÜÇÜK MENÜ VERİSİ (eski)
───────────────────────────────────────────── */
const quickMenuData = [
  { label: "Kartvizit", href: "#" },
  { label: "Broşür", href: "#" },
  { label: "Tabela", href: "#" },
  { label: "Ambalaj", href: "#" },
  { label: "Promosyon", href: "#" },
];

const features = [
  {
    icon: <Printer size={26} />,
    title: "Yüksek Baskı Kalitesi",
    desc: "Son teknoloji ofset ve dijital baskı makinelerimizle piksel mükemmelliğinde sonuçlar.",
  },
  {
    icon: <Zap size={26} />,
    title: "Hızlı Teslimat",
    desc: "Sipariş onayından itibaren 24 saatte kapınıza teslim seçenekleri sunuyoruz.",
  },
  {
    icon: <Package size={26} />,
    title: "Geniş Ürün Yelpazesi",
    desc: "Kartvizittten büyük format baskıya, promosyondan ambalaja eksiksiz hizmet.",
  },
  {
    icon: <ShieldCheck size={26} />,
    title: "Kalite Garantisi",
    desc: "Her siparişiniz kalite kontrol süreçlerimizden geçerek tarafınıza ulaşır.",
  },
];

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [allProductsOpen, setAllProductsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

  const activeCat = allProductsMenu[activeCategory];

  return (
    <div className="min-h-screen bg-white text-[#07446c]">

      {/* ── TOP BAR ── */}
      <div className="bg-[#07446c] text-blue-100 text-xs py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
              <Phone size={12} /> 0850 000 00 00
            </span>
            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
              <Mail size={12} /> info@kmpbaski.com
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={12} /> İstanbul, Türkiye
            </span>
          </div>
          <span className="flex items-center gap-1.5 text-[#25aae1]">
            <Clock size={12} /> Pazartesi – Cuma: 08:00 – 18:00
          </span>
        </div>
      </div>

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <a href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image
              src="/kmpbaskilogo.png"
              alt="KMP Baskı Logo"
              width={44}
              height={44}
              className="object-contain h-11 w-auto"
              priority
            />
            <span className="text-2xl font-black tracking-tight">
              <span className="text-[#07446c]">KMP </span>
              <span className="text-[#25aae1]">BASKI</span>
            </span>
          </a>

          {/* ── TÜM ÜRÜNLER MEGA MENÜ BUTONU ── */}
          <div
            className="relative hidden lg:block"
            onMouseEnter={() => setAllProductsOpen(true)}
            onMouseLeave={() => { setAllProductsOpen(false); setActiveCategory(0); }}
          >
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
                allProductsOpen
                  ? "bg-[#0f75bc] text-white"
                  : "bg-[#e0f2fe] text-[#07446c] hover:bg-[#bae6fd]"
              }`}
            >
              <AlignJustify size={16} />
              Tüm Ürünler
              <ChevronDown size={13} className={`transition-transform duration-200 ${allProductsOpen ? "rotate-180" : ""}`} />
            </button>

            {/* MEGA PANEL */}
            {allProductsOpen && (
              <div className="absolute top-full left-0 mt-2 w-[860px] bg-white rounded-2xl shadow-2xl border border-blue-100 z-50 overflow-hidden flex"
                style={{ minHeight: 420 }}>

                {/* SOL: Kategori Listesi */}
                <div className="w-52 bg-[#f0f8ff] border-r border-blue-100 py-3 flex-shrink-0">
                  <p className="px-4 pb-2 text-[10px] font-bold text-[#25aae1] uppercase tracking-widest">
                    Kategoriler
                  </p>
                  {allProductsMenu.map((cat, idx) => (
                    <button
                      key={idx}
                      onMouseEnter={() => setActiveCategory(idx)}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-left transition-colors ${
                        activeCategory === idx
                          ? "bg-[#0f75bc] text-white"
                          : "text-[#07446c] hover:bg-blue-100"
                      }`}
                    >
                      <span className={activeCategory === idx ? "text-white" : "text-[#25aae1]"}>
                        {cat.icon}
                      </span>
                      {cat.category}
                      {activeCategory === idx && (
                        <ArrowRight size={13} className="ml-auto flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                {/* ORTA: Alt Ürün Grid */}
                <div className="flex-1 py-4 px-5 overflow-y-auto">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-[#25aae1] uppercase tracking-widest">
                      {activeCat.category}
                    </p>
                    <a
                      href="#"
                      className="text-xs font-semibold text-[#0f75bc] hover:underline flex items-center gap-1"
                    >
                      Tüm {activeCat.category} Ürünleri <ArrowRight size={12} />
                    </a>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {activeCat.subgroups.map((group, gi) => (
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

                {/* SAĞ: Popüler Ürünler */}
                <div className="w-44 bg-[#f0f8ff] border-l border-blue-100 py-4 px-3 flex-shrink-0">
                  <p className="text-[10px] font-bold text-[#25aae1] uppercase tracking-widest mb-3">
                    Popüler
                  </p>
                  <div className="space-y-2">
                    {activeCat.popular.map((p, pi) => (
                      <a
                        key={pi}
                        href="#"
                        className="flex flex-col p-2.5 bg-white rounded-xl border border-blue-100 hover:border-[#0f75bc] hover:shadow-md transition-all group"
                      >
                        <div className="w-full h-16 bg-gradient-to-br from-[#e0f2fe] to-[#bae6fd] rounded-lg mb-2 flex items-center justify-center text-[#0f75bc] group-hover:from-[#bae6fd] group-hover:to-[#7dd3fc] transition-colors">
                          <Printer size={22} />
                        </div>
                        <p className="text-xs font-semibold text-[#07446c] leading-tight">{p.name}</p>
                        <span className="mt-1 text-[9px] font-bold uppercase tracking-wide text-white bg-[#0f75bc] rounded-full px-1.5 py-0.5 w-fit">
                          {p.tag}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Hızlı Linkler */}
          <nav className="hidden lg:flex items-center gap-1 flex-1">
            {quickMenuData.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="px-3 py-1.5 text-sm font-medium text-[#07446c] hover:text-[#0f75bc] hover:bg-blue-50 rounded-lg transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <a
              href="#"
              className="hidden md:inline-flex items-center gap-2 bg-[#0f75bc] hover:bg-[#07446c] text-white text-sm font-bold px-5 py-2 rounded-xl transition-colors shadow-sm"
            >
              <Phone size={14} /> Teklif Al
            </a>
            <button
              className="lg:hidden p-2 rounded-lg text-[#07446c] hover:bg-blue-50 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-blue-100 bg-white px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            <p className="text-xs font-bold text-[#25aae1] uppercase tracking-widest mb-2">Tüm Ürünler</p>
            {allProductsMenu.map((cat, idx) => (
              <div key={idx}>
                <p className="flex items-center gap-2 text-sm font-bold text-[#07446c] py-1">
                  <span className="text-[#25aae1]">{cat.icon}</span>
                  {cat.category}
                </p>
                <div className="pl-6 space-y-0.5">
                  {cat.subgroups.flatMap(g => g.items).slice(0, 4).map((item, i) => (
                    <a
                      key={i}
                      href="#"
                      className="block text-sm text-slate-500 hover:text-[#0f75bc] py-0.5 transition-colors"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            ))}
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-[#0f75bc] text-white text-sm font-bold px-5 py-2.5 rounded-xl mt-2"
            >
              <Phone size={14} /> Teklif Al
            </a>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <main>
        <section className="relative overflow-hidden min-h-[90vh] flex items-center bg-white">

          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-[#e8f4fc] rounded-full opacity-60 translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#ddf0fb] rounded-full opacity-50 -translate-x-1/4 translate-y-1/4" />
            <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-[#0f75bc]/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
          </div>

          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(#07446c 1px, transparent 1px), linear-gradient(90deg, #07446c 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative max-w-7xl mx-auto px-6 py-24 text-center w-full">

            <div className="inline-flex items-center gap-2 bg-[#0f75bc]/10 text-[#0f75bc] text-xs font-bold px-4 py-1.5 rounded-full mb-8 uppercase tracking-widest border border-[#0f75bc]/20">
              <Star size={11} fill="currentColor" />
              Profesyonel Online Matbaa Hizmetleri
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-[#07446c] leading-tight mb-6 tracking-tight">
              Yakında{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg, #0f75bc 0%, #25aae1 100%)" }}
              >
                Buradayız
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
              Kartvizitinizden kataloğunuza, afiş baskınızdan ambalaj çözümlerinize kadar
              tüm baskı ihtiyaçlarınız için profesyonel hizmet sunmaya hazırlanıyoruz.
            </p>

            <div className="inline-flex bg-white rounded-2xl shadow-xl border border-blue-100 divide-x divide-blue-100 mb-14 overflow-hidden">
              {[
                { label: "Gün", value: "30" },
                { label: "Saat", value: "00" },
                { label: "Dakika", value: "00" },
                { label: "Saniye", value: "00" },
              ].map((t, i) => (
                <div key={i} className="px-8 py-5 text-center">
                  <div className="text-4xl font-black text-[#07446c] tabular-nums">{t.value}</div>
                  <div className="text-[10px] text-[#25aae1] font-bold uppercase tracking-widest mt-1">{t.label}</div>
                </div>
              ))}
            </div>

            <div className="max-w-md mx-auto">
              <p className="text-sm text-slate-400 mb-3">
                Açılıştan haberdar olun — özel lansman indirimine hak kazanın!
              </p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  className="flex-1 border border-blue-100 rounded-xl px-4 py-3 text-sm text-[#07446c] placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0f75bc] focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-[#0f75bc] hover:bg-[#07446c] text-white text-sm font-bold px-5 py-3 rounded-xl transition-colors whitespace-nowrap shadow-sm"
                >
                  Beni Bildir
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="bg-[#f0f8ff] py-20 border-t border-blue-100">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-xs font-bold text-[#25aae1] uppercase tracking-widest mb-3">
              Neden KMP Baskı?
            </p>
            <h2 className="text-3xl font-black text-center text-[#07446c] mb-12">
              Fark Yaratan Hizmetler
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-blue-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
                >
                  <div className="bg-[#0f75bc]/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-[#0f75bc] group-hover:bg-[#0f75bc] group-hover:text-white transition-colors duration-200">
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-[#07446c] mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section
          className="py-16"
          style={{ background: "linear-gradient(135deg, #07446c 0%, #0f75bc 60%, #25aae1 100%)" }}
        >
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-black text-white mb-4">Baskı İhtiyacınız mı Var?</h2>
            <p className="text-blue-100 mb-8">
              Hemen bizimle iletişime geçin, uzman ekibimiz size en uygun çözümü sunsun.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#0f75bc] font-bold px-7 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-md"
              >
                <Phone size={16} /> Hemen Ara
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-bold px-7 py-3 rounded-xl hover:border-white hover:bg-white/10 transition-colors"
              >
                <Mail size={16} /> E-posta Gönder
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-[#07446c] text-blue-200 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-3">
            <Image
              src="/kmpbaskilogo.png"
              alt="KMP Baskı Logo"
              width={44}
              height={44}
              className="object-contain h-11 w-auto"
            />
            <span className="text-2xl font-black tracking-tight">
              <span className="text-white">KMP </span>
              <span className="text-[#25aae1]">BASKI</span>
            </span>
          </a>
          <p className="text-xs text-blue-300 text-center">
            © {new Date().getFullYear()} KMP Baskı — Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-5 text-xs">
            {["Gizlilik Politikası", "KVKK", "İletişim"].map((l) => (
              <a key={l} href="#" className="hover:text-white transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
