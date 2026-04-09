// Statik yorum bölümü — slug'a göre deterministik shuffle ile tekrarsız seçilir

const ALL_REVIEWS = [
  { name: "Emre Y.",             rating: 5,   date: "7 Ocak 2025",     comment: "Baskı kalitesi beklentimin çok üzerindeydi. Kesinlikle tekrar sipariş vereceğim." },
  { name: "Canan A.",            rating: 4.5, date: "11 Ocak 2025",    comment: "Renkler ekrandaki gibi çıktı, çok memnun kaldım. Teslimat da hızlıydı." },
  { name: "Çınar (Kurumsal)",    rating: 5,   date: "16 Ocak 2025",    comment: "Kurumsal siparişlerimizi düzenli veriyoruz, hiç sorun yaşamadık." },
  { name: "Tolga K.",            rating: 4,   date: "22 Ocak 2025",    comment: "Kalite iyiydi, zamanında teslim ettiler. Bir dahaki siparişi de buradan veririm." },
  { name: "Akdeniz (Kurumsal)",  rating: 5,   date: "29 Ocak 2025",    comment: "Sektördeki en iyi fiyat-kalite dengesi bu firmada. Teşekkürler." },
  { name: "Merve Ş.",            rating: 5,   date: "4 Şubat 2025",    comment: "Müşteri temsilcisi çok ilgili ve yardımseverdi. Ürün de harika çıktı." },
  { name: "Kuzey (Kurumsal)",    rating: 4.5, date: "10 Şubat 2025",   comment: "Ajans olarak çalıştığımız firmalar arasında en güveniliri." },
  { name: "Hasan Ç.",            rating: 5,   date: "15 Şubat 2025",   comment: "Hız ve kalite aynı anda. Fiyatlar da gayet uygun." },
  { name: "Duygu E.",            rating: 4.5, date: "21 Şubat 2025",   comment: "İlk siparişimde çok memnun kaldım, artık başka yere bakmıyorum." },
  { name: "Metropol (Kurumsal)", rating: 5,   date: "26 Şubat 2025",   comment: "Profesyonel ekip, baskı kalitesi gerçekten üst düzey." },
  { name: "Barış A.",            rating: 4,   date: "3 Mart 2025",     comment: "Ürün tam istediğim gibi geldi, kargo süreci de sorunsuzdu." },
  { name: "Demir (Kurumsal)",    rating: 5,   date: "9 Mart 2025",     comment: "Etkinliklerimiz için düzenli sipariş veriyoruz, her zaman memnunuz." },
  { name: "Seda K.",             rating: 5,   date: "14 Mart 2025",    comment: "Renk uyumu ve baskı netliği mükemmeldi. Teşekkür ederim." },
  { name: "Yıldız (Kurumsal)",   rating: 4.5, date: "19 Mart 2025",    comment: "Kurumsal kimlik baskılarımızı yıllardır buradan yaptırıyoruz." },
  { name: "Murat G.",            rating: 5,   date: "24 Mart 2025",    comment: "Çok kaliteli iş çıkardılar. Çevremdeki herkese tavsiye ettim." },
  { name: "Pınar Y.",            rating: 4,   date: "29 Mart 2025",    comment: "Zamanında ve eksiksiz teslim. Kaliteden gayet memnunum." },
  { name: "Güven (Kurumsal)",    rating: 5,   date: "3 Nisan 2025",    comment: "Promosyon ürünlerimizi buradan alıyoruz, hiç hayal kırıklığı yaşamadık." },
  { name: "Atlas (Kurumsal)",    rating: 5,   date: "7 Nisan 2025",    comment: "Ambalaj baskılarımız için ideal bir firma. Kalite tutarlı, teslimat hızlı." },
  { name: "Tuncay B.",           rating: 4.5, date: "11 Nisan 2025",   comment: "Çok temiz baskılar çıktı. Bir dahaki siparişimde de tercihim bu firma." },
  { name: "Ufuk (Kurumsal)",     rating: 5,   date: "14 Nisan 2025",   comment: "Müşterilerimiz için hazırladığımız materyallerde hep bu firmayı kullanıyoruz." },
  { name: "Gülsen T.",           rating: 4.5, date: "17 Nisan 2025",   comment: "Sipariş süreci çok kolaydı, ürün de kaliteli geldi." },
  { name: "Kartal (Kurumsal)",   rating: 5,   date: "20 Nisan 2025",   comment: "Tanıtım materyallerimizi buradan bastırıyoruz, kaliteden hiç ödün verilmiyor." },
  { name: "Onur D.",             rating: 4,   date: "23 Nisan 2025",   comment: "Baskı kalitesi iyiydi, kargo da beklenenden hızlı geldi." },
  { name: "Palmiye (Kurumsal)",  rating: 5,   date: "26 Nisan 2025",   comment: "Ofis baskı ihtiyaçlarımızın tamamını buradan karşılıyoruz." },
  { name: "Ayşe N.",             rating: 5,   date: "29 Nisan 2025",   comment: "Ürün tam tarihinde kapıdaydı. Kalite de gayet güzeldi, teşekkürler." },
  { name: "Ege (Kurumsal)",      rating: 4.5, date: "2 Mayıs 2025",    comment: "Güvenilir ve hızlı bir firma. Kurumsal ihtiyaçlar için ideal." },
  { name: "Selçuk Ö.",           rating: 5,   date: "5 Mayıs 2025",    comment: "İlk siparişten itibaren çok memnunum. Kalite hiç düşmüyor." },
  { name: "Boztepe (Kurumsal)",  rating: 5,   date: "8 Mayıs 2025",    comment: "Ajans olarak tercih ettiğimiz tek baskı firması. Teşekkürler." },
  { name: "Derya C.",            rating: 4.5, date: "11 Mayıs 2025",   comment: "Renk kalitesi çok iyiydi, bir daha kesinlikle sipariş vereceğim." },
  { name: "Asya (Kurumsal)",     rating: 5,   date: "14 Mayıs 2025",   comment: "Promosyon siparişlerimizi her zaman zamanında ve kaliteli teslim ediyorlar." },
];

// Tekrar olmayan deterministik shuffle (Fisher-Yates + LCG seed)
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

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

type ReviewEntry = { name: string; rating: number; date: string; comment: string };

export default function ReviewsSection({ slug, reviews: productReviews }: { slug: string; reviews?: ReviewEntry[] }) {
  // Ürüne özel yorum varsa kullan, yoksa statik havuzdan seç
  let reviews: ReviewEntry[];
  if (productReviews && productReviews.length > 0) {
    reviews = productReviews;
  } else {
    const seed = slug.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const count = 4 + (seed % 3);
    reviews = seededShuffle(ALL_REVIEWS, seed).slice(0, count);
  }
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
