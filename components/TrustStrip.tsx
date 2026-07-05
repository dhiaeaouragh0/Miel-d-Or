import { useTranslations } from "next-intl";
import { HexBadge, BeeIcon } from "./Hex";
import { Leaf, ShieldCheck, Truck } from "lucide-react";

export function TrustStrip() {
  const t = useTranslations("Trust");

  const items = [
    { icon: <BeeIcon className="w-6 h-6" />, title: t("naturalTitle"), desc: t("naturalDesc") },
    { icon: <Leaf className="w-6 h-6" />, title: t("harvestTitle"), desc: t("harvestDesc") },
    { icon: <ShieldCheck className="w-6 h-6" />, title: t("qualityTitle"), desc: t("qualityDesc") },
    { icon: <Truck className="w-6 h-6" />, title: t("deliveryTitle"), desc: t("deliveryDesc") },
  ];

  return (
    <section className="border-y border-gold/10 bg-white/40">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((item) => (
          <div key={item.title} className="flex items-center gap-4">
            <HexBadge size={56}>{item.icon}</HexBadge>
            <div>
              <div className="font-medium text-espresso">{item.title}</div>
              <div className="text-sm text-espresso/60">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
