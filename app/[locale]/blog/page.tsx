import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import type { Metadata } from "next";
import { blogPosts } from "@/lib/blog-data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Blog");
  return { title: t("title") };
}

export default async function BlogPage() {
  const t = await getTranslations("Blog");

  return (
    <section className="max-w-6xl mx-auto px-4 py-14">
      <div className="text-center mb-12">
        <div className="eyebrow">{t("eyebrow")}</div>
        <h1 className="font-serif text-3xl sm:text-4xl text-espresso mt-2">{t("title")}</h1>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block bg-white border border-gold/10 rounded-xl overflow-hidden hover:shadow-lg transition-shadow focus-ring"
          >
            <div className="relative aspect-[4/3]">
              <Image src={post.image} alt={post.title} fill className="object-cover" />
            </div>
            <div className="p-5">
              <div className="text-xs text-espresso/50 mb-2">
                {new Date(post.date).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <h2 className="font-serif text-lg text-espresso mb-2">{post.title}</h2>
              <p className="text-sm text-espresso/60">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
