
import Link from "next/link";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

const formatBengaliNumber = (
  value: number | string | null | undefined
): string => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return "—";
  }

  return numberValue.toLocaleString("bn-BD", {
    maximumFractionDigits: 2,
  });
};

const ProductCard = ({ product }: ProductCardProps) => {
  const changePercent = product.change?.pct ?? 0;

  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block h-full"
    >
      <article className="card h-full overflow-hidden border border-base-300 bg-base-100 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
        {/* Product emoji */}
        <div className="flex h-40 items-center justify-center bg-base-200 sm:h-44">
          <span className="text-6xl transition duration-200 group-hover:scale-110 sm:text-7xl">
            {product.image || product.categoryIcon || "🛒"}
          </span>
        </div>

        {/* Product information */}
        <div className="card-body p-4 sm:p-5">
          <h3 className="line-clamp-1 text-lg font-bold transition group-hover:text-primary">
            {product.nameBn}
          </h3>

          <p className="text-sm text-base-content/60">
            প্রতি {product.unit}
          </p>

          <div className="mt-3 flex items-end justify-between gap-2">
            {/* Current price */}
            <div className="min-w-0">
              <p className="text-xs text-base-content/60 sm:text-sm">
                আজকের দাম
              </p>

              <p className="mt-1 text-xl font-bold sm:text-2xl">
                {formatBengaliNumber(product.today)}{" "}
                <span className="text-xs font-normal sm:text-sm">
                  টাকা
                </span>
              </p>
            </div>

            {/* Price change */}
            <div className="shrink-0">
              {isUp ? (
                <span className="badge badge-error gap-1 text-xs">
                  ▲ {formatBengaliNumber(changePercent)}%
                </span>
              ) : isDown ? (
                <span className="badge badge-success gap-1 text-xs">
                  ▼ {formatBengaliNumber(changePercent)}%
                </span>
              ) : (
                <span className="badge badge-ghost text-xs">
                  — অপরিবর্তিত
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
