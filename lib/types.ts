// Types matching the Miel d'Or backend API (https://bc.dhiae.space)
// NOTE: these shapes are inferred from the project brief. If the live API
// returns slightly different field names, adjust here — this is the single
// source of truth consumed by the rest of the app.

export interface OptionType {
  name: string; // e.g. "Couleur", "Taille"
  values: string[];
}

export interface ProductVariant {
  sku: string;
  attributes: Record<string, string>; // e.g. { Couleur: "Doré", Taille: "500g" }
  price: number;
  stock: number;
  images: string[];
}

export interface Product {
  id: string;
  _id?: string; // raw Mongo id, present on some backends — normalized into `id`
  slug: string;
  name: string;
  brand?: string;
  description?: string;
  basePrice: number;
  image?: string;
  tags?: string[];
  isFeatured?: boolean;
  optionTypes?: OptionType[];
  variants: ProductVariant[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: Pagination;
}

export interface ShippingWilaya {
  nom: string; // e.g. "alger"
  prixDomicile: number;
  prixAgence: number;
}

export type DeliveryType = "domicile" | "agence";

export interface CreateOrderPayload {
  productId: string;
  variantSku: string;
  quantity: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  wilaya: string;
  deliveryType: DeliveryType;
  address: string;
  note?: string;
}

export interface Order {
  _id: string;
  product: string;
  variantSku: string;
  quantity: number;
  unitPrice: number;
  shippingFee: number;
  totalPrice: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  wilaya: string;
  deliveryType: DeliveryType;
  address: string;
  note?: string;
  status: string;
  createdAt: string;
  [key: string]: unknown;
}

export interface OrderResponse {
  message: string;
  order: Order;
}
