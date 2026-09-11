import { SITE_NAME, SITE_URL, SITE_PHONE } from "@/lib/seo";

function ld(data: object) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

// ── Organization (LocalBusiness) ──────────────────────────────────────────────

export function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": SITE_URL,
    name: SITE_NAME,
    url: SITE_URL,
    telephone: SITE_PHONE,
    logo: `${SITE_URL}/kmpbaskilogo.png`,
    image: `${SITE_URL}/kmpbaskilogo.png`,
    priceRange: "₺₺",
    address: {
      "@type": "PostalAddress",
      addressCountry: "TR",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    sameAs: [],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: ld(data) }}
    />
  );
}

// ── WebSite ───────────────────────────────────────────────────────────────────

export function WebSiteSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/tum-urunler?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: ld(data) }}
    />
  );
}

// ── SiteNavigationElement — Google sitelink sinyali ──────────────────────────

export function SiteNavigationSchema() {
  const navItems = [
    { name: "Karton Çanta",       url: `${SITE_URL}/urun/karton-canta` },
    { name: "Kraft Karton Çanta", url: `${SITE_URL}/urun/kraft-karton-canta` },
    { name: "Taşlama Kutu",       url: `${SITE_URL}/urun/taslama-kutu` },
    { name: "Küp Bloknot",        url: `${SITE_URL}/urun/kup-bloknot` },
  ];

  const data = navItems.map((item) => ({
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: item.name,
    url: item.url,
  }));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: ld(data) }}
    />
  );
}

// ── FAQPage ───────────────────────────────────────────────────────────────────

export function FAQSchema({ faqs }: { faqs: { q: string; a: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: ld(data) }}
    />
  );
}

// ── BreadcrumbList ────────────────────────────────────────────────────────────

export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: ld(data) }}
    />
  );
}

// ── ItemList — kategori/liste sayfaları için ─────────────────────────────────

export function ItemListSchema({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: ld(data) }}
    />
  );
}

// ── Product ───────────────────────────────────────────────────────────────────

// Serbest metin fiyatları ("₺120", "120,00 ₺", "1.200,50 TL") schema.org'un
// beklediği ondalık-noktalı sayı formatına çevirir. Ayrıştırılamayan veya
// anlamsız (<= 0) değerlerde null döner — offers o zaman hiç eklenmez.
function parsePrice(raw?: string): string | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[^\d.,]/g, "").trim();
  if (!cleaned) return null;
  const normalized = cleaned.includes(",")
    ? cleaned.replace(/\./g, "").replace(",", ".")
    : cleaned;
  const num = parseFloat(normalized);
  if (!isFinite(num) || num <= 0) return null;
  return num.toFixed(2);
}

export function ProductSchema({
  name,
  description,
  url,
  image,
  category,
  price,
  isPriceOnRequest,
}: {
  name: string;
  description?: string;
  url: string;
  image?: string;
  category?: string;
  price?: string;
  isPriceOnRequest?: boolean;
}) {
  const parsedPrice = isPriceOnRequest ? null : parsePrice(price);
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    url,
    ...(description && { description }),
    ...(image && { image }),
    ...(category && { category }),
    brand: { "@type": "Brand", name: SITE_NAME },
    ...(parsedPrice && {
      offers: {
        "@type": "Offer",
        url,
        priceCurrency: "TRY",
        price: parsedPrice,
        availability: "https://schema.org/InStock",
      },
    }),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: ld(data) }}
    />
  );
}
