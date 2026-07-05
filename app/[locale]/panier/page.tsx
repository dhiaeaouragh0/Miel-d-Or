"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { BeeIcon } from "@/components/Hex";
import { Trash2 } from "lucide-react";

export default function PanierPage() {
  const t = useTranslations("Cart");
  const { lines, removeLine, updateQuantity } = useCart();
  const total = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);

  if (lines.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <BeeIcon className="w-10 h-10 text-gold/40 mx-auto mb-4" />
        <h1 className="font-serif text-2xl text-espresso mb-3">{t("empty")}</h1>
        <p className="text-espresso/60 mb-6">{t("emptyDesc")}</p>
        <Link href="/boutique" className="btn-primary inline-block">
          {t("viewShop")}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-14">
      <h1 className="font-serif text-3xl text-espresso mb-8">{t("title")}</h1>

      <div className="bg-yellow-50 border border-gold/20 text-sm text-espresso/70 rounded-md px-4 py-3 mb-8">
        {t("singleItemNotice")}
      </div>

      <div className="space-y-4">
        {lines.map((line) => (
          <div
            key={line.variantSku}
            className="flex items-center gap-4 bg-white border border-gold/10 rounded-xl p-4"
          >
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gold/5 shrink-0">
              {line.image ? (
                <Image src={line.image} alt={line.name} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gold/40">
                  <BeeIcon className="w-6 h-6" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <Link href={`/produit/${line.slug}`} className="font-serif text-espresso hover:text-gold-dark">
                {line.name}
              </Link>
              {line.variantLabel && (
                <div className="text-xs text-espresso/50">{line.variantLabel}</div>
              )}
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => updateQuantity(line.variantSku, line.quantity - 1)}
                  className="w-6 h-6 border border-gold/30 rounded text-xs"
                >
                  −
                </button>
                <span className="text-sm">{line.quantity}</span>
                <button
                  onClick={() => updateQuantity(line.variantSku, line.quantity + 1)}
                  className="w-6 h-6 border border-gold/30 rounded text-xs"
                >
                  +
                </button>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-gold-dark">
                {formatPrice(line.unitPrice * line.quantity)}
              </div>
              <Link
                href={`/commander?productId=${line.productId}&variantSku=${line.variantSku}&quantity=${line.quantity}`}
                className="text-xs text-espresso/70 hover:text-gold-dark underline"
              >
                {t("order")}
              </Link>
            </div>
            <button
              onClick={() => removeLine(line.variantSku)}
              aria-label={t("remove")}
              className="text-espresso/40 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center border-t border-gold/10 pt-6">
        <span className="font-medium text-espresso">{t("totalEstimate")}</span>
        <span className="font-serif text-xl text-gold-dark">{formatPrice(total)}</span>
      </div>
    </div>
  );
}
