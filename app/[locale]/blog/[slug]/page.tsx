import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { blogPosts } from "@/lib/blog-data";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return { title: "Article" };
  return { title: post.title, description: post.excerpt };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 py-14">
      <div className="text-xs text-espresso/50 mb-3">
        {new Date(post.date).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </div>
      <h1 className="font-serif text-3xl sm:text-4xl text-espresso mb-6">{post.title}</h1>
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8">
        <Image src={post.image} alt={post.title} fill className="object-cover" />
      </div>
      <p className="text-espresso/80 leading-relaxed text-lg">{post.content}</p>
    </article>
  );
}
