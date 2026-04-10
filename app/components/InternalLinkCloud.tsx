import { CITIES, AMBALAJ_SEO_PRODUCTS } from "@/lib/seo";

type Props = {
  currentCitySlug: string;
  currentProductSlug: string;
};

/**
 * Çapraz iç linkleme bileşeni.
 * – Aynı şehir → diğer ürünler
 * – Aynı ürün → diğer şehirler
 *
 * Google botunun tüm 42 sayfayı birbirine bağlı görmesini sağlar.
 */
export default function InternalLinkCloud({ currentCitySlug, currentProductSlug }: Props) {
  const city    = CITIES.find(c => c.slug === currentCitySlug);
  const product = AMBALAJ_SEO_PRODUCTS.find(p => p.slug === currentProductSlug);

  if (!city || !product) return null;

  const otherProductsInCity = AMBALAJ_SEO_PRODUCTS.filter(p => p.slug !== currentProductSlug);
  const otherCitiesForProduct = CITIES.filter(c => c.slug !== currentCitySlug);

  return (
    <nav
      aria-label="İlgili ambalaj sayfaları"
      className="bg-gray-50 border-t border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-8">

          {/* Aynı şehir, diğer ürünler */}
          <div>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
              {city.name} İçin Diğer Ambalaj Ürünlerimiz
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {otherProductsInCity.map(p => (
                <a
                  key={p.slug}
                  href={`/ambalaj/${city.slug}/${p.slug}`}
                  className="text-xs text-[#0f75bc] hover:text-[#07446c] hover:underline transition-colors"
                >
                  {city.name} {p.name}
                </a>
              ))}
            </div>
          </div>

          {/* Aynı ürün, diğer şehirler */}
          <div>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
              {product.name} — Diğer Şehirlerimiz
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {otherCitiesForProduct.map(c => (
                <a
                  key={c.slug}
                  href={`/ambalaj/${c.slug}/${product.slug}`}
                  className="text-xs text-[#0f75bc] hover:text-[#07446c] hover:underline transition-colors"
                >
                  {c.name} {product.name}
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}
