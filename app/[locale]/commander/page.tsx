"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { getProductById, getWilayas, createOrder, ApiError } from "@/lib/api";
import type { Product, ShippingWilaya, DeliveryType, OrderResponse } from "@/lib/types";
import { formatPrice, algerianPhoneRegex, getDisplayImages } from "@/lib/utils";
import { CheckCircle2, Loader2 } from "lucide-react";
import { BeeIcon } from "@/components/Hex";

export default function CommanderPage() {
  const t = useTranslations("Checkout");
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId") ?? "";
  const variantSku = searchParams.get("variantSku") ?? "";
  const initialQty = Number(searchParams.get("quantity")) || 1;

  const schema = z.object({
    customerName: z.string().min(2, t("errors.name")),
    customerPhone: z.string().regex(algerianPhoneRegex, t("errors.phone")),
    customerEmail: z.string().email(t("errors.email")).optional().or(z.literal("")),
    wilaya: z.string().min(1, t("errors.wilaya")),
    deliveryType: z.enum(["domicile", "agence"]),
    address: z.string().min(5, t("errors.address")),
    note: z.string().optional(),
  });
  type FormValues = z.infer<typeof schema>;

  const [product, setProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [productError, setProductError] = useState<string | null>(null);
  const [wilayas, setWilayas] = useState<ShippingWilaya[]>([]);
  const [quantity, setQuantity] = useState(initialQty);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderResponse | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { deliveryType: "domicile" },
  });

  useEffect(() => {
    if (!productId) {
      setLoadingProduct(false);
      setProductError(t("noProductSelected"));
      return;
    }
    getProductById(productId)
      .then((p) => {
        if (!p) setProductError(t("productNotFound"));
        setProduct(p);
      })
      .catch(() => setProductError(t("productLoadError")))
      .finally(() => setLoadingProduct(false));

    getWilayas()
      .then(setWilayas)
      .catch(() => setWilayas([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const variant = useMemo(
    () => product?.variants.find((v) => v.sku === variantSku) ?? product?.variants[0],
    [product, variantSku]
  );

  const wilayaName = watch("wilaya");
  const deliveryType = watch("deliveryType") as DeliveryType | undefined;
  const selectedWilaya = wilayas.find((w) => w.nom === wilayaName);
  const shippingFee = selectedWilaya
    ? deliveryType === "agence"
      ? selectedWilaya.prixAgence
      : selectedWilaya.prixDomicile
    : 0;

  const unitPrice = variant?.price ?? product?.basePrice ?? 0;
  const subtotal = unitPrice * quantity;
  const total = subtotal + shippingFee;
  const displayImage = product && variant ? getDisplayImages(product, variant)[0] : undefined;

  async function onSubmit(values: FormValues) {
    if (!product || !variant) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await createOrder({
        productId: product.id,
        variantSku: variant.sku,
        quantity,
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        customerEmail: values.customerEmail || undefined,
        wilaya: values.wilaya,
        deliveryType: values.deliveryType,
        address: values.address,
        note: values.note || undefined,
      });
      setOrder(res);
    } catch (err) {
      if (err instanceof ApiError) {
        setSubmitError(err.message);
      } else {
        setSubmitError(t("genericError"));
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingProduct) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center text-espresso/60">
        {t("loading")}
      </div>
    );
  }

  if (productError || !product || !variant) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-espresso/70">{productError ?? t("productNotFound")}</p>
      </div>
    );
  }

  if (order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <CheckCircle2 className="w-14 h-14 text-gold mx-auto mb-6" />
        <h1 className="font-serif text-3xl text-espresso mb-3">{t("confirmedTitle")}</h1>
        <p className="text-espresso/70 mb-6">{t("confirmedDesc")}</p>
        <div className="bg-white border border-gold/20 rounded-xl p-6 text-left text-sm space-y-2">
          <div className="flex justify-between"><span>{t("orderNumber")}</span><span className="font-medium">{order.order._id}</span></div>
          <div className="flex justify-between"><span>{t("status")}</span><span className="font-medium">{order.order.status}</span></div>
          <div className="flex justify-between"><span>{t("total")}</span><span className="font-medium">{formatPrice(order.order.totalPrice)}</span></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-14 grid lg:grid-cols-[1.4fr_1fr] gap-12">
      <div>
        <h1 className="font-serif text-3xl text-espresso mb-8">{t("title")}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-espresso">{t("fullName")}</label>
            <input
              {...register("customerName")}
              className="mt-1 w-full rounded-md border border-gold/30 px-3 py-2 focus-ring"
              placeholder={t("fullNamePlaceholder")}
            />
            {errors.customerName && (
              <p className="text-xs text-red-600 mt-1">{errors.customerName.message}</p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-espresso">{t("phone")}</label>
              <input
                {...register("customerPhone")}
                className="mt-1 w-full rounded-md border border-gold/30 px-3 py-2 focus-ring"
                placeholder="0551234567"
              />
              {errors.customerPhone && (
                <p className="text-xs text-red-600 mt-1">{errors.customerPhone.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-espresso">{t("email")}</label>
              <input
                {...register("customerEmail")}
                className="mt-1 w-full rounded-md border border-gold/30 px-3 py-2 focus-ring"
                placeholder="vous@exemple.com"
              />
              {errors.customerEmail && (
                <p className="text-xs text-red-600 mt-1">{errors.customerEmail.message}</p>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-espresso">{t("wilaya")}</label>
              <select
                {...register("wilaya")}
                className="mt-1 w-full rounded-md border border-gold/30 px-3 py-2 focus-ring bg-white"
              >
                <option value="">{t("chooseWilaya")}</option>
                {wilayas.map((w) => (
                  <option key={w.nom} value={w.nom}>
                    {w.nom}
                  </option>
                ))}
              </select>
              {errors.wilaya && (
                <p className="text-xs text-red-600 mt-1">{errors.wilaya.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-espresso">{t("delivery")}</label>
              <div className="mt-2 flex gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input type="radio" value="domicile" {...register("deliveryType")} />
                  {t("deliveryHome")} {selectedWilaya ? `(${formatPrice(selectedWilaya.prixDomicile)})` : ""}
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" value="agence" {...register("deliveryType")} />
                  {t("deliveryAgency")} {selectedWilaya ? `(${formatPrice(selectedWilaya.prixAgence)})` : ""}
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-espresso">{t("address")}</label>
            <textarea
              {...register("address")}
              rows={3}
              className="mt-1 w-full rounded-md border border-gold/30 px-3 py-2 focus-ring"
              placeholder={t("addressPlaceholder")}
            />
            {errors.address && (
              <p className="text-xs text-red-600 mt-1">{errors.address.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-espresso">{t("note")}</label>
            <textarea
              {...register("note")}
              rows={2}
              className="mt-1 w-full rounded-md border border-gold/30 px-3 py-2 focus-ring"
              placeholder={t("notePlaceholder")}
            />
          </div>

          {submitError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {t("confirm")}
          </button>
        </form>
      </div>

      <aside className="bg-white border border-gold/20 rounded-xl p-6 h-fit sticky top-24">
        <h2 className="font-serif text-xl text-espresso mb-4">{t("summary")}</h2>
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gold/5 shrink-0">
            {displayImage ? (
              <Image src={displayImage} alt={product.name} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gold/40">
                <BeeIcon className="w-6 h-6" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-espresso/80 truncate">{product.name}</div>
            {variant.attributes && (
              <div className="text-xs text-espresso/50">
                {Object.values(variant.attributes).join(" / ")}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-espresso/70">{t("quantity")}</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-6 h-6 border border-gold/30 rounded text-xs"
            >
              −
            </button>
            <span>{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(q + 1, variant.stock))}
              className="w-6 h-6 border border-gold/30 rounded text-xs"
            >
              +
            </button>
          </div>
        </div>
        <div className="space-y-2 text-sm border-t border-gold/10 pt-4 mt-4">
          <div className="flex justify-between text-espresso/70">
            <span>{t("subtotal")}</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-espresso/70">
            <span>{t("shipping")}</span>
            <span>{selectedWilaya ? formatPrice(shippingFee) : "—"}</span>
          </div>
          <div className="flex justify-between font-medium text-espresso text-base border-t border-gold/10 pt-3 mt-2">
            <span>{t("total")}</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
