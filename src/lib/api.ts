
const API_BASE_URLS = [
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

async function apiRequest<T = unknown>(endpoint: string): Promise<T> {
  let lastError: Error | null = null;

  for (const baseURL of API_BASE_URLS) {
    try {
      const response = await fetch(`${baseURL}${endpoint}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          `${baseURL}${endpoint} returned ${response.status} ${response.statusText}`
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError =
        error instanceof Error
          ? error
          : new Error("Unknown API error");

      console.error(`API request failed: ${baseURL}${endpoint}`, error);
    }
  }

  throw new Error(
    `Unable to load ${endpoint}. ${lastError?.message ?? "Both APIs failed."}`
  );
}

// Fetch all products
export async function fetchProducts() {
  return apiRequest("/products");
}

// Keep this alias if page.tsx imports getProducts
export const getProducts = fetchProducts;

// Fetch one product
export async function fetchProduct(slug: string) {
  return apiRequest(`/products/${encodeURIComponent(slug)}`);
}

// Fetch all categories
export async function fetchCategories() {
  return apiRequest("/categories");
}

// Fetch one category
export async function fetchCategory(slug: string) {
  return apiRequest(`/categories/${encodeURIComponent(slug)}`);
}
