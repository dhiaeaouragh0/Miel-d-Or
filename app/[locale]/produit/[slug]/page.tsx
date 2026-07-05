import { getTranslations } from "next-intl/server";
import { getProductBySlug, getProducts } from "@/lib/api";
import { ProductOptions } from "@/components/ProductOptions";
import { ProductCard } from "@/components/ProductCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const product = await getProductBySlug(params.slug);
    if (!product) return { title: "Produit introuvable" };
    const image = product.variants?.[0]?.images?.[0] ?? product.image;
    return {
      title: product.name,
      description: product.description ?? `Découvrez ${product.name} chez Miel d'Or.`,
      openGraph: {
        title: product.name,
        description: product.description,
        images: image ? [image] : undefined,
      },
    };
  } catch {
    return { title: "Produit" };
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const t = await getTranslations("ProductPage");

  let product;
  try {
    product = await getProductBySlug(params.slug);
  } catch {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center text-espresso/60">
        {t("loadError")}
      </div>
    );
  }

  if (!product) notFound();

  let related: Awaited<ReturnType<typeof getProducts>>["products"] = [];
  try {
    const res = await getProducts(1, 8);
    related = res.products.filter((p) => p.id !== product!.id).slice(0, 4);
  } catch {
    related = [];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-14">
      <ProductOptions product={product} />

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-serif text-2xl text-espresso mb-8">{t("relatedTitle")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
