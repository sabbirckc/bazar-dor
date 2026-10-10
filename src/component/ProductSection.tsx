
import ProductCard from "./ProductCard";
import type { Product } from "@/types/product";

interface ProductSectionProps {
  id?: string;
  title: string;
  description?: string;
  products: Product[];
}

const ProductSection = ({
  id,
  title,
  description,
  products,
}: ProductSectionProps) => {
  if (products.length === 0) {
    return null;
  }

  const isRising = title.includes("বেড়েছে");
  const isFalling = title.includes("কমেছে");

  return (
    <section
      id={id}
      className="bg-[#F0F5F0] px-3 py-4 sm:px-6 sm:py-5 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <div className="mb-3">
          <h2 className="flex items-center gap-1.5 text-base font-bold leading-6 text-[#26332A] sm:text-lg">
            {isRising && (
              <span className="text-xs text-red-500" aria-hidden="true">
                ▲
              </span>
            )}

            {isFalling && (
              <span className="text-xs text-[#07883F]" aria-hidden="true">
                ▼
              </span>
            )}

            {title.replace(" ▲", "").replace(" ▼", "")}
          </h2>

          {description && (
            <p className="mt-0.5 text-[10px] leading-4 text-[#7B857D] sm:text-xs">
              {description}
            </p>
          )}
        </div>

        {/* Responsive product grid */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
