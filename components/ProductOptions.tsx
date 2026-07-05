"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import type { Product, ProductVariant } from "@/lib/types";
import { formatPrice, getDisplayImages } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { BeeIcon } from "./Hex";

function findVariant(variants: ProductVariant[], selection: Record<string, string>) {
  return variants.find((v) =>
    Object.entries(selection).every(([key, value]) => v.attributes?.[key] === value)
  );
}

export function ProductOptions({ product }: { product: Product }) {
  const t = useTranslations("ProductPage");
  const router = useRouter();
  const { addLine } = useCart();
  const optionTypes = product.optionTypes ?? [];

  const [selection, setSelection] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    optionTypes.forEach((opt) => {
      if (opt.values[0]) initial[opt.name] = opt.values[0];
    });
    return initial;
  });
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  const selectedVariant = useMemo(
    () => findVariant(product.variants, selection) ?? product.variants[0],
    [product.variants, selection]
  );

  useEffect(() => {
    setActiveImage(0);
  }, [selectedVariant?.sku]);

  const images = getDisplayImages(product, selectedVariant);

  const inStock = (selectedVariant?.stock ?? 0) > 0;
  const price = selectedVariant?.price ?? product.basePrice;

  function isValueAvailable(optionName: string, value: string) {
    const trial = { ...selection, [optionName]: value };
    const variant = findVariant(product.variants, trial);
    return Boolean(variant && variant.stock > 0);
  }

  function handleAddToCart() {
    if (!selectedVariant) return;
    addLine({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: images[0],
      variantSku: selectedVariant.sku,
      variantLabel: Object.values(selectedVariant.attributes ?? {}).join(" / "),
      unitPrice: price,
      quantity,
      stock: selectedVariant.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleOrderNow() {
    if (!selectedVariant) return;
    const params = new URLSearchParams({
      productId: product.id,
      variantSku: selectedVariant.sku,
      quantity: String(quantity),
    });
    router.push(`/commander?${params.toString()}`);
  }

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      {/* Gallery */}
      <div>
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gold/5">
          {images[activeImage] ? (
            <Image
              src={images[activeImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gold/40">
              <BeeIcon className="w-12 h-12" />
            </div>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-3 mt-4">
            {images.map((img, i) => (
              <button
                key={img + i}
                onClick={() => setActiveImage(i)}
                className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 focus-ring ${
                  i === activeImage ? "border-gold" : "border-transparent"
                }`}
                aria-label={`${i + 1}`}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div>
        {product.brand && <div className="text-sm text-espresso/50 mb-1">{product.brand}</div>}
        <h1 className="font-serif text-3xl sm:text-4xl text-espresso">{product.name}</h1>
        <div className="mt-4 text-2xl text-gold-dark font-medium">{formatPrice(price)}</div>

        {product.description && (
          <p className="mt-4 text-espresso/70 leading-relaxed">{product.description}</p>
        )}

        {optionTypes.map((opt) => (
          <div key={opt.name} className="mt-6">
            <div className="text-sm font-medium text-espresso mb-2">{opt.name}</div>
            <div className="flex flex-wrap gap-2">
              {opt.values.map((value) => {
                const isSelected = selection[opt.name] === value;
                const available = isValueAvailable(opt.name, value);
                return (
                  <button
                    key={value}
                    disabled={!available}
                    onClick={() => setSelection((s) => ({ ...s, [opt.name]: value }))}
                    className={`px-4 py-2 rounded-md text-sm border transition-colors focus-ring ${
                      isSelected
                        ? "bg-gold text-white border-gold"
                        : available
                        ? "border-gold/30 text-espresso hover:border-gold"
                        : "border-gold/10 text-espresso/30 line-through cursor-not-allowed"
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="mt-6 flex items-center gap-4">
          <div className="text-sm font-medium text-espresso">{t("quantity")}</div>
          <div className="flex items-center border border-gold/30 rounded-md">
            <button
              className="px-3 py-2 text-espresso disabled:opacity-30 focus-ring"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="-"
            >
              −
            </button>
            <span className="px-4 text-sm w-10 text-center">{quantity}</span>
            <button
              className="px-3 py-2 text-espresso disabled:opacity-30 focus-ring"
              onClick={() =>
                setQuantity((q) => Math.min(q + 1, selectedVariant?.stock ?? 1))
              }
              disabled={!selectedVariant || quantity >= selectedVariant.stock}
              aria-label="+"
            >
              +
            </button>
          </div>
          <span className="text-xs text-espresso/50">
            {inStock ? `${selectedVariant?.stock} ${t("inStock")}` : t("outOfStock")}
          </span>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={handleOrderNow}
            disabled={!inStock}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t("orderNow")}
          </button>
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className="btn-outline disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {added ? t("added") : t("addToCart")}
          </button>
        </div>
      </div>
    </div>
  );
}
