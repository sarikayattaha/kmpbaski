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
} from "lucide-react";

const megaMenuData = [
  {
    label: "Kartvizit & Kurumsal",
    icon: <Layers size={18} />,
    items: [
      { name: "Kartvizit", desc: "Selofanlı, kabartmalı, standart" },
      { name: "Antetli Kağıt", desc: "A4 / A5 kurumsal evrak" },
      { name: "Zarf Baskı", desc: "Pencereli, düz, yapışkanlı" },
      { name: "Klasör & Dosya", desc: "Özel tasarım kurumsal klasör" },
    ],
  },
  {
    label: "Broşür & Katalog",
    icon: <BookOpen size={18} />,
    items: [
      { name: "Broşür Baskı", desc: "2'li, 3'lü, 4'lü katlama" },
      { name: "Katalog Baskı", desc: "Dikişli, tel zımbalı, ciltli" },
      { name: "Dergi Baskı", desc: "Yüksek tiraja özel fiyat" },
      { name: "Kitap Baskı", desc: "Ofset & dijital baskı" },
    ],
  },
  {
    label: "Tabela & Afiş",
    icon: <ImageIcon size={18} />,
    items: [
      { name: "Branda Baskı", desc: "Solvent, UV, sublimasyon" },
      { name: "Afiş & Poster", desc: "Parlak, mat, kuşe" },
      { name: "Roll-Up", desc: "Taşınabilir tanıtım standı" },
      { name: "Vinil Folyo", desc: "Araç, cam, duvar giydirme" },
    ],
  },
  {
    label: "Ambalaj & Paketleme",
    icon: <Package size={18} />,
    items: [
      { name: "Kutu Baskı", desc: "Mikro oluklu, karton, kraft" },
      { name: "Poşet Baskı", desc: "Plastik, kağıt, bez torba" },
      { name: "Etiket Baskı", desc: "Rulo, tabaka, şeffaf" },
      { name: "Sticker", desc: "Kesim, kontur, özel şekil" },
    ],
  },
  {
    label: "Promosyon",
    icon: <Gift size={18} />,
    items: [
      { name: "Kalem & Defter", desc: "Logolu promosyon ürünleri" },
      { name: "Çanta & Çuval", desc: "Bez, polyester, jüt" },
      { name: "Takvim Baskı", desc: "Masa, duvar, ajanda" },
      { name: "Bayrak & Flama", desc: "İç/dış mekan kullanımı" },
    ],
  },
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

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white text-[#07446c]">

      {/* ── TOP BAR ── */}
      <div className="bg-[#07446c] text-blue-100 text-xs py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone size={12} /> 0850 000 00 00
            </span>
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
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
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">

          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <Image
              src="/kmpbaskilogo.png"
              alt="KMP Baskı Logo"
              width={44}
              height={44}
              className="object-contain h-11 w-auto"
              priority
            />
            <div className="leading-tight">
              <p className="text-lg font-black tracking-tight text-[#07446c]">KMPBASKI</p>
              <p className="text-[10px] font-semibold tracking-widest text-[#25aae1] uppercase">Online Matbaa</p>
            </div>
          </a>

          {/* Desktop Mega Menu */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {megaMenuData.map((menu, idx) => (
              <div
                key={idx}
                className="relative"
                onMouseEnter={() => setActiveMenu(idx)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#07446c] hover:text-[#0f75bc] rounded-lg transition-colors">
                  <span className="text-[#25aae1]">{menu.icon}</span>
                  {menu.label}
                  <ChevronDown
                    size={13}
                    className={`text-[#0f75bc] transition-transform duration-200 ${activeMenu === idx ? "rotate-180" : ""}`}
                  />
                </button>

                {activeMenu === idx && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-blue-100 py-3 z-50">
                    <p className="px-4 pb-2 text-[10px] font-bold text-[#25aae1] uppercase tracking-widest">
                      {menu.label}
                    </p>
                    {menu.items.map((item, i) => (
                      <a
                        key={i}
                        href="#"
                        className="flex items-start gap-3 px-4 py-2.5 hover:bg-blue-50 group transition-colors"
                      >
                        <ArrowRight
                          size={13}
                          className="mt-0.5 text-blue-200 group-hover:text-[#0f75bc] transition-colors flex-shrink-0"
                        />
                        <div>
                          <p className="text-sm font-semibold text-[#07446c] group-hover:text-[#0f75bc] transition-colors">
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-3">
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
          <div className="lg:hidden border-t border-blue-100 bg-white px-6 py-4 space-y-3">
            {megaMenuData.map((menu, idx) => (
              <div key={idx}>
                <p className="flex items-center gap-2 text-sm font-bold text-[#07446c] py-1">
                  <span className="text-[#25aae1]">{menu.icon}</span>
                  {menu.label}
                </p>
                <div className="pl-7 space-y-1 mt-1">
                  {menu.items.map((item, i) => (
                    <a
                      key={i}
                      href="#"
                      className="block text-sm text-slate-500 hover:text-[#0f75bc] py-0.5 transition-colors"
                    >
                      {item.name}
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

          {/* Background gradient blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-[#e8f4fc] rounded-full opacity-60 translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#ddf0fb] rounded-full opacity-50 -translate-x-1/4 translate-y-1/4" />
            <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-[#0f75bc]/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
          </div>

          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(#07446c 1px, transparent 1px), linear-gradient(90deg, #07446c 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative max-w-7xl mx-auto px-6 py-24 text-center w-full">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#0f75bc]/10 text-[#0f75bc] text-xs font-bold px-4 py-1.5 rounded-full mb-8 uppercase tracking-widest border border-[#0f75bc]/20">
              <Star size={11} fill="currentColor" />
              Profesyonel Online Matbaa Hizmetleri
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-black text-[#07446c] leading-tight mb-6 tracking-tight">
              Yakında{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(135deg, #0f75bc 0%, #25aae1 100%)",
                }}
              >
                Buradayız
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
              Kartvizitinizden kataloğunuza, afiş baskınızdan ambalaj çözümlerinize kadar
              tüm baskı ihtiyaçlarınız için profesyonel hizmet sunmaya hazırlanıyoruz.
            </p>

            {/* Countdown */}
            <div className="inline-flex bg-white rounded-2xl shadow-xl border border-blue-100 divide-x divide-blue-100 mb-14 overflow-hidden">
              {[
                { label: "Gün", value: "30" },
                { label: "Saat", value: "00" },
                { label: "Dakika", value: "00" },
                { label: "Saniye", value: "00" },
              ].map((t, i) => (
                <div key={i} className="px-8 py-5 text-center">
                  <div className="text-4xl font-black text-[#07446c] tabular-nums">{t.value}</div>
                  <div className="text-[10px] text-[#25aae1] font-bold uppercase tracking-widest mt-1">
                    {t.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Email capture */}
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
          style={{
            background: "linear-gradient(135deg, #07446c 0%, #0f75bc 60%, #25aae1 100%)",
          }}
        >
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-black text-white mb-4">
              Baskı İhtiyacınız mı Var?
            </h2>
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
              width={40}
              height={40}
              className="object-contain h-10 w-auto brightness-0 invert"
            />
            <div className="leading-tight">
              <p className="text-base font-black tracking-tight text-white">KMPBASKI</p>
              <p className="text-[10px] font-semibold tracking-widest text-[#25aae1] uppercase">Online Matbaa</p>
            </div>
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
