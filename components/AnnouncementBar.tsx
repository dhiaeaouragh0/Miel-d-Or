import { useTranslations } from "next-intl";

export function AnnouncementBar() {
  const t = useTranslations("Announcement");
  const items = [t("shipping"), t("natural"), t("rating")];
  return (
    <div className="bg-gold text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-center gap-x-8 gap-y-1 text-center">
        {items.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </div>
  );
}
