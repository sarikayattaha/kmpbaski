"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-[#e0f2fe] to-[#bae6fd] shadow-sm flex items-center justify-center text-9xl opacity-10">
        🖨️
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Ana görsel */}
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-[#e0f2fe] to-[#bae6fd] shadow-sm">
        <Image
          src={images[active]}
          alt={name}
          fill
          className="object-contain p-10"
          priority
        />
      </div>

      {/* Thumbnail'ler — sadece birden fazla fotoğraf varsa göster */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                active === i ? "border-[#0f75bc] shadow-md" : "border-gray-200 hover:border-[#25aae1]"
              }`}
            >
              <div className="relative w-full h-full bg-[#f0f9ff]">
                <Image src={url} alt={`${name} ${i + 1}`} fill className="object-contain p-1" sizes="64px" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
