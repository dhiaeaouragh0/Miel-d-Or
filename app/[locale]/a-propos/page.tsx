import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { HexBadge, BeeIcon } from "@/components/Hex";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("About");
  return { title: t("title") };
}

export default async function AProposPage() {
  const t = await getTranslations("About");

  const values = [
    { title: t("valueAuthenticityTitle"), desc: t("valueAuthenticityDesc") },
    { title: t("valueRespectTitle"), desc: t("valueRespectDesc") },
    { title: t("valueProximityTitle"), desc: t("valueProximityDesc") },
  ];

  return (
    <div>
      <section className="max-w-6xl mx-auto px-4 py-16 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="eyebrow">{t("eyebrow")}</div>
          <h1 className="font-serif text-4xl text-espresso mt-2 mb-6">{t("title")}</h1>
          <p className="text-espresso/70 leading-relaxed mb-4">{t("p1")}</p>
          <p className="text-espresso/70 leading-relaxed">{t("p2")}</p>
        </div>
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1473973266408-ed4e27abdd47?q=80&w=1200&auto=format&fit=crop"
            alt="Apiculteur au travail parmi les ruches"
            fill
            className="object-cover"
          />
        </div>
      </section>

      <section className="bg-white border-y border-gold/10">
        <div className="max-w-6xl mx-auto px-4 py-16 grid sm:grid-cols-3 gap-8 text-center">
          {values.map((v) => (
            <div key={v.title}>
              <HexBadge size={56} className="mx-auto mb-4">
                <BeeIcon className="w-6 h-6" />
              </HexBadge>
              <h3 className="font-serif text-lg text-espresso mb-2">{v.title}</h3>
              <p className="text-sm text-espresso/60">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
