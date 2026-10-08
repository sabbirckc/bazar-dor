import Link from "next/link";

import CategoryProductList from "@/component/CategoryProductList";

import {
  getCategoryBySlug,
  getProductsByCategory,
} from "@/lib/api";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const CategoryPage = async ({
  params,
}: CategoryPageProps) => {
  const { slug } = await params;

  const category =
    await getCategoryBySlug(slug);

  /* =====================================================
     INVALID CATEGORY
  ===================================================== */

  if (!category) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-7xl">
            🔍
          </div>

          <h1 className="mt-6 text-3xl font-bold sm:text-4xl">
            ক্যাটাগরি পাওয়া যায়নি
          </h1>

          <p className="mt-3 text-base-content/60">
            আপনি যে ক্যাটাগরিটি খুঁজছেন সেটি
            পাওয়া যায়নি।
          </p>

          <Link
            href="/"
            className="btn btn-primary mt-8"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  /* =====================================================
     GET CATEGORY PRODUCTS
  ===================================================== */

  const products =
    await getProductsByCategory(slug);

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <main className="min-h-screen">
      {/* Category Header */}

      <section className="border-b border-base-300 bg-base-100">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {/* Icon */}

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-base-200 text-4xl">
              {category.icon}
            </div>

            {/* Title */}

            <div>
              <p className="text-sm font-medium text-primary">
                পণ্যের ক্যাটাগরি
              </p>

              <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
                {category.title}
              </h1>

              <p className="mt-2 text-base-content/60">
                এই ক্যাটাগরির বর্তমান বাজারদর
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}

      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <CategoryProductList
          products={products}
        />
      </section>
    </main>
  );
};

export default CategoryPage;