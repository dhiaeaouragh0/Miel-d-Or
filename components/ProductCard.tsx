import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import type { Product } from "@/lib/types";
import { priceRange } from "@/lib/utils";
import { HexBadge, BeeIcon } from "./Hex";

export function ProductCard({ product }: { product: Product }) {
  const t = useTranslations("Product");
  const image = product.variants?.[0]?.images?.[0] ?? product.image;

  return (
    <Link
      href={`/produit/${product.slug}`}
      className="group block rounded-xl overflow-hidden bg-white border border-gold/10 hover:shadow-lg transition-shadow focus-ring"
    >
      <div className="relative aspect-square bg-gold/5">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gold/40">
            <BeeIcon className="w-10 h-10" />
          </div>
        )}
        <div className="absolute top-3 start-3">
          <HexBadge size={36} filled>
            <BeeIcon className="w-4 h-4" />
          </HexBadge>
        </div>
        {product.isFeatured && (
          <span className="absolute top-3 end-3 bg-gold text-white text-[11px] font-medium px-2 py-1 rounded-full">
            {t("featured")}
          </span>
        )}
      </div>
      <div className="p-4">
        {product.brand && (
          <div className="text-xs text-espresso/50 mb-1">{product.brand}</div>
        )}
        <h3 className="font-serif text-lg text-espresso leading-snug">{product.name}</h3>
        <div className="mt-2 text-gold-dark font-medium">
          {priceRange(product, t("from"))}
        </div>
        <span className="mt-3 inline-block text-sm text-espresso/70 group-hover:text-gold-dark transition-colors">
          {t("viewProduct")}
        </span>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-white border border-gold/10 animate-pulse">
      <div className="aspect-square bg-gold/10" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-gold/10 rounded w-1/3" />
        <div className="h-4 bg-gold/10 rounded w-2/3" />
        <div className="h-4 bg-gold/10 rounded w-1/4" />
      </div>
    </div>
  );
}
