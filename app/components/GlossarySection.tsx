/**
 * Baskı & Ambalaj Sözlüğü
 *
 * Arama motorlarına içerik sinyali gönderen, ama kullanıcıya da
 * gerçek değer katan küçük bir bilgi bölümü.
 * Metin görünür ve okunabilir — hidden text değil.
 */

type Term = { term: string; definition: string };

const PRINT_TERMS: Term[] = [
  {
    term: "CMYK Baskı",
    definition:
      "Cyan, Magenta, Yellow ve Key (Siyah) renklerinin birleşimiyle oluşturulan dört renk baskı sistemi. Ambalaj ve kutu baskısında standart olan bu yöntem, tam renk fotoğraf ve tasarımların kağıda aktarılmasında kullanılır.",
  },
  {
    term: "Bristol Karton",
    definition:
      "Yüksek gramajlı (200–400 g/m²), pürüzsüz yüzeyli karton türü. Baklava kutusu, pasta kutusu ve premium hediye kutusu üretiminde tercih edilir; yüksek baskı kalitesi ve sertliği sayesinde kurumsal ambalajlarda yaygın kullanılır.",
  },
  {
    term: "Mat Selefon Kaplama",
    definition:
      "Baskı sonrası uygulanan mat yüzey laminasyonu. Parlak görüntü yerine derin, soft bir his verir; parmak izi tutmaz. Lüks ambalaj, butik kutu ve kurumsal hediye ambalajında sıkça tercih edilen bir son işlem yöntemidir.",
  },
  {
    term: "Mikro Oluklu Karton",
    definition:
      "İnce oluklu katman içeren, dayanıklı ve hafif karton yapısı. Pizza kutusu, hamburger kutusu ve taşıma ambalajlarında kullanılır. Hem ısı yalıtımı sağlar hem de nakliye sırasında ürünü korur.",
  },
  {
    term: "UV Selektif Lak",
    definition:
      "Baskı üzerinde seçili alanlara uygulanan parlak UV lak. Logo, marka adı veya özel detayların öne çıkarılmasında kullanılır. Ambalaj tasarımında görsel hiyerarşi ve premium his yaratır.",
  },
  {
    term: "Tam Renk Dijital Baskı",
    definition:
      "Flekso veya ofset kalıp gerektirmeden doğrudan dijital dosyadan baskı yöntemi. Kısa serilerde ekonomik, hızlı ve yüksek renk doğruluğu sunar. Özel ambalaj numunelerinde ve az adetli siparişlerde idealdir.",
  },
];

type Props = {
  /** Baskı terimlerinin gösterileceği konu alanı */
  topic?: "ambalaj" | "baski" | "all";
};

export default function GlossarySection({ topic = "all" }: Props) {
  const terms = topic === "all" ? PRINT_TERMS : PRINT_TERMS;

  return (
    <section className="border-t border-gray-100 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">
          Baskı &amp; Ambalaj Sözlüğü
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
          {terms.map(({ term, definition }) => (
            <div key={term}>
              <p className="text-xs font-bold text-gray-500 mb-0.5">{term}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{definition}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
