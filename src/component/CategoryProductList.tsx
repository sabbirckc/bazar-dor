
"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types/product";
import ProductCard from "@/component/ProductCard";

type SortOption = "default" | "low-high" | "high-low";

interface CategoryProductListProps {
  products: Product[];
}

const CategoryProductList = ({
  products,
}: CategoryProductListProps) => {
  const [sortBy, setSortBy] = useState<SortOption>("default");

  const sortedProducts = useMemo(() => {
    const result = [...products];

    if (sortBy === "low-high") {
      result.sort((a, b) => a.today - b.today);
    } else if (sortBy === "high-low") {
      result.sort((a, b) => b.today - a.today);
    }

    return result;
  }, [products, sortBy]);

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-base-300 p-10 text-center">
        <p className="text-4xl">📦</p>
        <h2 className="mt-4 text-xl font-bold">
          এই বিভাগে কোনো পণ্য পাওয়া যায়নি
        </h2>
        <p className="mt-2 text-base-content/60">
          অন্য একটি বিভাগ নির্বাচন করে দেখুন।
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <p className="text-sm text-base-content/60">
          মোট {sortedProducts.length}টি পণ্য
        </p>

        <div className="flex items-center gap-3">
          <label htmlFor="product-sort" className="text-sm">
            সাজান:
          </label>

          <select
            id="product-sort"
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value as SortOption)
            }
            className="select select-bordered select-sm"
          >
            <option value="default">ডিফল্ট</option>
            <option value="low-high">দাম: কম থেকে বেশি</option>
            <option value="high-low">দাম: বেশি থেকে কম</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default CategoryProductList;
