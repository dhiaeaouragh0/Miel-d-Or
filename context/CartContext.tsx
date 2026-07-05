"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  image?: string;
  variantSku: string;
  variantLabel: string;
  unitPrice: number;
  quantity: number;
  stock: number;
}

interface CartContextValue {
  lines: CartLine[];
  addLine: (line: CartLine) => void;
  removeLine: (variantSku: string) => void;
  updateQuantity: (variantSku: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "mieldor_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  function addLine(line: CartLine) {
    setLines((prev) => {
      const existing = prev.find((l) => l.variantSku === line.variantSku);
      if (existing) {
        return prev.map((l) =>
          l.variantSku === line.variantSku
            ? { ...l, quantity: Math.min(l.quantity + line.quantity, l.stock) }
            : l
        );
      }
      return [...prev, line];
    });
  }

  function removeLine(variantSku: string) {
    setLines((prev) => prev.filter((l) => l.variantSku !== variantSku));
  }

  function updateQuantity(variantSku: string, quantity: number) {
    setLines((prev) =>
      prev.map((l) =>
        l.variantSku === variantSku
          ? { ...l, quantity: Math.max(1, Math.min(quantity, l.stock)) }
          : l
      )
    );
  }

  function clear() {
    setLines([]);
  }

  return (
    <CartContext.Provider value={{ lines, addLine, removeLine, updateQuantity, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
