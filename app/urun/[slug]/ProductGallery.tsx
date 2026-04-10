"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] rounded-3xl bg-white border border-gray-100 flex flex-col items-center justify-center gap-3 text-gray-200">
        <ImageOff size={48} />
        <span className="text-xs font-medium text-gray-300">Görsel Hazırlanıyor</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Ana görsel — 4/3 · beyaz zemin · LCP */}
      <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white border border-gray-100">
        <Image
          src={images[active]}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          fetchPriority="high"
          loading="eager"
          className="object-contain p-6"
        />
      </div>

      {/* Thumbnail'ler */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                active === i
                  ? "border-[#0f75bc] shadow-sm"
                  : "border-gray-100 hover:border-[#25aae1]"
              }`}
            >
              <div className="relative w-full h-full bg-white">
                <Image
                  src={url}
                  alt={`${name} ${i + 1}`}
                  fill
                  sizes="64px"
                  loading="lazy"
                  className="object-contain p-1"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
