
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { HexBadge } from "@/components/Hex";

import { ContactForm } from "@/components/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Contact");
  return { title: t("title") };
}

export default async function ContactPage() {
  const t = await getTranslations("Contact");


  return (
    <section className="max-w-5xl mx-auto px-4 py-14 grid lg:grid-cols-2 gap-12">
      <div>
        <div className="eyebrow">{t("eyebrow")}</div>
        <h1 className="font-serif text-3xl sm:text-4xl text-espresso mt-2 mb-6">{t("title")}</h1>
        <p className="text-espresso/70 mb-8">{t("subtitle")}</p>
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <HexBadge size={48}><Phone className="w-5 h-5" /></HexBadge>
            <div>
              <div className="text-sm text-espresso/50">{t("phone")}</div>
              <div className="font-medium text-espresso">0555233492</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <HexBadge size={48}><Mail className="w-5 h-5" /></HexBadge>
            <div>
              <div className="text-sm text-espresso/50">{t("email")}</div>
              <div className="font-medium text-espresso">dhiaeaouragh0@gmail.com</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <HexBadge size={48}><MapPin className="w-5 h-5" /></HexBadge>
            <div>
              <div className="text-sm text-espresso/50">{t("address")}</div>
              <div className="font-medium text-espresso">{t("addressValue")}</div>
            </div>
          </div>
        </div>
      </div>

      {/* <form action={sendContact} className="bg-white border border-gold/10 rounded-xl p-6 space-y-4 h-fit">
        <div>
          <label className="text-sm font-medium text-espresso">{t("formName")}</label>
          <input name="name" required className="mt-1 w-full rounded-md border border-gold/30 px-3 py-2 focus-ring" />
        </div>
        <div>
          <label className="text-sm font-medium text-espresso">{t("formEmail")}</label>
          <input name="email" required type="email" className="mt-1 w-full rounded-md border border-gold/30 px-3 py-2 focus-ring" />
        </div>
        <div>
          <label className="text-sm font-medium text-espresso">{t("formMessage")}</label>
          <textarea name="message" required rows={4} className="mt-1 w-full rounded-md border border-gold/30 px-3 py-2 focus-ring" />
        </div>
        <button type="submit" className="btn-primary w-full">
          {t("send")}
        </button>
        <p className="text-xs text-espresso/40">{t("formNote")}</p>
      </form> */}

    <ContactForm />
    </section>
  );
}
