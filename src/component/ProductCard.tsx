
import Link from "next/link";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

function formatBengaliNumber(
  value: number | null | undefined
): string {
  if (value == null || !Number.isFinite(value)) {
    return "—";
  }

  return value.toLocaleString("bn-BD", {
    maximumFractionDigits: 2,
  });
}

const ProductCard = ({ product }: ProductCardProps) => {
  const changePercent = Number(product.change?.pct) || 0;
  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";

  const badgeClass = isUp
    ? "bg-[#FDECEC] text-[#D92D20]"
    : isDown
      ? "bg-[#E7F6EC] text-[#07883F]"
      : "bg-[#EDF1ED] text-[#6B756D]";

  return (
    <Link
      href={`/product/${encodeURIComponent(product.slug)}`}
      aria-label={`${product.nameBn} এর বিস্তারিত দেখুন`}
      className="group block h-full"
    >
      <article className="flex h-full min-h-[108px] flex-col justify-between rounded-xl border border-[#E2EAE3] bg-[#FAFCFA] p-3 transition-colors hover:border-[#B7D9C0] sm:min-h-[116px] sm:p-3.5">
        {/* Product name and unit */}
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#F0F5F0] text-xl sm:size-11 sm:text-2xl">
            <span aria-hidden="true">
              {product.image || product.categoryIcon || "🛒"}
            </span>
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold leading-5 text-[#26332A] group-hover:text-[#07883F] sm:text-base">
              {product.nameBn}
            </h3>

            <p className="text-[10px] text-[#7B857D] sm:text-xs">
              প্রতি {product.unit}
            </p>
          </div>
        </div>

        {/* Price and change */}
        <div className="mt-3 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] text-[#7B857D]">
              আজকের দাম
            </p>

            <p className="mt-0.5 text-sm font-extrabold leading-5 text-[#26332A] sm:text-base">
              {formatBengaliNumber(product.today)}{" "}
              <span className="text-[10px] font-normal sm:text-xs">
                টাকা
              </span>
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-semibold sm:text-[10px] ${badgeClass}`}
            aria-label={
              isUp
                ? `দাম বেড়েছে ${formatBengaliNumber(Math.abs(changePercent))}%`
                : isDown
                  ? `দাম কমেছে ${formatBengaliNumber(Math.abs(changePercent))}%`
                  : "দামের পরিবর্তন নেই"
            }
          >
            {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
            {formatBengaliNumber(Math.abs(changePercent))}%
          </span>
        </div>
      </article>
    </Link>
  );
};

export default ProductCard;
