"use client";

import { MousePointerClick } from "lucide-react";

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
    <button
      onClick={handleClick}
      className="
        group w-full flex items-center justify-center gap-3
        bg-[#25d366] text-white font-black text-lg px-6 py-4 rounded-2xl
        shadow-lg shadow-green-400/25
        transition-all duration-200
        hover:bg-[#1da851] hover:shadow-xl hover:shadow-green-400/40 hover:scale-[1.02]
        active:scale-[0.98] active:bg-[#179443]
        cursor-pointer
      "
    >
      {/* WhatsApp logo */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="h-6 w-6 shrink-0 fill-white"
        aria-hidden="true"
      >
        <path d="M16 2C8.268 2 2 8.268 2 16c0 2.49.65 4.826 1.785 6.854L2 30l7.338-1.763A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2Zm0 25.5a11.45 11.45 0 0 1-5.835-1.597l-.418-.248-4.352 1.046 1.078-4.24-.272-.434A11.466 11.466 0 0 1 4.5 16C4.5 9.596 9.596 4.5 16 4.5S27.5 9.596 27.5 16 22.404 27.5 16 27.5Zm6.29-8.558c-.345-.172-2.04-1.006-2.355-1.12-.316-.115-.547-.172-.777.172-.23.345-.892 1.12-1.093 1.35-.2.23-.402.258-.747.086-.345-.172-1.456-.537-2.774-1.712-1.025-.916-1.717-2.047-1.918-2.392-.2-.345-.021-.531.15-.703.155-.154.345-.402.517-.603.172-.2.23-.345.345-.574.115-.23.057-.431-.029-.603-.086-.172-.777-1.873-1.064-2.564-.28-.673-.564-.582-.777-.593l-.661-.011c-.23 0-.603.086-.919.431s-1.207 1.179-1.207 2.875 1.236 3.336 1.408 3.566c.172.23 2.433 3.714 5.896 5.209.823.355 1.466.567 1.968.726.826.263 1.578.226 2.172.137.663-.099 2.04-.834 2.327-1.638.287-.804.287-1.493.2-1.638-.086-.144-.316-.23-.661-.402Z" />
      </svg>

      Fiyat Teklifi Al

      <MousePointerClick
        size={20}
        className="opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200"
      />
    </button>
  );
}
