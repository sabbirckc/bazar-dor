import { Suspense } from "react";
import { connection } from "next/server";

import Hero from "@/component/Hero";
import ProductSection from "@/component/ProductSection";
import { fetchProducts } from "@/lib/api";
import type { Product } from "@/types/product";

// Skeleton shown while products are loading
function HomeLoading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-6">
      {/* Three placeholder sections */}
      {[1, 2, 3].map((section) => (
        <div key={section} className="mb-6">
          {/* Section title placeholder */}
          <div className="mb-3 h-5 w-36 rounded bg-[#E1EAE2]" />

          {/* Grid of empty cards (last section shows 9) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({
              length: section === 3 ? 9 : 6,
            }).map((_, index) => (
              <div
                key={index}
                className="h-28 rounded-xl border border-[#E1EAE2] bg-[#FAFCFA]"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Pull the product array out of whatever shape the API returns
function extractProducts(response: unknown): Product[] {
  if (Array.isArray(response)) {
    return response as Product[];
  }

  if (
    typeof response === "object" &&
    response !== null &&
    "data" in response &&
    Array.isArray(response.data)
  ) {
    return response.data as Product[];
  }

  return [];
}

// Server component that loads products and renders the sections
async function HomeProducts() {
  await connection();

  let products: Product[];

  try {
    products = extractProducts(await fetchProducts());
  } catch (error) {
    console.error("Failed to load homepage products:", error);

    // Friendly message if fetching fails
    return (
      <p className="mx-auto max-w-6xl px-4 py-10 text-center text-sm text-[#7B857D]">
        পণ্যের তথ্য এখন লোড করা যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।
      </p>
    );
  }

  // No products at all
  if (products.length === 0) {
    return (
      <p className="px-4 py-10 text-center text-sm text-[#7B857D]">
        বর্তমানে কোনো পণ্যের তথ্য পাওয়া যায়নি।
      </p>
    );
  }

  // Top 6 products with the biggest price rise
  const risingProducts = products
    .filter((product) => product.change?.dir === "up")
    .sort((a, b) => (b.change?.pct ?? 0) - (a.change?.pct ?? 0))
    .slice(0, 6);

  // Top 6 products with the biggest price drop
  const fallingProducts = products
    .filter((product) => product.change?.dir === "down")
    .sort((a, b) => (a.change?.pct ?? 0) - (b.change?.pct ?? 0))
    .slice(0, 6);

  // Total product count in Bengali digits
  const productCount = products.length.toLocaleString("bn-BD");

  return (
    <>
      {/* Price went up */}
      <ProductSection
        id="দাম-বেড়েছে"
        title="আজ দাম বেড়েছে"
        products={risingProducts}
      />

      {/* Price went down */}
      <ProductSection
        id="দাম-কমেছে"
        title="আজ দাম কমেছে"
        products={fallingProducts}
      />

      {/* All products */}
      <ProductSection
        id="সব-পণ্য"
        title="সব পণ্য"
        description={`মোট ${productCount}টি পণ্য দেখানো হচ্ছে`}
        products={products}
      />
    </>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F0F5F0]">
      <Hero />

      {/* Show skeleton while products load */}
      <Suspense fallback={<HomeLoading />}>
        <HomeProducts />
      </Suspense>
    </main>
  );
}