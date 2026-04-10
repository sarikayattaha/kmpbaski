import Image, { type ImageProps } from "next/image";

type SmartImageProps = Omit<ImageProps, "alt"> & {
  /**
   * Alt metni. Boş geçilirse `product` ve `city` kullanılarak otomatik üretilir.
   * İkisi de yoksa genel bir fallback kullanılır.
   */
  alt?: string;
  /** Ürün adı — otomatik alt/title üretmek için */
  product?: string;
  /** Şehir adı — otomatik alt/title üretmek için */
  city?: string;
};

/**
 * next/image üzerine ince bir sarmalayıcı.
 *
 * - `alt` boş geçilirse product + city bilgisinden SEO dostu metin üretir.
 * - `title` attribute'u aynı metinle doldurur (görsel üzerine gelindiğinde görünür).
 *
 * Kullanım:
 *   <SmartImage src={url} width={420} height={320} product="Baklava Kutusu" city="İstanbul" />
 *   // → alt="Baklava Kutusu İstanbul Modelleri ve Fiyatları - KMP Baskı Ambalaj"
 *
 *   <SmartImage src={url} width={420} height={320} alt="Özel pasta kutusu" />
 *   // → alt belirtildiği için dokunulmaz
 */
export default function SmartImage({
  alt,
  product,
  city,
  title,
  ...props
}: SmartImageProps) {
  const resolvedAlt = alt ?? buildAlt(product, city);
  const resolvedTitle = title ?? resolvedAlt;

  return (
    <Image
      alt={resolvedAlt}
      title={resolvedTitle}
      {...props}
    />
  );
}

function buildAlt(product?: string, city?: string): string {
  if (product && city) {
    return `${product} ${city} Modelleri ve Fiyatları - KMP Baskı Ambalaj`;
  }
  if (product) {
    return `${product} Modelleri ve Fiyatları - KMP Baskı`;
  }
  if (city) {
    return `${city} Ambalaj ve Baskı Çözümleri - KMP Baskı`;
  }
  return "KMP Baskı - Profesyonel Ambalaj ve Baskı Çözümleri";
}
