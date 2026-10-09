
import { Suspense } from "react";
import Hero from "@/component/Hero";
import ProductSection from "@/component/ProductSection";
import { fetchProducts } from "@/lib/api";
import type { Product } from "@/types/product";
import { connection } from "next/server";

function HomeLoading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-10">
      <div className="h-8 w-48 rounded bg-gray-200" />
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-48 rounded-xl bg-gray-100"
          />
        ))}
      </div>
    </div>
  );
}

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

async function HomeProducts() {
  await connection();

  let products: Product[];

  try {
    products = extractProducts(await fetchProducts());
  } catch (error) {
    console.error("Failed to load homepage products:", error);

    return (
      <p className="mx-auto max-w-6xl px-4 py-10 text-center text-gray-600">
        পণ্যের তথ্য এখন লোড করা যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।
      </p>
    );
  }

  const risingProducts = products
    .filter((product) => product.change?.dir === "up")
    .sort(
      (a, b) =>
        (b.change?.pct ?? 0) - (a.change?.pct ?? 0)
    )
    .slice(0, 6);

  const fallingProducts = products
    .filter((product) => product.change?.dir === "down")
    .sort(
      (a, b) =>
        (a.change?.pct ?? 0) - (b.change?.pct ?? 0)
    )
    .slice(0, 6);

  return (
    <>
      {products.length === 0 ? (
        <p className="px-4 py-10 text-center text-gray-600">
          বর্তমানে কোনো পণ্যের তথ্য পাওয়া যায়নি।
        </p>
      ) : (
        <>
          <ProductSection
            id="দাম-বেড়েছে"
            title="আজ দাম বেড়েছে ▲"
            description="যেসব পণ্যের দাম আজ বেড়েছে"
            products={risingProducts}
          />

          <ProductSection
            id="দাম-কমেছে"
            title="আজ দাম কমেছে ▼"
            description="যেসব পণ্যের দাম আজ কমেছে"
            products={fallingProducts}
          />

          <ProductSection
            id="সব-পণ্য"
            title="সব পণ্য"
            description="প্রয়োজনীয় সব পণ্যের বর্তমান বাজারদর এক জায়গায়"
            products={products}
          />
        </>
      )}
    </>
  );
}

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Suspense fallback={<HomeLoading />}>
        <HomeProducts />
      </Suspense>
    </main>
  );
}
