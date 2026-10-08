import ProductCard from "./ProductCard";
import { Product } from "@/types/product";

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

  return (
    <section
      id={id}
      className="border-b border-base-300 py-12 sm:py-16"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold sm:text-3xl">
            {title}
          </h2>

          {description && (
            <p className="mt-2 text-sm text-base-content/60 sm:text-base">
              {description}
            </p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;