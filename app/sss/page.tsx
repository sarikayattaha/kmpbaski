"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Minimum sipariş adedi nedir?",
    a: "Ürüne göre değişmekle birlikte çoğu ürünümüzde minimum sipariş adedi 100 adetten başlamaktadır. Bazı özel ürünlerde daha düşük adetlerde de sipariş verilebilir. Detaylı bilgi için bizimle iletişime geçin.",
  },
  {
    q: "Teslimat süresi ne kadar?",
    a: "Standart baskı ürünlerinde üretim süresi 2-5 iş günüdür. Üretim tamamlandıktan sonra kargo ile 1-3 iş günü içinde teslim edilir. Acil siparişler için ekspres üretim seçeneğimiz mevcuttur.",
  },
  {
    q: "Fiyat teklifi nasıl alabilirim?",
    a: "Sitemizin iletişim formunu doldurabilir, WhatsApp hattımızdan mesaj gönderebilir veya +90 554 163 00 31 numaralı telefonumuzu arayabilirsiniz. 24 saat içinde size geri dönüş yapıyoruz.",
  },
  {
    q: "Tasarım hizmetiniz var mı?",
    a: "Evet, profesyonel tasarım ekibimiz sizin için özel tasarımlar hazırlayabilir. Kendi tasarımınızı da gönderebilirsiniz; baskıya uygun formata (PDF, AI, EPS) dönüştürmenizde yardımcı olabiliriz.",
  },
  {
    q: "Hangi dosya formatlarını kabul ediyorsunuz?",
    a: "PDF (baskıya hazır), AI (Adobe Illustrator), EPS ve yüksek çözünürlüklü TIFF/PNG formatlarını kabul ediyoruz. Minimum çözünürlük 300 DPI olmalıdır. Renk modu CMYK tercih edilir.",
  },
  {
    q: "Kargo ücretsiz mi?",
    a: "Belirli bir tutar üzerindeki siparişlerde kargo ücretsizdir. Detaylı bilgi için sipariş aşamasında veya müşteri hizmetlerimizden öğrenebilirsiniz.",
  },
  {
    q: "Dijital baskı mı, ofset baskı mı kullanıyorsunuz?",
    a: "Her ikisini de kullanıyoruz. Düşük adetli siparişler için dijital baskı, yüksek adetli ve daha ekonomik siparişler için ofset baskı tercih edilir. Ürüne ve adete göre en uygun yöntemi size öneriyoruz.",
  },
  {
    q: "Numune sipariş verebilir miyim?",
    a: "Bazı ürünlerimiz için numune talep edebilirsiniz. Numune fiyatları ve koşulları için müşteri hizmetlerimizle iletişime geçmenizi öneririz.",
  },
  {
    q: "İade ve değişim politikanız nedir?",
    a: "Üretim hatasından kaynaklanan sorunlarda ürünü yeniden basıyoruz. Baskı onayladıktan sonra gerçekleşen tasarım hatalarında iade kabul edilmemektedir. Bu nedenle sipariş öncesinde baskı provası almanızı öneririz.",
  },
  {
    q: "Türkiye genelinde teslimat yapıyor musunuz?",
    a: "Evet, anlaşmalı kargo firmalarımız aracılığıyla Türkiye'nin tüm illerine teslimat yapıyoruz.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-[#f0f9ff] transition-colors"
      >
        <span className="font-bold text-[#07446c] text-sm md:text-base pr-4">{q}</span>
        <ChevronDown
          size={18}
          className={`text-[#0f75bc] flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 pt-1 bg-white border-t border-gray-50">
          <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function SSSPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 text-xs text-gray-400">
          <a href="/" className="hover:text-[#0f75bc] transition-colors">Ana Sayfa</a>
          <span className="mx-2">/</span>
          <span className="text-[#07446c] font-semibold">Sıkça Sorulan Sorular</span>
        </div>
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12 md:py-16">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#0f75bc] mb-3">SSS</p>
          <h1 className="text-4xl font-black text-[#07446c] mb-3">Sıkça Sorulan Sorular</h1>
          <p className="text-gray-500">
            Aklınızdaki sorunun cevabını bulamadıysanız{" "}
            <a href="/iletisim" className="text-[#0f75bc] font-semibold hover:underline">
              bizimle iletişime geçin
            </a>
            .
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
