import {
  Calendar,
  Coffee,
  GraduationCap,
  HeartPulse,
  Building2,
  Store,
  Truck,
  Utensils,
} from "lucide-react";

const sectors = [
  { icon: <Calendar size={36} strokeWidth={1.4} />, label: "Fuar / Etkinlik\nÜrünleri" },
  { icon: <Coffee size={36} strokeWidth={1.4} />, label: "Restoran / Cafe\nÜrünleri" },
  { icon: <GraduationCap size={36} strokeWidth={1.4} />, label: "Eğitim\nSektörü" },
  { icon: <HeartPulse size={36} strokeWidth={1.4} />, label: "Sağlık\nSektörü" },
  { icon: <Building2 size={36} strokeWidth={1.4} />, label: "Emlak / Gayrimenkul\nÜrünleri" },
  { icon: <Store size={36} strokeWidth={1.4} />, label: "Mağaza / Market\nÜrünleri" },
  { icon: <Truck size={36} strokeWidth={1.4} />, label: "Lojistik\nSektörü" },
  { icon: <Utensils size={36} strokeWidth={1.4} />, label: "Gıda\nSektörü" },
];

export default function SectorGrid() {
  return (
    <section className="bg-[#f8fafc] py-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-black text-[#07446c] mb-8">Sektörlere Göre Ürünler</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {sectors.map((s, i) => (
            <a
              key={i}
              href="#"
              className="flex flex-col items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl hover:border-[#0f75bc] hover:shadow-md hover:-translate-y-1 transition-all duration-200 group text-center"
            >
              <span className="text-gray-400 group-hover:text-[#0f75bc] transition-colors">
                {s.icon}
              </span>
              <p className="text-[11px] font-bold text-gray-500 group-hover:text-[#0f75bc] uppercase tracking-wide leading-tight whitespace-pre-line transition-colors">
                {s.label}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
