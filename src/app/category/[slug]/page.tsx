import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryProductList from "@/component/CategoryProductList";
import {
  fetchProducts,
  fetchCategory,
  getProductsByCategory,
} from "@/lib/api";
import type { Product } from "@/types/product";

// Shape of a single category entry
interface CategoryInfo {
  name: string;
  icon: string;
  aliases: string[];
}

// All known categories, keyed by their URL slug
const CATEGORIES: Record<string, CategoryInfo> = {
  chal: {
    name: "চাল",
    icon: "🍚",
    aliases: ["chal", "rice", "চাল"],
  },
  dal: {
    name: "ডাল",
    icon: "🫘",
    aliases: ["dal", "lentils", "ডাল"],
  },
  tel: {
    name: "তেল",
    icon: "🛢️",
    aliases: ["tel", "oil", "তেল"],
  },
  sobji: {
    name: "সবজি",
    icon: "🥬",
    aliases: ["sobji", "vegetable", "vegetables", "সবজি"],
  },
  mach: {
    name: "মাছ",
    icon: "🐟",
    aliases: ["mach", "fish", "মাছ"],
  },
  mangsho: {
    name: "মাংস",
    icon: "🍗",
    aliases: ["mangsho", "meat", "মাংস"],
  },
  "dim-dudh": {
    name: "ডিম-দুধ",
    icon: "🥛",
    aliases: [
      "dim-dudh",
      "dim_dudh",
      "dim dudh",
      "egg",
      "eggs",
      "milk",
      "dairy",
      "ডিম-দুধ",
      "ডিম",
      "দুধ",
    ],
  },
  moshla: {
    name: "মসলা",
    icon: "🌶️",
    aliases: ["moshla", "spice", "spices", "মসলা"],
  },
};

// Make a string lowercase, trim spaces, and turn spaces/underscores into dashes
function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/[_\s]+/g, "-");
}

// Pull out a product list from whatever shape the API returns
function extractProducts(response: unknown): Product[] {
  if (Array.isArray(response)) {
    return response as Product[];
  }

  if (typeof response !== "object" || response === null) {
    return [];
  }

  const result = response as Record<string, unknown>;

  if (Array.isArray(result.data)) {
    return result.data as Product[];
  }

  if (Array.isArray(result.products)) {
    return result.products as Product[];
  }

  if (
    typeof result.data === "object" &&
    result.data !== null &&
    "products" in result.data &&
    Array.isArray((result.data as { products: unknown }).products)
  ) {
    return (result.data as { products: Product[] }).products;
  }

  return [];
}

// Pull out a category object from whatever shape the API returns
function extractCategory(
  response: unknown
): Record<string, unknown> | null {
  if (Array.isArray(response)) {
    return (response[0] as Record<string, unknown>) ?? null;
  }

  if (typeof response !== "object" || response === null) {
    return null;
  }

  const result = response as Record<string, unknown>;

  if (Array.isArray(result.data)) {
    return (result.data[0] as Record<string, unknown>) ?? null;
  }

  if (typeof result.data === "object" && result.data !== null) {
    return result.data as Record<string, unknown>;
  }

  return result;
}

// Check if a product belongs to the given category slug
function matchesCategory(product: Product, slug: string): boolean {
  const aliases = [slug, ...(CATEGORIES[slug]?.aliases ?? [])].map(normalize);

  const values = [product.category, product.categoryNameBn]
    .filter((value): value is string => typeof value === "string")
    .map(normalize);

  return values.some((value) =>
    aliases.some(
      (alias) =>
        value === alias ||
        value.startsWith(`${alias}-`) ||
        value.endsWith(`-${alias}`)
    )
  );
}

// Fetch all products without crashing the page on error
async function safelyFetchAllProducts(): Promise<Product[]> {
  try {
    return extractProducts(await fetchProducts());
  } catch (error) {
    console.error("Failed to fetch all products:", error);
    return [];
  }
}

// Fetch a single category without crashing the page on error
async function safelyFetchCategory(
  slug: string
): Promise<Record<string, unknown> | null> {
  try {
    return extractCategory(await fetchCategory(slug));
  } catch (error) {
    console.error("Failed to fetch category:", error);
    return null;
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = normalize(rawSlug);

  const fallback = CATEGORIES[slug];

  let products: Product[] = [];

  // Step 1: try to get products for this category directly from the API
  try {
    products = extractProducts(await getProductsByCategory(slug));
  } catch (error) {
    console.error(
      `Failed to fetch category products for "${slug}":`,
      error
    );
  }

  // Step 2: if nothing came back, fetch everything and filter locally
  if (products.length === 0) {
    const allProducts = await safelyFetchAllProducts();

    products = allProducts.filter((product) =>
      matchesCategory(product, slug)
    );
  }

  const category = await safelyFetchCategory(slug);
  const firstProduct = products[0];

  // Figure out the best name we can show
  const categoryName =
    (typeof category?.nameBn === "string" && category.nameBn) ||
    (typeof category?.name === "string" && category.name) ||
    (typeof category?.title === "string" && category.title) ||
    firstProduct?.categoryNameBn ||
    fallback?.name;

  // Figure out the best icon we can show
  const categoryIcon =
    (typeof category?.icon === "string" && category.icon) ||
    (typeof category?.categoryIcon === "string" && category.categoryIcon) ||
    firstProduct?.categoryIcon ||
    fallback?.icon ||
    "🛒";

  // Show 404 only when the category truly doesn't exist
  if (!categoryName) {
    notFound();
  }

  return (
    <main className="min-h-[60vh] bg-[#F0F5F0]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Breadcrumb navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex items-center gap-2 text-xs text-[#7B857D]"
        >
          <Link href="/" className="transition-colors hover:text-[#07883F]">
            হোম
          </Link>

          <span aria-hidden="true">/</span>

          <span className="text-[#26332A]">{categoryName}</span>
        </nav>

        {/* Category heading card */}
        <section className="mb-6 rounded-2xl border border-[#E1EAE2] bg-[#FAFCFA] p-5 sm:p-6">
          <div className="flex items-center gap-4">
            {/* Category icon */}
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#EAF5EC] text-3xl">
              {categoryIcon}
            </div>

            <div>
              <h1 className="text-xl font-bold text-[#26332A] sm:text-2xl">
                {categoryName}
              </h1>

              <p className="mt-1 text-xs leading-5 text-[#7B857D] sm:text-sm">
                এই বিভাগের নিত্যপ্রয়োজনীয় পণ্যের বর্তমান বাজারদর দেখুন।
              </p>
            </div>
          </div>
        </section>

        {/* Product list with sorting controls */}
        <CategoryProductList products={products} />
      </div>
    </main>
  );
}