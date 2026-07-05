"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { Link } from "@/i18n/routing";
import { HexBadge, BeeIcon } from "./Hex";
import { useCart } from "@/context/CartContext";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function Header() {
  const t = useTranslations("Nav");
  const [open, setOpen] = useState(false);
  const { lines } = useCart();
  const count = lines.reduce((sum, l) => sum + l.quantity, 0);

  const nav = [
    { label: t("home"), href: "/" },
    { label: t("shop"), href: "/boutique" },
    {
      label: t("honeys"),
      href: "/boutique",
      children: [
        { label: t("honeyFlowers"), href: "/boutique?tag=fleurs" },
        { label: t("honeyLavender"), href: "/boutique?tag=lavande" },
        { label: t("honeyMountain"), href: "/boutique?tag=montagne" },
      ],
    },
    { label: t("about"), href: "/a-propos" },
    { label: t("blog"), href: "/blog" },
    { label: t("contact"), href: "/contact" },
  ];

  return (
    <header className="bg-cream/95 backdrop-blur sticky top-0 z-40 border-b border-gold/10">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 focus-ring">
          <HexBadge size={48}>
            <BeeIcon className="w-6 h-6" />
          </HexBadge>
          <div className="leading-tight">
            <div className="font-serif text-xl tracking-wide text-espresso">MIEL D&apos;OR</div>
            <div className="text-[11px] text-gold-dark tracking-wide">Naturellement bon</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 font-medium text-sm">
          {nav.map((item) => (
            <div key={item.label} className="relative group">
              <Link
                href={item.href}
                className="flex items-center gap-1 text-espresso hover:text-gold-dark transition-colors focus-ring"
              >
                {item.label}
                {item.children && <ChevronDown className="w-3.5 h-3.5" />}
              </Link>
              {item.children && (
                <div className="absolute start-0 top-full pt-2 hidden group-hover:block">
                  <div className="bg-white shadow-lg rounded-md py-2 min-w-[180px] border border-gold/10">
                    {item.children.map((c) => (
                      <Link
                        key={c.label}
                        href={c.href}
                        className="block px-4 py-2 text-sm hover:bg-cream"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-4 text-espresso">
          <LocaleSwitcher />
          {/* <button aria-label={t("search")} className="hover:text-gold-dark focus-ring">
            <Search className="w-5 h-5" />
          </button> */}
          <Link href="/panier" aria-label={t("cart")} className="relative hover:text-gold-dark focus-ring">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-2 -end-2 bg-gold text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
              {count}
            </span>
          </Link>
          <button
            className="lg:hidden focus-ring"
            aria-label={t("menu")}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-gold/10 px-4 py-4 space-y-3">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block py-1 text-espresso"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
