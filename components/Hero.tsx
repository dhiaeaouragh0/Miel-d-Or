import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link, localeDirection, type Locale } from "@/i18n/routing";
import { HexBadge, BeeIcon } from "./Hex";

export function Hero() {
  const t = useTranslations("Hero");
  const locale = useLocale() as Locale;
  const isRtl = localeDirection[locale] === "rtl";

  return (
    <section className="relative h-[600px] overflow-hidden bg-cream">
      {/* Image */}
      <div className="absolute inset-y-0 end-0 w-full lg:w-[75%]">
        <Image
          src="https://res.cloudinary.com/djwoqenw6/image/upload/v1782359680/her-sec-clean_ogahi9.png"
          alt="Miel d'Or"
          fill
          priority
          className="object-cover object-center"
          style={{
            transform: isRtl ? "scaleX(-1)" : "scaleX(1)",
          }}
        />

        {/* Smooth blend, fades from the cream background toward the photo.
            Flipped automatically in RTL via the rtl: variant below. */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(
              to ${isRtl ? "left" : "right"},
              #faf6ef 0%,
              #faf6ef 20%,
              rgba(250,246,239,0.95) 35%,
              rgba(250,246,239,0.75) 50%,
              rgba(250,246,239,0.35) 65%,
              transparent 100%
            )`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center">
        <div className="max-w-xl">
          <div className="flex items-center gap-4 mb-5">
            <span className="h-px w-16 bg-gold/30" />

            <HexBadge size={42}>
              <BeeIcon className="w-4 h-4" />
            </HexBadge>

            <span className="h-px w-16 bg-gold/30" />
          </div>

          <h1 className="font-serif text-4xl lg:text-6xl leading-tight text-espresso">
            {t("titleLine1")}
            <br />
            <span className="text-gold">{t("titleLine2")}</span>
          </h1>

          <p className="mt-5 text-espresso/70 text-lg max-w-md">{t("subtitle")}</p>

          <div className="mt-7 flex gap-4">
            <Link href="/boutique" className="btn-primary">
              {t("ctaPrimary")}
            </Link>

            <Link href="/boutique" className="btn-outline">
              {t("ctaSecondary")}
            </Link>
          </div>
        </div>
      </div>

      {/* Badge — pinned to the same physical corner as the photo crop, so it
          stays on the image regardless of text direction. */}
      <div className="absolute top-8 end-8 z-20 hidden lg:block">
        <HexBadge size={115} filled>
          <span className="font-serif text-center text-sm leading-snug px-2">
            {t("badge")}
          </span>
        </HexBadge>
      </div>
    </section>
  );
}
