"use client";

import { useRef } from "react";
import { sendContact } from "@/lib/contact";
import { useTranslations } from "next-intl";

export function ContactForm() {
  const t = useTranslations("Contact");
  const formRef = useRef<HTMLFormElement>(null);

  async function action(formData: FormData) {
    await sendContact(formData);

    formRef.current?.reset();
    alert("DONE تم إرسال رسالتك بنجاح. سنقوم بالرد عليك في أقرب وقت ممكن");
  }

  return (
    <form
      ref={formRef}
      action={action}
      className="bg-white border border-gold/10 rounded-xl p-6 space-y-4 h-fit"
    >
      <div>
        <label>{t("formName")}</label>
        <input name="name" required className="mt-1 w-full rounded-md border px-3 py-2" />
      </div>

      <div>
        <label>{t("formEmail")}</label>
        <input name="email" required type="email" className="mt-1 w-full rounded-md border px-3 py-2" />
      </div>

      <div>
        <label>{t("formMessage")}</label>
        <textarea name="message" required rows={4} className="mt-1 w-full rounded-md border px-3 py-2" />
      </div>

      <button type="submit" className="btn-primary w-full">
        {t("send")}
      </button>

      {/* <p className="text-xs text-espresso/40">
        {t("formNote")}
      </p> */}
    </form>
  );
}