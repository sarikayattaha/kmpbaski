const MONTHS_TR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

export const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kmpbaski.com";
export const SITE_NAME = "KMP Baskı";
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
  { slug: "istanbul",  name: "İstanbul",  locative: "İstanbul'da" },
  { slug: "ankara",    name: "Ankara",    locative: "Ankara'da"   },
  { slug: "izmir",     name: "İzmir",     locative: "İzmir'de"    },
  { slug: "bursa",     name: "Bursa",     locative: "Bursa'da"    },
  { slug: "gaziantep", name: "Gaziantep", locative: "Gaziantep'te"},
  { slug: "antalya",   name: "Antalya",   locative: "Antalya'da"  },
];

// ── Ambalaj ürün listesi ───────────────────────────────────────────────────────

export type AmbalajSeoProduct = {
  slug: string;
  name: string;
  description: string;
};

export const AMBALAJ_SEO_PRODUCTS: AmbalajSeoProduct[] = [
  {
    slug: "baklava-kutusu",
    name: "Baklava Kutusu",
    description: "Markalı ve özel baskılı baklava kutusu imalatı. Lüks sunum için özel tasarım, toptan fiyat.",
  },
  {
    slug: "pasta-kutusu",
    name: "Pasta Kutusu",
    description: "Butik pastane ve cafe'ler için özel pasta kutusu tasarım ve baskısı.",
  },
  {
    slug: "pizza-kutusu",
    name: "Pizza Kutusu",
    description: "Restoranlar ve fast-food işletmeleri için markalı pizza kutusu baskısı.",
  },
  {
    slug: "kek-kutusu",
    name: "Kek Kutusu",
    description: "Özel tasarım kek kutusu baskı ve imalatı, tek renk veya tam baskı seçeneği.",
  },
  {
    slug: "hamburger-kutusu",
    name: "Hamburger Kutusu",
    description: "Fast-food işletmeleri için dayanıklı ve markalı hamburger kutusu üretimi.",
  },
  {
    slug: "lokum-kutusu",
    name: "Lokum Kutusu",
    description: "Geleneksel ve modern tasarımlı lokum kutusu imalatı, hediyelik sunum çözümleri.",
  },
  {
    slug: "karton-kutu",
    name: "Karton Kutu",
    description: "Her ölçü ve gramajda özel baskılı karton kutu üretimi ve toptan satış.",
  },
  {
    slug: "hediye-kutusu",
    name: "Hediye Kutusu",
    description: "Kurumsal ve bireysel kullanım için özel tasarım hediye kutusu baskısı.",
  },
];

export function getCityBySlug(slug: string): City | null {
  return CITIES.find(c => c.slug === slug) ?? null;
}

export function getSeoProductBySlug(slug: string): AmbalajSeoProduct | null {
  return AMBALAJ_SEO_PRODUCTS.find(p => p.slug === slug) ?? null;
}
