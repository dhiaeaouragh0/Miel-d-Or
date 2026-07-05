import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Hero } from "@/components/Hero";
import { TrustStrip } from "@/components/TrustStrip";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/api";
import { BeeIcon } from "@/components/Hex";

async function FeaturedProducts() {
  const t = await getTranslations("Home");
  try {
    const { products } = await getProducts(1, 8);
    if (products.length === 0) {
      return <p className="text-center text-espresso/60 py-12">{t("noProducts")}</p>;
    }
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, 8).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    );
  } catch {
    return <p className="text-center text-espresso/60 py-12">{t("loadError")}</p>;
  }
}

export default async function HomePage() {
  const t = await getTranslations("Home");

  return (
    <>
      <Hero />
      <TrustStrip />

      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="eyebrow">{t("eyebrow")}</div>
          <div className="flex items-center justify-center gap-3 my-3">
            <span className="h-px w-10 bg-gold/40" />
            <BeeIcon className="w-4 h-4 text-gold" />
            <span className="h-px w-10 bg-gold/40" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-espresso">{t("title")}</h2>
        </div>
        <FeaturedProducts />
        <div className="text-center mt-12">
          <Link href="/boutique" className="btn-outline inline-block">
            {t("viewAll")}
          </Link>
        </div>
      </section>

      <section className="bg-espresso text-cream">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <div className="eyebrow text-gold-light">{t("testimonialsEyebrow")}</div>
          <h2 className="font-serif text-3xl mt-3 mb-10">{t("testimonialsTitle")}</h2>
          <div className="grid sm:grid-cols-3 gap-8 text-left">
            {[
              {
                name: "Amel, Alger",
                text: "Un miel délicieux et authentique, on sent la qualité dès la première cuillère.",
              },
              {
                name: "Yacine, Oran",
                text: "Livraison rapide et service client au top. Je recommande vivement.",
              },
              {
                name: "Sarah, Constantine",
                text: "Enfin un miel naturel sans additifs, ma famille en raffole.",
              },
            ].map((tItem) => (
              <div key={tItem.name} className="bg-white/5 rounded-xl p-6">
                <p className="text-cream/80 text-sm leading-relaxed">&laquo; {tItem.text} &raquo;</p>
                <div className="mt-4 text-gold-light text-sm font-medium">{tItem.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
