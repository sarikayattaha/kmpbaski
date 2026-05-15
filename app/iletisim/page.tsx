import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ContactFormSection from "@/app/components/ContactFormSection";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "KMP Baskı ile iletişime geçin. Kartvizit, broşür, katalog, tabela ve ambalaj baskı talepleriniz için hızlıca teklif alın. +90 554 163 00 31",
  alternates: { canonical: "/iletisim" },
};

const CONTACT_INFO = [
  {
    Icon: Phone,
    label: "Telefon",
    value: "+90 554 163 00 31",
    href: "tel:+905541630031",
  },
  {
    Icon: Mail,
    label: "E-posta",
    value: "info@kmpprint.net",
    href: "mailto:info@kmpprint.net",
  },
  {
    Icon: MapPin,
    label: "Adres",
    value: "Topkapı 2.Matbaacılar Sitesi 1BD2, Zeytinburnu / İstanbul",
    href: null,
  },
  {
    Icon: Clock,
    label: "Çalışma Saatleri",
    value: "Pazartesi – Cuma: 08:00 – 18:00",
    href: null,
  },
];

export default function IletisimPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 text-xs text-gray-400">
          <a href="/" className="hover:text-[#0f75bc] transition-colors">Ana Sayfa</a>
          <span className="mx-2">/</span>
          <span className="text-[#07446c] font-semibold">İletişim</span>
        </div>
      </div>

      <main className="flex-1">
        {/* Başlık */}
        <div className="max-w-7xl mx-auto px-4 pt-10 pb-4 text-center">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#0f75bc] mb-3">
            İletişim
          </p>
          <h1 className="text-4xl font-black text-[#07446c] mb-3">Bize Ulaşın</h1>
          <p className="text-gray-500">En hızlı şekilde yanıt veriyoruz.</p>
        </div>

        {/* İletişim bilgileri */}
        <section className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CONTACT_INFO.map(({ Icon, label, value, href }) => (
            <div
              key={label}
              className="bg-[#f0f9ff] rounded-2xl p-6 flex flex-col gap-3"
            >
              <div className="w-10 h-10 bg-[#0f75bc]/10 rounded-xl flex items-center justify-center">
                <Icon size={18} className="text-[#0f75bc]" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                  {label}
                </p>
                {href ? (
                  <a
                    href={href}
                    className="text-sm font-semibold text-[#07446c] hover:text-[#0f75bc] transition-colors leading-snug"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="text-sm font-semibold text-[#07446c] leading-snug">{value}</p>
                )}
              </div>
            </div>
          ))}
        </section>

        <ContactFormSection />
      </main>

      <Footer />
    </div>
  );
}
