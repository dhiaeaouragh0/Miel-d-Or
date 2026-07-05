import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { BeeIcon } from "@/components/Hex";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Boutique");
  return { title: t("title") };
}

const LIMIT = 12;

export default async function BoutiquePage({
  searchParams,
}: {
  searchParams: { page?: string; sort?: string };
}) {
  const t = await getTranslations("Boutique");
  const page = Math.max(1, Number(searchParams.page) || 1);
  const sort = searchParams.sort ?? "default";

  let products: Awaited<ReturnType<typeof getProducts>>["products"] = [];
  let pagination: Awaited<ReturnType<typeof getProducts>>["pagination"] | null = null;
  let error: string | null = null;

  try {
    const res = await getProducts(page, LIMIT);
    products = res.products;
    pagination = res.pagination;
  } catch {
    error = t("loadError");
  }

  if (sort === "price-asc") {
    products = [...products].sort((a, b) => a.basePrice - b.basePrice);
  } else if (sort === "price-desc") {
    products = [...products].sort((a, b) => b.basePrice - a.basePrice);
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-14">
      <div className="text-center mb-10">
        <div className="eyebrow">{t("eyebrow")}</div>
        <h1 className="font-serif text-3xl sm:text-4xl text-espresso mt-2">{t("title")}</h1>
      </div>

      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <p className="text-sm text-espresso/60">
          {pagination ? `${pagination.total} ${t("productCount")}` : ""}
        </p>
        <form method="get" className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-espresso/70">
            {t("sortBy")}
          </label>
          <select
            id="sort"
            name="sort"
            defaultValue={sort}
            className="rounded-md border border-gold/30 bg-white text-sm px-3 py-2 focus-ring"
          >
            <option value="default">{t("sortRelevance")}</option>
            <option value="price-asc">{t("sortPriceAsc")}</option>
            <option value="price-desc">{t("sortPriceDesc")}</option>
          </select>
          <button type="submit" className="btn-outline text-sm py-2 px-3">
            {t("apply")}
          </button>
        </form>
      </div>

      {error && <p className="text-center text-espresso/60 py-12">{error}</p>}

      {!error && products.length === 0 && (
        <div className="text-center py-20">
          <BeeIcon className="w-10 h-10 text-gold/40 mx-auto mb-4" />
          <p className="text-espresso/60">{t("noProducts")}</p>
        </div>
      )}

      {!error && products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/boutique?page=${p}${sort !== "default" ? `&sort=${sort}` : ""}`}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm border ${
                p === pagination!.page
                  ? "bg-gold text-white border-gold"
                  : "border-gold/30 text-espresso hover:bg-gold/10"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
