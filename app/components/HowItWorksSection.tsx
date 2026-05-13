const steps = [
  {
    num: "01",
    emoji: "📞",
    title: "Bize Ulaşın ve Planlayalım",
    desc: "WhatsApp veya telefon üzerinden projenizi anlatın. Uzman ekibimiz, projenize en uygun baskı spesifikasyonlarını belirleyerek en kısa zamanda size özel fiyat çalışmasını sunar.",
  },
  {
    num: "02",
    emoji: "🎨",
    title: "Teknik Kontrol ve Onay",
    desc: "Baskıya hazır dosyanızı gönderin veya profesyonel tasarım ekibimizle birlikte kurgulayalım. Kağıt kalitesinden baskı detaylarına kadar tüm aşamalar sizin onayınızla ilerler.",
  },
  {
    num: "03",
    emoji: "🚀",
    title: "Hızlı Üretim ve Teslimat",
    desc: "Üretim merkezimizde titizlikle hazırlanan siparişleriniz, Türkiye geneli güvenli kargo seçenekleriyle tam zamanında kapınıza gelir.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-white py-14 md:py-20 border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-4">

        {/* Üst başlık */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">
            Nasıl Çalışır?
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-[#07446c] mb-4">
            3 Adımda Kusursuz Baskı
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
            KMP Baskı güvencesiyle, kağıt seçiminden kapınıza kadar her adım profesyonel, hızlı ve şeffaf.
          </p>
        </div>

        {/* Adım kartları */}
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="relative bg-[#f8fafc] rounded-3xl p-8 flex flex-col gap-4"
            >
              {/* Numara + emoji */}
              <div className="flex items-center gap-3">
                <span className="text-5xl font-black text-gray-100 select-none leading-none">
                  {step.num}
                </span>
                <span className="text-3xl leading-none">{step.emoji}</span>
              </div>

              {/* Ayraç çizgi (son kart hariç, yalnızca desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-[4.5rem] -right-3 w-6 h-px bg-gray-200" />
              )}

              <h3 className="text-lg font-black text-[#07446c]">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
