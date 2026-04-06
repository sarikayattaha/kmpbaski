"use client";

import { useState } from "react";
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

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* TOP BAR */}
      <div className="bg-gray-900 text-gray-300 text-xs py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <Phone size={12} /> 0850 000 00 00
            </span>
            <span className="flex items-center gap-1">
              <Mail size={12} /> info@kmpbaski.com
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={12} /> İstanbul, Türkiye
            </span>
          </div>
          <div className="flex items-center gap-1 text-yellow-400">
            <Clock size={12} />
            <span>Pazartesi – Cuma: 08:00 – 18:00</span>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          {/* LOGO */}
          <div className="flex items-center gap-2">
            <div className="bg-red-600 rounded-lg p-2">
              <Printer size={22} className="text-white" />
            </div>
            <div className="leading-tight">
              <div>
                <span className="font-black text-xl tracking-tight text-gray-900">KMP</span>
                <span className="font-black text-xl tracking-tight text-red-600">BASKI</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-none tracking-widest uppercase">
                Online Matbaa
              </p>
            </div>
          </div>

          {/* MEGA MENU — desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {megaMenuData.map((menu, idx) => (
              <div
                key={idx}
                className="relative"
                onMouseEnter={() => setActiveMenu(idx)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 rounded-md transition-colors">
                  {menu.icon}
                  {menu.label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${activeMenu === idx ? "rotate-180" : ""}`}
                  />
                </button>

                {activeMenu === idx && (
                  <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 py-3 z-50">
                    <p className="px-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {menu.label}
                    </p>
                    {menu.items.map((item, i) => (
                      <a
                        key={i}
                        href="#"
                        className="flex items-start gap-3 px-4 py-2.5 hover:bg-red-50 group transition-colors"
                      >
                        <ArrowRight
                          size={14}
                          className="mt-0.5 text-gray-300 group-hover:text-red-500 transition-colors flex-shrink-0"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-800 group-hover:text-red-600">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="hidden md:inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <Phone size={14} /> Teklif Al
            </a>
            <button
              className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
            {megaMenuData.map((menu, idx) => (
              <div key={idx}>
                <p className="flex items-center gap-2 text-sm font-semibold text-gray-700 py-2">
                  {menu.icon} {menu.label}
                </p>
                <div className="pl-6 space-y-1">
                  {menu.items.map((item, i) => (
                    <a
                      key={i}
                      href="#"
                      className="block text-sm text-gray-600 hover:text-red-600 py-1"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </header>

      {/* HERO */}
      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-red-50 min-h-[90vh] flex items-center">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-100 rounded-full opacity-30 translate-x-1/3 -translate-y-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-50 rounded-full opacity-40 -translate-x-1/4 translate-y-1/4 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 py-24 text-center w-full">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
              <Star size={12} fill="currentColor" />
              Profesyonel Online Matbaa Hizmetleri
            </div>

            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight mb-6">
              Yakında{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">
                Buradayız
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Kartvizitinizden kataloğunuza, afiş baskınızdan ambalaj çözümlerinize kadar
              tüm baskı ihtiyaçlarınız için profesyonel hizmet sunmaya hazırlanıyoruz.
            </p>

            {/* Countdown card */}
            <div className="inline-block bg-white rounded-2xl shadow-xl border border-gray-100 px-8 py-6 mb-12">
              <div className="flex items-center justify-center gap-8">
                {[
                  { label: "Gün", value: "30" },
                  { label: "Saat", value: "00" },
                  { label: "Dakika", value: "00" },
                  { label: "Saniye", value: "00" },
                ].map((t, i) => (
                  <div key={i} className="text-center">
                    <div className="text-4xl font-black text-gray-900 tabular-nums">{t.value}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">{t.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Email capture */}
            <div className="max-w-md mx-auto">
              <p className="text-sm text-gray-500 mb-3">
                Açılıştan haberdar olun, özel lansman indirimine hak kazanın!
              </p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
                >
                  Beni Bildir
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="bg-white py-20 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-center text-sm font-semibold text-red-600 uppercase tracking-widest mb-3">
              Neden KMP Baskı?
            </p>
            <h2 className="text-3xl font-black text-center text-gray-900 mb-12">
              Fark Yaratan Hizmetler
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Printer size={28} className="text-red-600" />,
                  title: "Yüksek Baskı Kalitesi",
                  desc: "Son teknoloji ofset ve dijital baskı makinelerimizle mükemmel sonuçlar.",
                },
                {
                  icon: <Clock size={28} className="text-red-600" />,
                  title: "Hızlı Teslimat",
                  desc: "Sipariş onayından itibaren 24 saatte kapınıza teslim seçenekleri.",
                },
                {
                  icon: <Package size={28} className="text-red-600" />,
                  title: "Geniş Ürün Yelpazesi",
                  desc: "Kartvizittten büyük format baskıya, promosyondan ambalaja her şey.",
                },
                {
                  icon: <Star size={28} className="text-red-600" />,
                  title: "Uzman Destek",
                  desc: "Tasarım ve baskı uzmanlarımız her adımda yanınızda.",
                },
              ].map((f, i) => (
                <div
                  key={i}
                  className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border border-gray-100"
                >
                  <div className="bg-red-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 rounded-lg p-1.5">
              <Printer size={16} className="text-white" />
            </div>
            <span className="font-black text-white">
              KMP<span className="text-red-500">BASKI</span>
            </span>
          </div>
          <p className="text-xs text-center">
            © {new Date().getFullYear()} KMP Baskı — Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a>
            <a href="#" className="hover:text-white transition-colors">KVKK</a>
            <a href="#" className="hover:text-white transition-colors">İletişim</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
