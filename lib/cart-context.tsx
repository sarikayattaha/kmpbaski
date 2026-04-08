"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "@/lib/supabase";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  totalCount: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kmp_cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("kmp_cart", JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) return removeItem(productId);
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i))
    );
  };

  const clearCart = () => setItems([]);

  const totalCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
