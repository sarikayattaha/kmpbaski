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
    logo: `${SITE_URL}/icon.png`,
    image: `${SITE_URL}/icon.png`,
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

// ── Product ───────────────────────────────────────────────────────────────────

export function ProductSchema({
  name,
  description,
  url,
  image,
  category,
}: {
  name: string;
  description?: string;
  url: string;
  image?: string;
  category?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    url,
    ...(description && { description }),
    ...(image && { image }),
    ...(category && { category }),
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "TRY",
      seller: { "@type": "Organization", name: SITE_NAME },
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: ld(data) }}
    />
  );
}
