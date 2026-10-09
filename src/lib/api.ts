
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
          `Request failed: ${response.status} ${response.statusText}`
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError =
        error instanceof Error
          ? error
          : new Error("Unknown API error");

      console.error(`API request failed (${baseURL}):`, lastError.message);
    }
  }

  throw new Error(
    `Unable to fetch ${endpoint}: ${
      lastError?.message ?? "Both API servers failed."
    }`
  );
}

// Fetch every product from the API.
export async function fetchProducts() {
  return apiRequest("/products");
}

// Backwards-compatible alias for existing imports.
export const getProducts = fetchProducts;

// Fetch one product using its actual slug from the products list.
// The API's individual-product endpoint may require a numeric ID.
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

// Fetch all categories.
export async function fetchCategories() {
  return apiRequest("/categories");
}

// Fetch a category by slug.
export async function fetchCategory(slug: string) {
  return apiRequest(`/categories/${encodeURIComponent(slug)}`);
}
