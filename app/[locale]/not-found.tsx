import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { BeeIcon } from "@/components/Hex";

export default async function NotFound() {
  const t = await getTranslations("NotFound");
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <BeeIcon className="w-10 h-10 text-gold/40 mx-auto mb-4" />
      <h1 className="font-serif text-3xl text-espresso mb-3">{t("title")}</h1>
      <p className="text-espresso/60 mb-6">{t("desc")}</p>
      <Link href="/" className="btn-primary inline-block">
        {t("backHome")}
      </Link>
    </div>
  );
}
