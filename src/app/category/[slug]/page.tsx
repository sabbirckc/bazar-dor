
import Link from "next/link";
import { notFound } from "next/navigation";

import CategoryProductList from "@/component/CategoryProductList";
import {
  getCategoryBySlug,
  getProductsByCategory,
} from "@/lib/api";

import type { Product } from "@/types/product";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface Category {
  slug?: string;
  nameBn?: string;
  title?: string;
  name?: string;
  icon?: string;
  categoryIcon?: string;
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { slug } = await params;

  let categoryResponse: unknown;

  try {
    categoryResponse = await getCategoryBySlug(slug);
  } catch (error) {
    console.error("Failed to load category:", error);
    notFound();
  }

  const categoryObject =
    typeof categoryResponse === "object" &&
    categoryResponse !== null &&
    "data" in categoryResponse
      ? categoryResponse.data
      : categoryResponse;

  const category =
    typeof categoryObject === "object" &&
    categoryObject !== null &&
    !Array.isArray(categoryObject)
      ? (categoryObject as Category)
      : null;

  if (!category || category.slug !== slug) {
    notFound();
  }

  let productsResponse: unknown;

  try {
    productsResponse = await getProductsByCategory(slug);
  } catch (error) {
    console.error("Failed to load category products:", error);
    productsResponse = [];
  }

  const productsData =
    typeof productsResponse === "object" &&
    productsResponse !== null &&
    "data" in productsResponse
      ? productsResponse.data
      : productsResponse;

  const products: Product[] = Array.isArray(productsData)
    ? (productsData as Product[])
    : [];

  const title =
    category.nameBn ?? category.title ?? category.name ?? slug;

  const icon = category.categoryIcon ?? category.icon ?? "🛒";

  return (
    <main className="min-h-screen">
      <section className="border-b border-base-300 bg-base-100">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <Link href="/" className="btn btn-ghost btn-sm mb-6">
            ← হোমে ফিরে যান
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-5xl sm:text-6xl">{icon}</span>

            <div>
              <p className="text-sm text-base-content/60">
                পণ্যের বিভাগ
              </p>

              <h1 className="text-3xl font-bold sm:text-4xl">
                {title}
              </h1>

              <p className="mt-2 text-base-content/60">
                এই বিভাগের পণ্যের বর্তমান বাজারদর
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <CategoryProductList products={products} />
      </section>
    </main>
  );
};

export default CategoryPage;
