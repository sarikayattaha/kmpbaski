"use client";

import { MessageCircle } from "lucide-react";

type Product = {
  name: string;
  price?: string | null;
  is_price_on_request?: boolean;
  features?: string | null;
};

export default function TeklifButton({ product }: { product: Product }) {
  const buildMessage = () => {
    const featureLines = (product.features ?? "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const featuresText = featureLines.length > 0
      ? featureLines.map((f) => `- ${f}`).join("\n")
      : "- Belirtilmedi";

    const priceText = product.is_price_on_request
      ? "Fiyat alabilir miyim?"
      : (product.price ? product.price + " +KDV" : "Fiyat alabilir miyim?");

    return [
      "URUN BILGILERI",
      `Urun: ${product.name}`,
      "Ozellikler:",
      featuresText,
      `Fiyat: ${priceText}`,
      "",
      "Bu mesaj kmpbaski.com uzerinden otomatik olusturulmustur.",
    ].join("\n");
  };

  const handleClick = () => {
    const msg = buildMessage();
    window.open(`https://wa.me/905541630031?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <button onClick={handleClick}
      className="w-full flex items-center justify-center gap-2.5 bg-[#25d366] hover:bg-[#1da851] active:bg-[#179443] text-white font-black px-6 py-4 rounded-2xl transition-colors shadow-lg shadow-green-400/20 text-sm">
      <MessageCircle size={18} />
      Fiyat Teklifi Al
    </button>
  );
}
