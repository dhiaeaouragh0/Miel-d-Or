import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const locales = ["fr", "ar"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "fr",
  // Always show the prefix (/fr/..., /ar/...) so the active locale is
  // unambiguous in URLs, bookmarks, and shared links.
  localePrefix: "always",
});

export const localeDirection: Record<Locale, "ltr" | "rtl"> = {
  fr: "ltr",
  ar: "rtl",
};

// Locale-aware Link / useRouter / usePathname / redirect — use these instead
// of the plain next/navigation ones everywhere in the app so links keep the
// /fr or /ar prefix automatically.
export const { Link, useRouter, usePathname, redirect } = createNavigation(routing);
