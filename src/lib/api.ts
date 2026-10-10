
const API_BASE_URLS = [
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

async function apiRequest<T = unknown>(
  endpoint: string
): Promise<T> {
  let lastError: Error | null = null;

  for (const baseURL of API_BASE_URLS) {
    try {
      const response = await fetch(`${baseURL}${endpoint}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status} ${response.statusText}`
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError =
        error instanceof Error
          ? error
          : new Error("Unknown API error");

      console.error(
        `API request failed (${baseURL}):`,
        lastError.message
      );
    }
  }

  throw new Error(
    `Unable to fetch ${endpoint}: ${
      lastError?.message ?? "Both API servers failed."
    }`
  );
}

export async function fetchProducts() {
  return apiRequest("/products");
}

export const getProducts = fetchProducts;

export async function getProductsByCategory(slug: string) {
  return apiRequest(
    `/products?category=${encodeURIComponent(slug)}`
  );
}

export async function getProductBySlug(slug: string) {
  const response = await fetchProducts();

  const products: unknown[] = Array.isArray(response)
    ? response
    : typeof response === "object" &&
        response !== null &&
        "data" in response &&
        Array.isArray(response.data)
      ? response.data
      : [];

  return (
    products.find(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "slug" in item &&
        item.slug === slug
    ) ?? null
  );
}

export async function fetchCategories() {
  return apiRequest("/categories");
}

export async function fetchCategory(slug: string) {
  return apiRequest(
    `/categories/${encodeURIComponent(slug)}`
  );
}

export const getCategoryBySlug = fetchCategory;
