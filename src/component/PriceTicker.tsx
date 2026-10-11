// A product may come in many shapes from the API — accept them all
interface Product {
  id?: string | number;
  _id?: string;
  slug?: string;

  name?: string;
  title?: string;

  unit?: string;

  price?: number | string;
  todayPrice?: number | string;
  currentPrice?: number | string;

  change?: number | string;
  changePercent?: number | string;
  percentageChange?: number | string;
}

// Try these APIs in order until one returns data
const API_URLS = [
  "https://api.api-store.workers.dev/api/bazardor/products",
  "https://api.abcz.workers.dev/api/bazardor/products",
];

// Show numbers in Bengali style, or "০" if the value is bad
const formatBengaliNumber = (value: number | string) => {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return "০";
  }

  return number.toLocaleString("bn-BD", {
    maximumFractionDigits: 2,
  });
};

// Fetch products from the first API that works
const getProducts = async (): Promise<Product[]> => {
  for (const url of API_URLS) {
    try {
      const response = await fetch(url, {
        next: {
          revalidate: 300,
        },
      });

      if (!response.ok) {
        continue;
      }

      const result = await response.json();

      // Handle both possible response shapes
      if (Array.isArray(result.data)) {
        return result.data;
      }

      if (Array.isArray(result)) {
        return result;
      }
    } catch (error) {
      console.error("Product API error:", error);
    }
  }

  return [];
};

// One item in the scrolling ticker
const TickerItem = ({
  product,
  index,
}: {
  product: Product;
  index: number;
}) => {
  // Pick the first available field for each value
  const name = product.name || product.title || "পণ্য";

  const price = Number(
    product.todayPrice ?? product.currentPrice ?? product.price ?? 0
  );

  const change = Number(
    product.changePercent ??
      product.percentageChange ??
      product.change ??
      0
  );

  return (
    <div className="flex h-10 shrink-0 flex-row items-center border-r border-base-300 px-5 text-sm whitespace-nowrap">
      {/* Alternating emoji icon */}
      <span className="mr-2">{index % 2 === 0 ? "🥔" : "🍚"}</span>

      {/* Product name */}
      <span className="font-medium">{name}</span>

      {/* Price (and unit if available) */}
      <span className="ml-2">
        {formatBengaliNumber(price)} টাকা
        {product.unit && `/${product.unit}`}
      </span>

      {/* Price went up */}
      {change > 0 && (
        <span className="ml-2 font-semibold text-error">
          ▲ {formatBengaliNumber(change)}%
        </span>
      )}

      {/* Price went down */}
      {change < 0 && (
        <span className="ml-2 font-semibold text-success">
          ▼ {formatBengaliNumber(Math.abs(change))}%
        </span>
      )}

      {/* Price unchanged */}
      {change === 0 && (
        <span className="ml-2 text-base-content/50">—</span>
      )}
    </div>
  );
};

const PriceTicker = async () => {
  const products = await getProducts();

  // Show a short message if there's nothing to display
  if (products.length === 0) {
    return (
      <div className="ticker-container">
        <div className="flex h-10 items-center justify-center">
          বাজারদরের তথ্য পাওয়া যাচ্ছে না
        </div>
      </div>
    );
  }

  return (
    <div className="ticker-container">
      <div className="ticker-track">
        {/* First copy of the products (visible) */}
        <div className="ticker-group">
          {products.map((product, index) => (
            <TickerItem
              key={
                product.id ||
                product._id ||
                product.slug ||
                `first-${index}`
              }
              product={product}
              index={index}
            />
          ))}
        </div>

        {/* Duplicate copy so the loop looks endless (hidden from screen readers) */}
        <div className="ticker-group" aria-hidden="true">
          {products.map((product, index) => (
            <TickerItem
              key={
                product.id ||
                product._id ||
                product.slug ||
                `second-${index}`
              }
              product={product}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PriceTicker;