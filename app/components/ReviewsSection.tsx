// Statik yorum bölümü — slug'a göre deterministik olarak farklı yorumlar seçilir

const ALL_REVIEWS = [
  { name: "Ahmet Y.",              rating: 5,   date: "12 Mart 2025",    comment: "Çok hızlı geldi, baskı kalitesi gerçekten iyi. Tekrar sipariş vereceğim." },
  { name: "Selin K.",              rating: 4.5, date: "3 Şubat 2025",    comment: "Beklediğimden güzel çıktı. Renk uyumu tam istediğim gibiydi." },
  { name: "Marka İletişim A.Ş.",   rating: 5,   date: "27 Ocak 2025",    comment: "Kurumsal siparişlerimizi buradan veriyoruz, her seferinde memnun kalıyoruz." },
  { name: "Fatma D.",              rating: 4,   date: "8 Nisan 2025",    comment: "Zamanında teslim edildi, kalite iyiydi. Hizmet için teşekkürler." },
  { name: "Kerem B.",              rating: 5,   date: "19 Mart 2025",    comment: "Harika iş çıkardılar. Müşteri hizmetleri de çok ilgiliydi." },
  { name: "Zeynep A.",             rating: 4.5, date: "1 Mart 2025",     comment: "İlk siparişimdi, çok memnun kaldım. Kesinlikle tekrar kullanacağım." },
  { name: "Oğuz T.",              rating: 5,   date: "22 Şubat 2025",   comment: "Hız ve kalite bir arada. Fiyat performans çok iyi." },
  { name: "Ayla M.",               rating: 4.5, date: "14 Ocak 2025",    comment: "Baskılar çok temiz çıktı. Hızlı kargo için teşekkürler." },
  { name: "Pronto Reklam Ltd.",    rating: 5,   date: "9 Nisan 2025",    comment: "Profesyonel ekip, kaliteli baskı. Referans olarak göstereceğiz." },
  { name: "Burak Ş.",             rating: 4,   date: "5 Şubat 2025",    comment: "Siparişim eksiksiz geldi, baskı kalitesinden memnunum." },
  { name: "Nilüfer C.",            rating: 5,   date: "17 Mart 2025",    comment: "Çok şık oldu, tam istediğim kalitede. Hızlı teslimat süpriz yaptı." },
  { name: "Doruk Medya A.Ş.",     rating: 4.5, date: "2 Nisan 2025",    comment: "Sektörde çalıştığımız en güvenilir baskı firması." },
];

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <svg key={`f${i}`} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 00-.364 1.118l1.286 3.958c.3.921-.755 1.688-1.54 1.118l-3.368-2.447a1 1 0 00-1.175 0l-3.368 2.447c-.784.57-1.838-.197-1.54-1.118l1.286-3.958a1 1 0 00-.364-1.118L2.062 9.385c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z"/>
        </svg>
      ))}
      {half && (
        <svg className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="#facc15"/>
              <stop offset="50%" stopColor="#d1d5db"/>
            </linearGradient>
          </defs>
          <path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 00-.364 1.118l1.286 3.958c.3.921-.755 1.688-1.54 1.118l-3.368-2.447a1 1 0 00-1.175 0l-3.368 2.447c-.784.57-1.838-.197-1.54-1.118l1.286-3.958a1 1 0 00-.364-1.118L2.062 9.385c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z"/>
        </svg>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <svg key={`e${i}`} className="w-4 h-4 text-gray-200" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 00-.364 1.118l1.286 3.958c.3.921-.755 1.688-1.54 1.118l-3.368-2.447a1 1 0 00-1.175 0l-3.368 2.447c-.784.57-1.838-.197-1.54-1.118l1.286-3.958a1 1 0 00-.364-1.118L2.062 9.385c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z"/>
        </svg>
      ))}
    </span>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default function ReviewsSection({ slug }: { slug: string }) {
  // slug'u sayıya çevirip reviews seçiyoruz — her ürün farklı ama tutarlı yorum seti görsün
  const seed = slug.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const count = 4 + (seed % 3); // 4, 5 veya 6 yorum
  const reviews = Array.from({ length: count }, (_, i) =>
    ALL_REVIEWS[(seed + i * 3) % ALL_REVIEWS.length]
  );
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const avgDisplay = Math.round(avg * 10) / 10;

  return (
    <section className="max-w-5xl mx-auto px-6 pb-16">
      <div className="border-t border-gray-100 pt-12">
        <div className="flex items-end gap-5 mb-8">
          <div>
            <h2 className="text-xl font-black text-[#07446c]">Müşteri Yorumları</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <Stars rating={avgDisplay} />
              <span className="text-sm font-bold text-gray-700">{avgDisplay.toFixed(1)}</span>
              <span className="text-sm text-gray-400">/ 5 · {reviews.length} değerlendirme</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {reviews.map((r, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-5 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0f75bc] text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                  {initials(r.name)}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 leading-none">{r.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{r.date}</p>
                </div>
                <div className="ml-auto">
                  <Stars rating={r.rating} />
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
