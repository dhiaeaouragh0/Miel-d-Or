import type { Metadata } from "next";
import { Playfair_Display, Inter, Cairo } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { CartProvider } from "@/context/CartContext";
import { routing, localeDirection, type Locale } from "@/i18n/routing";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Arabic-friendly font, used only when locale === "ar" (see className below)
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Miel d'Or — Naturellement bon",
    template: "%s | Miel d'Or",
  },
  description:
    "Miel 100% naturel et artisanal, récolté avec soin en Algérie. Livraison rapide, paiement à la livraison.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
  notFound();
}

  const messages = await getMessages();
  const dir = localeDirection[locale as Locale];
  const isArabic = locale === "ar";

  return (
    <html lang={locale} dir={dir}>
      <body
        className={`${playfair.variable} ${inter.variable} ${cairo.variable} ${
          isArabic ? "font-arabic" : "font-sans"
        } antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <AnnouncementBar />
            <Header />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
