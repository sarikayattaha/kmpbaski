import type { City } from "@/lib/seo";

type Props = {
  productName: string;
  city: City;
};

type FAQ = { question: string; answer: string };

function buildFAQs(productName: string, city: City): FAQ[] {
  return [
    {
      question: `${city.name} içinde ${productName} teslimat süresi nedir?`,
      answer: `${city.locative} ${productName.toLowerCase()} siparişleri, tasarım onayından sonra genellikle 3–7 iş günü içinde teslim edilmektedir. Adet ve baskı karmaşıklığına göre bu süre değişebilir; acil teslimat için WhatsApp hattımızdan bilgi alabilirsiniz.`,
    },
    {
      question: `${productName} için minimum sipariş adedi nedir?`,
      answer: `${productName} siparişlerinde minimum adet kısıtı yoktur; küçük adetli prototip siparişlerden büyük toptan üretimlere kadar her miktarda hizmet veriyoruz. Yüksek adetlerde birim fiyatı önemli ölçüde düşmektedir; detaylı fiyat almak için WhatsApp hattımıza görseli ve adedi iletmeniz yeterli.`,
    },
    {
      question: `KMP Baskı ${city.name} bölgesine özel indirim yapıyor mu?`,
      answer: `${city.locative} ve Türkiye genelindeki tüm bölgelerimize toplu sipariş avantajı sunuyoruz. Minimum 500 adet üzeri siparişlerde toptan fiyatlandırma uygulanmakta; düzenli iş ortaklarımıza ayrıca özel fiyat anlaşmaları yapılmaktadır. Teklif için WhatsApp hattımızı kullanabilirsiniz.`,
    },
  ];
}

export default function DynamicFAQ({ productName, city }: Props) {
  const faqs = buildFAQs(productName, city);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      {/* FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData).replace(/</g, "\\u003c"),
        }}
      />

      {/* Görsel FAQ bölümü */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-xl font-black text-[#07446c] mb-2">
          Sıkça Sorulan Sorular
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          {city.name} {productName} hakkında merak edilenler
        </p>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden"
            >
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none font-semibold text-[#07446c] text-sm gap-4">
                <span>{faq.question}</span>
                <span className="text-[#0f75bc] transition-transform duration-200 group-open:rotate-180 flex-shrink-0 text-lg leading-none">
                  ›
                </span>
              </summary>
              <p className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-blue-50 pt-3 -mt-0.5">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
