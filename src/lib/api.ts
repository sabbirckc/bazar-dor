import { Product } from "@/types/product";

/* =========================================================
   API BASE URLS
========================================================= */

const API_BASE_URLS = [
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

/* =========================================================
   RAW API TYPES
========================================================= */

interface RawMarket {
  market?: string;
  division?: string;
  min?: number | string;
  max?: number | string;
}

interface RawChange {
  dir?: string;
  pct?: number | string;
}

interface RawProduct {
  id?: string | number;
  slug?: string;

  nameBn?: string;

  category?: string;
  categoryNameBn?: string;
  categoryIcon?: string;

  unit?: string;
  image?: string;

  today?: number | string;
  yesterday?: number | string;
  lastWeek?: number | string;

  change?: RawChange;

  markets?: RawMarket[];
}

interface RawCategory {
  id?: string | number;

  slug?: string;

  title?: string;
  titleBn?: string;

  name?: string;
  nameBn?: string;

  category?: string;
  categoryNameBn?: string;

  icon?: string;
  categoryIcon?: string;

  products?: RawProduct[];

  data?: unknown;
}

/* =========================================================
   CATEGORY TYPE
========================================================= */

export interface Category {
  slug: string;
  title: string;
  icon: string;
}

/* =========================================================
   NUMBER HELPER
========================================================= */

const toNumber = (
  value: unknown,
  fallback = 0
): number => {
  if (typeof value === "number") {
    return Number.isFinite(value)
      ? value
      : fallback;
  }

  if (typeof value === "string") {
    const number = Number(
      value.replace(/,/g, "").trim()
    );

    return Number.isFinite(number)
      ? number
      : fallback;
  }

  return fallback;
};

/* =========================================================
   EXTRACT PRODUCTS
========================================================= */

const extractProducts = (
  result: unknown
): RawProduct[] => {
  // API returns an array directly
  if (Array.isArray(result)) {
    return result as RawProduct[];
  }

  if (
    typeof result !== "object" ||
    result === null
  ) {
    return [];
  }

  const data =
    result as Record<string, unknown>;

  // { data: [...] }
  if (Array.isArray(data.data)) {
    return data.data as RawProduct[];
  }

  // { products: [...] }
  if (Array.isArray(data.products)) {
    return data.products as RawProduct[];
  }

  // { data: { products: [...] } }
  if (
    typeof data.data === "object" &&
    data.data !== null
  ) {
    const nested =
      data.data as Record<string, unknown>;

    if (Array.isArray(nested.products)) {
      return nested.products as RawProduct[];
    }

    if (Array.isArray(nested.data)) {
      return nested.data as RawProduct[];
    }
  }

  return [];
};

/* =========================================================
   NORMALIZE PRODUCT
========================================================= */

const normalizeProduct = (
  item: RawProduct
): Product => {
  const today = toNumber(item.today);

  const yesterday = toNumber(
    item.yesterday
  );

  let change = toNumber(
    item.change?.pct
  );

  /*
   * If percentage change isn't available,
   * calculate it from today's and yesterday's price.
   */
  if (
    change === 0 &&
    yesterday > 0 &&
    today !== yesterday
  ) {
    change =
      ((today - yesterday) / yesterday) *
      100;
  }

  /*
   * Normalize market information.
   */
  const markets = Array.isArray(item.markets)
    ? item.markets
        .map((market) => ({
          market:
            market.market ?? "",

          division:
            market.division ?? "",

          min:
            toNumber(market.min),

          max:
            toNumber(market.max),
        }))
        .filter(
          (market) =>
            market.market !== ""
        )
    : [];

  return {
    id: item.id ?? "",

    slug:
      item.slug ??
      String(item.id ?? ""),

    name:
      item.nameBn ??
      "পণ্য",

    description:
      item.categoryNameBn,

    category:
      item.category,

    categoryName:
      item.categoryNameBn,

    unit:
      item.unit ?? "kg",

    price:
      today,

    previousPrice:
      yesterday || undefined,

    change,

    /*
     * IMPORTANT:
     * The API's `image` field contains an emoji,
     * not an image URL.
     *
     * Example:
     * image: "🍚"
     */
    emoji:
      item.image ??
      item.categoryIcon ??
      "🛒",

    markets,
  };
};

/* =========================================================
   GET ALL PRODUCTS
========================================================= */

export const getProducts =
  async (): Promise<Product[]> => {
    for (const baseUrl of API_BASE_URLS) {
      try {
        const response = await fetch(
          `${baseUrl}/products`,
          {
            next: {
              revalidate: 300,
            },
          }
        );

        if (!response.ok) {
          console.error(
            `Products API failed: ${baseUrl}`,
            response.status,
            response.statusText
          );

          continue;
        }

        const result =
          await response.json();

        console.log(
          "Bazar Dor products response:",
          result
        );

        const rawProducts =
          extractProducts(result);

        if (rawProducts.length > 0) {
          return rawProducts.map(
            normalizeProduct
          );
        }
      } catch (error) {
        console.error(
          `Products API error from ${baseUrl}:`,
          error
        );
      }
    }

    console.error(
      "No products found from any Bazar Dor API."
    );

    return [];
  };

/* =========================================================
   GET SINGLE PRODUCT BY SLUG
========================================================= */

export const getProductBySlug =
  async (
    slug: string
  ): Promise<Product | null> => {
    /*
     * Step 1:
     * Get the product list and find the product
     * whose slug matches the URL.
     */
    const products = await getProducts();

    const matchedProduct = products.find(
      (product) => product.slug === slug
    );

    if (!matchedProduct) {
      console.error(
        `Product with slug "${slug}" was not found.`
      );

      return null;
    }

    /*
     * Step 2:
     * The API detail endpoint uses the numeric ID:
     *
     * /products/1
     *
     * not:
     *
     * /products/sorno-machi-chal
     */
    const productId = matchedProduct.id;

    for (const baseUrl of API_BASE_URLS) {
      try {
        const response = await fetch(
          `${baseUrl}/products/${encodeURIComponent(
            String(productId)
          )}`,
          {
            next: {
              revalidate: 300,
            },
          }
        );

        if (!response.ok) {
          console.error(
            `Product detail API failed: ${baseUrl}/products/${productId}`,
            response.status
          );

          continue;
        }

        const result =
          await response.json();

        console.log(
          "Product detail response:",
          result
        );

        let rawProduct:
          | RawProduct
          | null = null;

        /*
         * Handle:
         *
         * { data: {...} }
         *
         * or:
         *
         * {...}
         */
        if (
          typeof result === "object" &&
          result !== null &&
          "data" in result
        ) {
          const data =
            (
              result as {
                data?: unknown;
              }
            ).data;

          if (
            typeof data === "object" &&
            data !== null &&
            !Array.isArray(data)
          ) {
            rawProduct =
              data as RawProduct;
          }
        } else if (
          typeof result === "object" &&
          result !== null &&
          !Array.isArray(result)
        ) {
          rawProduct =
            result as RawProduct;
        }

        if (rawProduct) {
          return normalizeProduct(
            rawProduct
          );
        }
      } catch (error) {
        console.error(
          `Product detail error for ${productId}:`,
          error
        );
      }
    }

    /*
     * If the detail request fails, at least return
     * the product we already found from the list.
     */
    return matchedProduct;
  };

/* =========================================================
   EXTRACT CATEGORIES
========================================================= */

const extractCategories = (
  result: unknown
): RawCategory[] => {
  // Array response
  if (Array.isArray(result)) {
    return result as RawCategory[];
  }

  if (
    typeof result !== "object" ||
    result === null
  ) {
    return [];
  }

  const data =
    result as Record<string, unknown>;

  // { data: [...] }
  if (Array.isArray(data.data)) {
    return data.data as RawCategory[];
  }

  // { categories: [...] }
  if (Array.isArray(data.categories)) {
    return data.categories as RawCategory[];
  }

  return [];
};

/* =========================================================
   GET ALL CATEGORIES
========================================================= */

export const getCategories =
  async (): Promise<Category[]> => {
    for (const baseUrl of API_BASE_URLS) {
      try {
        const response = await fetch(
          `${baseUrl}/categories`,
          {
            next: {
              revalidate: 3600,
            },
          }
        );

        if (!response.ok) {
          console.error(
            `Categories API failed: ${baseUrl}`,
            response.status
          );

          continue;
        }

        const result =
          await response.json();

        console.log(
          "Bazar Dor categories response:",
          result
        );

        const rawCategories =
          extractCategories(result);

        if (
          rawCategories.length > 0
        ) {
          return rawCategories
            .map((category) => {
              const slug =
                category.slug ??
                category.category ??
                "";

              const title =
                category.titleBn ??
                category.nameBn ??
                category.title ??
                category.name ??
                category.categoryNameBn ??
                slug;

              const icon =
                category.icon ??
                category.categoryIcon ??
                "🛒";

              return {
                slug: String(slug),
                title: String(title),
                icon: String(icon),
              };
            })
            .filter(
              (category) =>
                category.slug !== ""
            );
        }
      } catch (error) {
        console.error(
          `Categories API error from ${baseUrl}:`,
          error
        );
      }
    }

    return [];
  };

/* =========================================================
   GET CATEGORY BY SLUG
========================================================= */

export const getCategoryBySlug =
  async (
    slug: string
  ): Promise<Category | null> => {
    /*
     * First check the categories list.
     */
    const categories =
      await getCategories();

    const category =
      categories.find(
        (item) =>
          item.slug === slug
      );

    if (category) {
      return category;
    }

    /*
     * If not found, try:
     *
     * /categories/[slug]
     */
    for (const baseUrl of API_BASE_URLS) {
      try {
        const response = await fetch(
          `${baseUrl}/categories/${encodeURIComponent(
            slug
          )}`,
          {
            next: {
              revalidate: 3600,
            },
          }
        );

        if (!response.ok) {
          continue;
        }

        const result =
          await response.json();

        let rawCategory:
          | RawCategory
          | null = null;

        if (
          typeof result === "object" &&
          result !== null &&
          "data" in result
        ) {
          const data =
            (
              result as {
                data?: unknown;
              }
            ).data;

          if (
            typeof data === "object" &&
            data !== null &&
            !Array.isArray(data)
          ) {
            rawCategory =
              data as RawCategory;
          }
        } else if (
          typeof result === "object" &&
          result !== null &&
          !Array.isArray(result)
        ) {
          rawCategory =
            result as RawCategory;
        }

        if (rawCategory) {
          return {
            slug: String(
              rawCategory.slug ??
                rawCategory.category ??
                slug
            ),

            title: String(
              rawCategory.titleBn ??
                rawCategory.nameBn ??
                rawCategory.title ??
                rawCategory.name ??
                rawCategory.categoryNameBn ??
                slug
            ),

            icon: String(
              rawCategory.icon ??
                rawCategory.categoryIcon ??
                "🛒"
            ),
          };
        }
      } catch (error) {
        console.error(
          `Category API error for ${slug}:`,
          error
        );
      }
    }

    return null;
  };

/* =========================================================
   GET PRODUCTS BY CATEGORY
========================================================= */

export const getProductsByCategory =
  async (
    slug: string
  ): Promise<Product[]> => {
    /*
     * Primary endpoint:
     *
     * /products?category=chal
     */
    for (const baseUrl of API_BASE_URLS) {
      try {
        const response = await fetch(
          `${baseUrl}/products?category=${encodeURIComponent(
            slug
          )}`,
          {
            next: {
              revalidate: 300,
            },
          }
        );

        if (!response.ok) {
          console.error(
            `Category products API failed: ${baseUrl}`,
            response.status
          );

          continue;
        }

        const result =
          await response.json();

        console.log(
          `Products for category ${slug}:`,
          result
        );

        const rawProducts =
          extractProducts(result);

        if (rawProducts.length > 0) {
          return rawProducts.map(
            normalizeProduct
          );
        }
      } catch (error) {
        console.error(
          `Category products error for ${slug}:`,
          error
        );
      }
    }

    /*
     * Fallback endpoint:
     *
     * /categories/chal
     */
    for (const baseUrl of API_BASE_URLS) {
      try {
        const response = await fetch(
          `${baseUrl}/categories/${encodeURIComponent(
            slug
          )}`,
          {
            next: {
              revalidate: 300,
            },
          }
        );

        if (!response.ok) {
          continue;
        }

        const result =
          await response.json();

        const rawProducts =
          extractProducts(result);

        if (rawProducts.length > 0) {
          return rawProducts.map(
            normalizeProduct
          );
        }
      } catch (error) {
        console.error(
          `Category endpoint error for ${slug}:`,
          error
        );
      }
    }

    return [];
  };