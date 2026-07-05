export function formatPrice(value: number): string {
  return `${value.toLocaleString("fr-FR")} DA`;
}

export function priceRange(
  product: { basePrice: number; variants?: { price: number }[] },
  fromLabel = "À partir de"
) {
  if (!product.variants || product.variants.length === 0) {
    return formatPrice(product.basePrice);
  }
  const prices = product.variants.map((v) => v.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max) return formatPrice(min);
  return `${fromLabel} ${formatPrice(min)}`;
}

import type { Product, ProductVariant } from "./types";

// Algerian mobile numbers: 05/06/07 followed by 8 digits (with optional spaces/dashes)
export const algerianPhoneRegex = /^0[5-7](?:[ -]?\d){8}$/;

/**
 * Resolves the best available image for a product/variant combo, since some
 * variants are missing photos. Order of preference:
 *   1. the selected variant's own images
 *   2. any other variant on the same product that does have images
 *   3. the product-level fallback image
 *   4. null (caller should render a placeholder icon)
 */
export function getDisplayImages(
  product: Pick<Product, "image" | "variants">,
  variant?: Pick<ProductVariant, "images"> | null
): string[] {
  if (variant?.images?.length) return variant.images;

  const otherVariantImages = product.variants?.find((v) => v.images?.length)?.images;
  if (otherVariantImages?.length) return otherVariantImages;

  if (product.image) return [product.image];

  return [];
}
