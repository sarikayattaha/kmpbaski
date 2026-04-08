"use client";

import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/supabase";
import { useState } from "react";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <button
      onClick={handleClick}
      className={`flex-1 inline-flex items-center justify-center gap-2 font-black px-6 py-4 rounded-2xl transition-all shadow-lg text-sm ${
        added
          ? "bg-green-500 text-white shadow-green-400/20"
          : "bg-[#07446c] hover:bg-[#0f75bc] text-white shadow-blue-900/20"
      }`}
    >
      {added ? (
        <>
          <Check size={18} /> Sepete Eklendi
        </>
      ) : (
        <>
          <ShoppingCart size={18} /> Sepete Ekle
        </>
      )}
    </button>
  );
}
