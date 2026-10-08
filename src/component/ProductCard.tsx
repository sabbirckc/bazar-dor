import Link from "next/link";

import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

const formatBengaliNumber = (
  value: number
) => {
  return value.toLocaleString("bn-BD", {
    maximumFractionDigits: 2,
  });
};

const ProductCard = ({
  product,
}: ProductCardProps) => {
  const change = product.change;

  const isUp = change > 0;
  const isDown = change < 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block h-full"
    >
      <article className="card h-full overflow-hidden border border-base-300 bg-base-100 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
        {/* Product image / emoji */}

        <div className="flex h-40 items-center justify-center bg-base-200 sm:h-44">
          <span className="text-6xl transition duration-200 group-hover:scale-110 sm:text-7xl">
            {product.emoji || "🛒"}
          </span>
        </div>

        {/* Content */}

        <div className="card-body p-4 sm:p-5">
          <h3 className="line-clamp-1 text-lg font-bold transition group-hover:text-primary">
            {product.name}
          </h3>

          <p className="text-sm text-base-content/60">
            প্রতি {product.unit}
          </p>

          <div className="mt-3 flex items-end justify-between gap-2">
            {/* Price */}

            <div className="min-w-0">
              <p className="text-xs text-base-content/60 sm:text-sm">
                আজকের দাম
              </p>

              <p className="mt-1 text-xl font-bold sm:text-2xl">
                {formatBengaliNumber(
                  product.price
                )}{" "}
                <span className="text-xs font-normal sm:text-sm">
                  টাকা
                </span>
              </p>
            </div>

            {/* Change */}

            <div className="shrink-0">
              {isUp && (
                <span className="badge badge-error gap-1 text-xs">
                  ▲{" "}
                  {formatBengaliNumber(
                    Math.abs(change)
                  )}
                  %
                </span>
              )}

              {isDown && (
                <span className="badge badge-success gap-1 text-xs">
                  ▼{" "}
                  {formatBengaliNumber(
                    Math.abs(change)
                  )}
                  %
                </span>
              )}

              {!isUp && !isDown && (
                <span className="badge badge-ghost">
                  —
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ProductCard;