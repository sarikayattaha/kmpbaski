import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Users, Star, Clock, BadgeCheck, MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "KMP Baskı olarak 30+ yıllık deneyimimizle kartvizit, broşür, katalog, tabela, ambalaj ve promosyon baskıda profesyonel hizmet sunuyoruz. İstanbul Zeytinburnu'dan Türkiye'ye.",
  alternates: { canonical: "/hakkimizda" },
};

const STATS = [
  { value: "1000+", label: "Mutlu Müşteri", Icon: Users },
  { value: "30+",   label: "Yıl Deneyim",   Icon: Star },
  { value: "150+",  label: "Ürün Çeşidi",   Icon: Clock },
  { value: "%100",  label: "Yerli Üretim",   Icon: BadgeCheck },
];

const VALUES = [
  { title: "Kalite", desc: "Her baskıda en yüksek kalite standartlarını koruyoruz. Alman ve Japon makinelerimizle kusursuz sonuçlar üretiyoruz." },
  { title: "Hız",    desc: "Siparişlerinizi en kısa sürede teslim ediyoruz. Acil siparişler için ekspres seçeneklerimiz mevcuttur." },
  { title: "Güven",  desc: "Müşteri memnuniyeti her zaman önceliğimizdir. 1000'den fazla mutlu müşterimiz buna tanıklık ediyor." },
  { title: "Yerli Üretim", desc: "Tüm ürünlerimizi Türkiye'de, kendi tesislerimizde üretiyoruz. Dışa bağımlılık yok." },
];

export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Hero */}
      <div className="bg-[#07446c] text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#25aae1] mb-4">
            Hakkımızda
          </p>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            Profesyonel Baskı<br />ve Ambalaj Çözümleri
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed max-w-2xl mx-auto">
            KMP Baskı olarak İstanbul&apos;dan tüm Dünya&apos;ya
            kaliteli baskı ve ambalaj hizmetleri sunuyoruz.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-[#0f75bc] py-12">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {STATS.map(({ value, label, Icon }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <Icon size={24} className="text-[#25aae1]" />
              <p className="text-4xl font-black">{value}</p>
              <p className="text-sm text-blue-100">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <main className="flex-1">
        {/* Hikaye */}
        <section className="max-w-4xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#0f75bc] mb-3">
                Hikayemiz
              </p>
              <h2 className="text-3xl font-black text-[#07446c] mb-6 leading-tight">
                30 Yılı Aşkın Tecrübe
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-[15px]">
                <p>
                  KMP Baskı, onlarca yıllık sektör deneyimiyle İstanbul Zeytinburnu
                  Matbaacılar Sitesi&apos;nden hizmet vermektedir.
                </p>
                <p>
                  Kartvizit, broşür, katalog, tabela, ambalaj ve promosyon ürünleri
                  başta olmak üzere 150&apos;nin üzerinde baskı ürününü en yüksek kalite
                  standartlarında üretiyoruz.
                </p>
                <p>
                  Modern makinelerimiz ve uzman ekibimizle, küçük işletmelerden
                  büyük kurumsal firmalara kadar herkese özel çözümler sunuyoruz.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {VALUES.map((v) => (
                <div key={v.title} className="bg-[#f0f9ff] rounded-2xl p-5">
                  <h3 className="font-black text-[#07446c] mb-2 text-sm">{v.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* İletişim bilgileri */}
        <section className="bg-[#f8fafc] border-t border-gray-100 py-16">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#0f75bc] mb-3 text-center">
              Bize Ulaşın
            </p>
            <h2 className="text-3xl font-black text-[#07446c] mb-10 text-center">Konumumuz</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="flex items-start gap-3 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <MapPin size={20} className="text-[#0f75bc] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Adres</p>
                  <p className="text-sm text-[#07446c] font-semibold leading-snug">
                    Topkapı 2.Matbaacılar Sitesi 1BD2<br />Zeytinburnu / İstanbul
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <Phone size={20} className="text-[#0f75bc] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Telefon</p>
                  <a href="tel:+905541630031" className="text-sm text-[#07446c] font-semibold hover:text-[#0f75bc] transition-colors">
                    +90 554 163 00 31
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <Mail size={20} className="text-[#0f75bc] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">E-posta</p>
                  <a href="mailto:info@kmpprint.net" className="text-sm text-[#07446c] font-semibold hover:text-[#0f75bc] transition-colors">
                    info@kmpprint.net
                  </a>
                </div>
              </div>
            </div>
            <div className="text-center">
              <Link
                href="/iletisim"
                className="inline-flex items-center gap-2 bg-[#0f75bc] hover:bg-[#07446c] text-white font-bold px-8 py-4 rounded-2xl transition-colors"
              >
                Teklif İsteyin
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
