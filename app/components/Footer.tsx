import Image from "next/image";
import { Clock, Phone, MapPin } from "lucide-react";

const col1 = {
  title: "Müşteri İlişkileri",
  links: [
    "Üyelik Sözleşmesi",
    "İade / Değişim",
    "KVKK Aydınlatma Metni",
    "Güvenli Alışveriş",
    "Kargo",
    "Yardım Merkezi",
  ],
};

const col2 = {
  title: "Hakkımızda",
  links: [
    "Hakkımızda",
    "Sıkça Sorulan Sorular",
    "İletişim",
    "Teklif İste",
    "Kariyer",
    "Blog",
  ],
};

const col3 = {
  title: "Tüm Ürünler",
  links: [
    "Tüm Matbaa Baskı Ürünleri",
    "Kartvizitler",
    "Broşür & Katalog",
    "Tabela & Afiş",
    "Ambalaj Ürünleri",
    "Promosyon Ürünleri",
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#07446c] text-blue-200">
      {/* Ana footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Kolon 1 */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-4">{col1.title}</p>
          <ul className="space-y-2">
            {col1.links.map((l) => (
              <li key={l}>
                <a href="#" className="text-sm text-blue-200 hover:text-white transition-colors">{l}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Kolon 2 */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-4">{col2.title}</p>
          <ul className="space-y-2">
            {col2.links.map((l) => (
              <li key={l}>
                <a href="#" className="text-sm text-blue-200 hover:text-white transition-colors">{l}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Kolon 3 */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-4">{col3.title}</p>
          <ul className="space-y-2">
            {col3.links.map((l) => (
              <li key={l}>
                <a href="#" className="text-sm text-blue-200 hover:text-white transition-colors">{l}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Kolon 4 — İletişim */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-4">İletişim Bilgileri</p>
          <ul className="space-y-3">
            <li className="flex items-start gap-2.5 text-sm">
              <Clock size={15} className="mt-0.5 flex-shrink-0 text-[#25aae1]" />
              <span>Hafta içi 08:00 – 18:00</span>
            </li>
            <li className="flex items-start gap-2.5 text-sm">
              <Phone size={15} className="mt-0.5 flex-shrink-0 text-[#25aae1]" />
              <a href="tel:08500000000" className="hover:text-white transition-colors">
                0850 000 00 00
              </a>
            </li>
            <li className="flex items-start gap-2.5 text-sm">
              <MapPin size={15} className="mt-0.5 flex-shrink-0 text-[#25aae1]" />
              <span>İstanbul, Türkiye</span>
            </li>
          </ul>

          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 mt-8">
            <Image
              src="/kmpbaskilogo.png"
              alt="KMP Baskı"
              width={36}
              height={36}
              className="object-contain h-9 w-auto brightness-0 invert opacity-80"
            />
            <span className="text-lg font-black tracking-tight">
              <span className="text-white">KMP</span>
              <span className="text-[#25aae1]"> BASKI</span>
            </span>
          </a>
        </div>
      </div>

      {/* Alt bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-blue-300">
          <span>© {new Date().getFullYear()} KMP Baskı — Tüm hakları saklıdır.</span>
          <div className="flex gap-4">
            {["Gizlilik Politikası", "KVKK", "Çerez Politikası"].map((l) => (
              <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
