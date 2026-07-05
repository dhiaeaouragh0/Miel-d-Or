"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, locales } from "@/i18n/routing";
import { useParams } from "next/navigation";

const labels: Record<string, string> = {
  fr: "FR",
  ar: "ع",
};

export function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  function handleChange(nextLocale: string) {
    router.replace(
      // @ts-expect-error -- params shape depends on the current route
      { pathname, params },
      { locale: nextLocale }
    );
  }

  return (
    <label className="flex items-center gap-1 text-sm">
      <span className="sr-only">{t("label")}</span>
      <select
        value={locale}
        onChange={(e) => handleChange(e.target.value)}
        className="bg-transparent border border-gold/30 rounded-md px-2 py-1 text-espresso focus-ring cursor-pointer"
        aria-label={t("label")}
      >
        {locales.map((l) => (
          <option key={l} value={l}>
            {labels[l] ?? l}
          </option>
        ))}
      </select>
    </label>
  );
}
