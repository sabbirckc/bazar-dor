"use client";

import { useMemo, useState } from "react";

import ProductCard from "./ProductCard";

import { Product } from "@/types/product";

import { bengaliToEnglishNumber } from "@/lib/number";

interface CategoryProductListProps {
  products: Product[];
}

type SortOption =
  | "default"
  | "low"
  | "high";

const CategoryProductList = ({
  products,
}: CategoryProductListProps) => {
  const [sort, setSort] =
    useState<SortOption>("default");

  const sortedProducts = useMemo(() => {
    const productsCopy = [...products];

    if (sort === "low") {
      return productsCopy.sort(
        (a, b) =>
          bengaliToEnglishNumber(
            String(a.price)
          ) -
          bengaliToEnglishNumber(
            String(b.price)
          )
      );
    }

    if (sort === "high") {
      return productsCopy.sort(
        (a, b) =>
          bengaliToEnglishNumber(
            String(b.price)
          ) -
          bengaliToEnglishNumber(
            String(a.price)
          )
      );
    }

    return productsCopy;
  }, [products, sort]);

  return (
    <>
      {/* Sort */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            পণ্যের তালিকা
          </h2>

          <p className="mt-1 text-sm text-base-content/60">
            {sortedProducts.length}টি পণ্য
          </p>
        </div>

        <div>
          <label
            htmlFor="sort"
            className="mb-1 block text-sm font-medium"
          >
            পণ্য সাজান
          </label>

          <select
            id="sort"
            value={sort}
            onChange={(event) =>
              setSort(
                event.target.value as SortOption
              )
            }
            className="select select-bordered w-full sm:w-56"
          >
            <option value="default">
              ডিফল্ট
            </option>

            <option value="low">
              দাম: কম থেকে বেশি
            </option>

            <option value="high">
              দাম: বেশি থেকে কম
            </option>
          </select>
        </div>
      </div>

      {/* Products */}

      {sortedProducts.length === 0 ? (
        <div className="rounded-2xl border border-base-300 bg-base-100 px-6 py-16 text-center">
          <div className="text-6xl">
            📦
          </div>

          <h2 className="mt-5 text-2xl font-bold">
            কোনো পণ্য পাওয়া যায়নি
          </h2>

          <p className="mt-2 text-base-content/60">
            এই ক্যাটাগরিতে বর্তমানে কোনো
            পণ্য পাওয়া যাচ্ছে না।
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedProducts.map(
            (product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            )
          )}
        </div>
      )}
    </>
  );
};

export default CategoryProductList;