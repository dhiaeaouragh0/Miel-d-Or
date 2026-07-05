import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { HexBadge, BeeIcon } from "./Hex";

export function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-espresso text-cream/90 mt-24">
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <HexBadge size={40} filled>
              <BeeIcon className="w-5 h-5" />
            </HexBadge>
            <span className="font-serif text-lg text-cream">MIEL D&apos;OR</span>
          </div>
          <p className="text-sm text-cream/70">{t("tagline")}</p>
        </div>

        <div>
          <h3 className="font-serif text-cream mb-4">{t("navTitle")}</h3>
          <ul className="space-y-2 text-sm text-cream/70">
            <li><Link href="/boutique" className="hover:text-gold-light">{t("shop")}</Link></li>
            <li><Link href="/a-propos" className="hover:text-gold-light">{t("about")}</Link></li>
            <li><Link href="/blog" className="hover:text-gold-light">{t("blog")}</Link></li>
            <li><Link href="/contact" className="hover:text-gold-light">{t("contact")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-cream mb-4">{t("serviceTitle")}</h3>
          <ul className="space-y-2 text-sm text-cream/70">
            <li><Link href="/panier" className="hover:text-gold-light">{t("myCart")}</Link></li>
            <li><Link href="/commander" className="hover:text-gold-light">{t("order")}</Link></li>
            <li>{t("cod")}</li>
            <li>{t("deliveryAllWilayas")}</li>
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-cream mb-4">{t("newsletterTitle")}</h3>
          <p className="text-sm text-cream/70 mb-3">{t("newsletterDesc")}</p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder={t("emailPlaceholder")}
              className="flex-1 rounded-md px-3 py-2 text-sm text-espresso focus-ring"
            />
            <button type="submit" className="btn-primary text-sm py-2 px-4">
              OK
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} {t("copyright")}
      </div>
    </footer>
  );
}
