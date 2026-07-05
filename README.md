# Miel d'Or — Storefront

Customer-facing storefront for the Miel d'Or honey store, built with Next.js 14
(App Router) + TypeScript + Tailwind CSS, consuming the existing backend at
`https://bc.dhiae.space`.

## Getting started

```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_BASE_URL defaults to the live API
npm run dev
```

Open http://localhost:3000.

## ⚠️ Important: verify the API shapes before going live

This project was built **without live access to `https://bc.dhiae.space`**
(no outbound network access in the build sandbox), so all TypeScript types and
the API client (`lib/api.ts`, `lib/types.ts`) were written strictly from the
field names and JSON sample described in the project brief:

- `Product`, `ProductVariant`, `OptionType` — inferred from the brief's
  description of `optionTypes`, `variant.attributes`, `basePrice`, `isFeatured`, etc.
- `ShippingWilaya` — assumed shape `{ nom, prixDomicile, prixAgence }`.
- `CreateOrderPayload` / order response — taken directly from the JSON sample
  in the brief.
- **Single-product lookup**: the brief wasn't certain whether
  `GET /api/products/:slug` exists, so `getProductBySlug` / `getProductById`
  currently scan paginated `/api/products` results client/server-side. If a
  dedicated endpoint exists, replace the loop in `lib/api.ts` with a direct
  `request<Product>('/api/products/' + slug)` call — it'll be faster and you
  won't need to scan all pages.

**Before deploying**, run the app against the live API and check the network
tab / server logs for any field mismatches (e.g. if the backend uses
`name` vs `nom` for wilaya, or `optionTypes` is nested differently) — adjust
`lib/types.ts` and `lib/api.ts` accordingly. Everything else in the app reads
from those two files, so fixes there propagate everywhere.

## Structure

```
app/
  page.tsx                  Home
  boutique/page.tsx         Shop grid + pagination + sort
  produit/[slug]/page.tsx   Product detail (variant selector, gallery)
  commander/page.tsx        Checkout (single product, cash-on-delivery)
  panier/page.tsx           Client-side cart (localStorage)
  a-propos/page.tsx         Brand story
  blog/, blog/[slug]/       Placeholder blog (static data in lib/blog-data.ts)
  contact/page.tsx          Contact info + placeholder form
components/                 Header, Footer, Hero, ProductCard, ProductOptions, Hex…
context/CartContext.tsx     Cart state (localStorage-backed)
lib/api.ts                  Typed fetch client for the backend
lib/types.ts                Shared TypeScript types — single source of truth
lib/utils.ts                Price formatting, Algerian phone regex
```

## Multi-language (French / Arabic)

The site now runs on `next-intl` with two locales: `fr` (default) and `ar`.

- URLs are locale-prefixed: `/fr/boutique`, `/ar/boutique`. Visiting `/` redirects
  to the default locale via `middleware.ts`.
- `messages/fr.json` and `messages/ar.json` hold every UI string — nav, hero,
  buttons, form labels/errors, footer, etc. Edit these directly to tweak copy.
- Arabic renders right-to-left automatically: `app/[locale]/layout.tsx` sets
  `dir="rtl"` on `<html>` when `locale === "ar"`, and a few spots use Tailwind's
  logical `start-*`/`end-*` utilities (instead of `left-*`/`right-*`) so badges,
  cart icon, and the header dropdown flip sides correctly — notably
  `components/Hero.tsx`, `components/ProductCard.tsx`, `components/Header.tsx`.
- A language switcher (`components/LocaleSwitcher.tsx`) sits in the header.
- Headings use a Cairo Arabic web font when `dir="rtl"` (see the `.font-serif`
  override in `app/globals.css`); body text uses Inter for French and falls
  back to Cairo for Arabic via the `font-arabic` class on `<body>`.
- Always import `Link`, `useRouter`, `usePathname`, `redirect` from
  `@/i18n/routing` (not `next/link` / `next/navigation`) anywhere you add new
  internal navigation — that's what keeps the `/fr` or `/ar` prefix attached.

**What's intentionally still French-only:** product names/descriptions (they
come from your API, which doesn't store Arabic fields yet) and the sample
blog posts / home-page testimonials (static placeholder content). If you want
those translated too, the backend needs an Arabic field per product (e.g.
`name_ar`, `description_ar`), and the storefront would pick the right one
based on the active locale.

## Notes on the checkout flow

- The backend's `POST /api/orders` accepts one product/variant per order, so
  the cart is a convenience wishlist: each line links to its own `/commander`
  checkout. This matches the brief's "default to single-item checkout" guidance.
- Phone validation follows the Algerian mobile pattern (`05/06/07XXXXXXXX`).
- Shipping fee is resolved live from the selected wilaya + delivery type
  (`domicile`/`agence`) and shown in the order summary before submission.

## What's still a placeholder

- The "compte" (account) icon in the header links to `/compte`, which doesn't
  exist yet — intentional, per the brief ("no auth for customers").
- Blog content is static sample copy — swap `lib/blog-data.ts` for a CMS later.
- The contact form doesn't submit anywhere yet — wire it to email/Resend/etc.
