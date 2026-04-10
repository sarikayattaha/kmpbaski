const MONTHS_TR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

export const SITE_URL   = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kmpbaski.com";
export const SITE_NAME  = "KMP Baskı";
export const SITE_PHONE = "+905541630031";

export function currentMonthYear(): string {
  const d = new Date();
  return `${MONTHS_TR[d.getMonth()]} ${d.getFullYear()}`;
}

/** "Baklava Kutusu Fiyatları - Nisan 2026 | KMP Baskı" */
export function pageTitle(base: string): string {
  return `${base} - ${currentMonthYear()} | ${SITE_NAME}`;
}

// ── Şehirler ──────────────────────────────────────────────────────────────────

export type City = {
  slug: string;
  name: string;
  /** Türkçe bulunma hali: "İstanbul'da", "Ankara'da" vb. */
  locative: string;
};

export const CITIES: City[] = [
  { slug: "istanbul",  name: "İstanbul",  locative: "İstanbul'da"  },
  { slug: "ankara",    name: "Ankara",    locative: "Ankara'da"    },
  { slug: "izmir",     name: "İzmir",     locative: "İzmir'de"     },
  { slug: "bursa",     name: "Bursa",     locative: "Bursa'da"     },
  { slug: "gaziantep", name: "Gaziantep", locative: "Gaziantep'te" },
  { slug: "antalya",   name: "Antalya",   locative: "Antalya'da"   },
];

// ── Ambalaj ürün listesi (6 şehir × 7 ürün = 42 sayfa) ───────────────────────

export type AmbalajSeoProduct = {
  slug: string;
  name: string;
  description: string;
  /** Hangi kağıt/malzeme kullanılır — FAQ için */
  materials: string;
};

export const AMBALAJ_SEO_PRODUCTS: AmbalajSeoProduct[] = [
  {
    slug: "baklava-kutusu",
    name: "Baklava Kutusu",
    description: "Markalı ve özel baskılı baklava kutusu imalatı. Lüks sunum için özel tasarım, toptan fiyat.",
    materials: "300-400 g/m² Bristol karton, mat veya parlak selefon kaplama, UV lak",
  },
  {
    slug: "pide-kutusu",
    name: "Pide Kutusu",
    description: "Fırın ve restoranlar için dayanıklı, markalı pide kutusu üretimi. Hava delikli ve gıda güvenli.",
    materials: "Mikro oluklu E-tipi karton, kraft iç kaplama, gıda onaylı baskı mürekkepleri",
  },
  {
    slug: "lahmacun-kutusu",
    name: "Lahmacun Kutusu",
    description: "Pratik taşıma ve sunum için özel tasarımlı lahmacun kutusu, tam renk baskı seçeneği.",
    materials: "Mikro oluklu B-tipi karton, yağa dayanıklı iç kaplama, tek veya çift taraf baskı",
  },
  {
    slug: "pizza-kutusu",
    name: "Pizza Kutusu",
    description: "Restoranlar ve fast-food işletmeleri için markalı pizza kutusu baskısı.",
    materials: "Mikro oluklu C/E-tipi karton, gıda güvenli baskı, havalandırma deliği seçeneği",
  },
  {
    slug: "pasta-kutusu",
    name: "Pasta Kutusu",
    description: "Butik pastane ve cafe'ler için özel pasta kutusu tasarım ve baskısı.",
    materials: "350-400 g/m² Bristol karton, mat selefon, isteğe göre PET pencere seçeneği",
  },
  {
    slug: "karton-canta",
    name: "Karton Çanta",
    description: "Kurumsal etkinlik, mağaza ve hediye için özel baskılı karton çanta üretimi.",
    materials: "250-350 g/m² parlak veya mat kağıt, kordela veya pvc sap, güçlendirilmiş taban",
  },
  {
    slug: "durum-kagidi",
    name: "Dürüm Kağıdı",
    description: "Dürüm ve wrap ürünleri için markalı, gıda güvenli baskılı kağıt üretimi.",
    materials: "40-50 g/m² greaseproof (yağa dayanıklı) kağıt, gıda onaylı soya bazlı mürekkep",
  },
];

export function getCityBySlug(slug: string): City | null {
  return CITIES.find(c => c.slug === slug) ?? null;
}

export function getSeoProductBySlug(slug: string): AmbalajSeoProduct | null {
  return AMBALAJ_SEO_PRODUCTS.find(p => p.slug === slug) ?? null;
}
