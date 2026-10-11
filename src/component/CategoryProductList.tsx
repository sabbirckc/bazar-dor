"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/component/ProductCard";
import type { Product } from "@/types/product";

interface CategoryProductListProps {
  products: Product[];
}

// The four ways a user can sort the list
type SortOption = "default" | "price-low" | "price-high" | "change-high";

export default function CategoryProductList({
  products,
}: CategoryProductListProps) {
  const [sortBy, setSortBy] = useState<SortOption>("default");

  // Re-sort the list whenever products or the sort option changes
  const sortedProducts = useMemo(() => {
    const result = [...products];

    switch (sortBy) {
      case "price-low":
        // Cheapest first
        return result.sort((a, b) => a.today - b.today);

      case "price-high":
        // Most expensive first
        return result.sort((a, b) => b.today - a.today);

      case "change-high":
        // Biggest price change first (up or down)
        return result.sort(
          (a, b) => Math.abs(b.change.pct) - Math.abs(a.change.pct)
        );

      default:
        // Keep the original order
        return result;
    }
  }, [products, sortBy]);

  return (
    <section>
      {/* Header: product count + sort dropdown */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-[#7B857D]">
          মোট {products.length}টি পণ্য
        </p>

        <div className="flex items-center gap-2">
          <label htmlFor="product-sort" className="text-xs text-[#7B857D]">
            সাজান
          </label>

          <select
            id="product-sort"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortOption)}
            className="h-9 rounded-lg border border-[#07883F] bg-[#FAFCFA] px-3 text-sm text-[#26332A] outline-none focus:ring-2 focus:ring-[#07883F]/20"
          >
            <option value="default">ডিফল্ট</option>
            <option value="price-low">দাম: কম থেকে বেশি</option>
            <option value="price-high">দাম: বেশি থেকে কম</option>
            <option value="change-high">দামের পরিবর্তন</option>
          </select>
        </div>
      </div>

      {/* Product grid, or a friendly empty-state message */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-[#E1EAE2] bg-[#FAFCFA] px-4 py-12 text-center">
          <p className="text-sm text-[#7B857D]">
            এই বিভাগে কোনো পণ্য পাওয়া যায়নি।
          </p>
        </div>
      )}
    </section>
  );
}