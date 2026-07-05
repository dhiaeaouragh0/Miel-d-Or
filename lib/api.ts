import type {
  ProductsResponse,
  ShippingWilaya,
  CreateOrderPayload,
  OrderResponse,
  Product,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://bc.dhiae.space";

export class ApiError extends Error {
  status: number;
  body?: unknown;
  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

async function request<T>(
  path: string,
  init?: RequestInit & { revalidate?: number }
): Promise<T> {
  const { revalidate, ...rest } = init ?? {};
  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(rest.headers ?? {}),
    },
    next: revalidate !== undefined ? { revalidate } : undefined,
  });

  let body: unknown = undefined;
  try {
    body = await res.json();
  } catch {
    // no JSON body
  }

  if (!res.ok) {
    const message =
      (body as { message?: string; error?: string } | undefined)?.message ??
      (body as { message?: string; error?: string } | undefined)?.error ??
      `Erreur API (${res.status})`;
    throw new ApiError(message, res.status, body);
  }

  return body as T;
}

export async function getProducts(page = 1, limit = 12) {
  const res = await request<ProductsResponse>(`/api/products?brand=miel&page=${page}&limit=${limit}`, {
    revalidate: 60,
  });
  // Some backends return Mongo-style `_id` instead of `id` — normalize so the
  // rest of the app can always rely on `product.id`.
  res.products = res.products.map((p) => ({
    ...p,
    id: p.id ?? (p as Product & { _id?: string })._id ?? "",
  }));
  return res;
}

/**
 * Best-effort single product lookup by slug. The brief doesn't confirm a
 * dedicated `/api/products/:slug` endpoint, so this scans paginated results.
 * If the backend exposes a direct endpoint, swap this implementation for:
 *   request<Product>(`/api/products/${slug}`, { revalidate: 60 })
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  let page = 1;
  const limit = 50;
  while (true) {
    const { products, pagination } = await getProducts(page, limit);
    const found = products.find((p) => p.slug === slug);
    if (found) return found;
    if (page >= pagination.totalPages) return null;
    page += 1;
  }
}

export async function getProductById(productId: string): Promise<Product | null> {
  let page = 1;
  const limit = 50;
  while (true) {
    const { products, pagination } = await getProducts(page, limit);
    const found = products.find((p) => p.id === productId);
    if (found) return found;
    if (page >= pagination.totalPages) return null;
    page += 1;
  }
}

export function getWilayas() {
  return request<ShippingWilaya[]>(`/api/shipping-wilayas`, {
    revalidate: 3600,
  });
}

export function createOrder(payload: CreateOrderPayload) {
  return request<OrderResponse>(`/api/orders`, {
    method: "POST",
    body: JSON.stringify(payload),
    cache: "no-store",
  });
}
