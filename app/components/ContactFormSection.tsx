"use client";

import { useState } from "react";
import { Printer, Package, Gift, ArrowRight, Users, Clock, Star, BadgeCheck } from "lucide-react";

const STATS = [
  { value: "1000+", label: "Mutlu Müşteri",      Icon: Users       },
  { value: "30+",   label: "Yıl Deneyim",         Icon: Star        },
  { value: "24 Saat",  label: "İçinde Yanıt",      Icon: Clock       },
  { value: "%100",  label: "Yerli Üretim",         Icon: BadgeCheck  },
];

const PROJECT_TYPES = [
  { value: "Baskı",     label: "Baskı",     Icon: Printer },
  { value: "Ambalaj",   label: "Ambalaj",   Icon: Package },
  { value: "Promosyon", label: "Promosyon", Icon: Gift    },
];

const PHONE = "905541630031";

export default function ContactFormSection() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    projectType: "",
    note: "",
  });

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;

    const lines = [
      "Merhaba, kmpbaski.com üzerinden teklif talebi gönderiyorum.",
      "",
      `Ad Soyad: ${form.name}`,
      form.company ? `Şirket: ${form.company}` : null,
      `Telefon: ${form.phone}`,
      form.email ? `E-posta: ${form.email}` : null,
      form.projectType ? `Proje Türü: ${form.projectType}` : null,
      form.note ? `\nNot: ${form.note}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(lines)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const inputCls =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f75bc] transition-all bg-white";

  return (
    <section className="bg-[#f8fafc] py-14 md:py-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* Sol: başlık + istatistikler */}
          <div className="md:pt-4">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#0f75bc] mb-3">
              İletişim
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-[#07446c] mb-4 leading-tight">
              Projenizi Anlatın
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-10">
              En hızlı şekilde yanıt veriyoruz.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {STATS.map(({ value, label, Icon }) => (
                <div
                  key={label}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#0f75bc]/10 flex items-center justify-center">
                    <Icon size={18} className="text-[#0f75bc]" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-[#07446c] leading-none">{value}</p>
                    <p className="text-xs text-gray-400 mt-1 font-medium">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ: form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col gap-5">

            {/* Ad + Şirket */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  Adınız Soyadınız <span className="text-red-400">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Ahmet Yılmaz"
                  required
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  Şirket Adı <span className="text-gray-300 font-normal">(opsiyonel)</span>
                </label>
                <input
                  value={form.company}
                  onChange={set("company")}
                  placeholder="varsa"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Telefon + E-posta */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  Telefon <span className="text-red-400">*</span>
                </label>
                <input
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="+90 5__ __ __ ___"
                  required
                  type="tel"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  E-posta <span className="text-gray-300 font-normal">(opsiyonel)</span>
                </label>
                <input
                  value={form.email}
                  onChange={set("email")}
                  placeholder="varsa"
                  type="email"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Proje türü */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2">
                Ne tür bir proje?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {PROJECT_TYPES.map(({ value, label, Icon }) => {
                  const active = form.projectType === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, projectType: f.projectType === value ? "" : value }))}
                      className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 text-sm font-semibold transition-all
                        ${active
                          ? "border-[#0f75bc] bg-[#0f75bc]/5 text-[#0f75bc]"
                          : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200 hover:text-gray-600"
                        }`}
                    >
                      <Icon size={20} />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Not */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">
                Projenizi kısaca anlatın <span className="text-gray-300 font-normal">(opsiyonel)</span>
              </label>
              <textarea
                value={form.note}
                onChange={set("note")}
                rows={3}
                placeholder="Ör: 500 adet kartvizit, çift taraf renkli, mat selofan."
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* Gönder */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#0f75bc] hover:bg-[#07446c] text-white font-bold py-4 rounded-2xl transition-colors text-base shadow-md"
            >
              Teklif İsteyin <ArrowRight size={18} />
            </button>

          </form>

        </div>
      </div>
    </section>
  );
}
