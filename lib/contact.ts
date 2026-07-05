"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContact(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  await resend.emails.send({
    from: "Contact <onboarding@resend.dev>",
    to: process.env.CONTACT_EMAIL!,
    subject: `Nouveau message de ${name}`,
    replyTo: email,
    text: `Nom: ${name}\nEmail: ${email}\nMessage: ${message}`,
  });

  return { success: true };
}