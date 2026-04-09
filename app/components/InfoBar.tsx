import { Zap, ShieldCheck, CreditCard, Headphones } from "lucide-react";

const infos = [
  {
    icon: <Zap size={28} />,
    title: "Hızlı Teslimat",
    desc: "Zamanında teslim güvencesi",
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Kalite Garantisi",
    desc: "Her siparişte kalite kontrolü",
  },
  {
    icon: <CreditCard size={28} />,
    title: "Güvenli Ödeme",
    desc: "256-bit SSL şifreleme",
  },
  {
    icon: <Headphones size={28} />,
    title: "Müşteri Desteği",
    desc: "Hafta içi 08:00 – 18:00",
  },
];

export default function InfoBar() {
  return (
    <section className="bg-white border-t border-b border-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {infos.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#e0f2fe] flex items-center justify-center text-[#0f75bc] flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="font-bold text-[#07446c] text-sm">{item.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
