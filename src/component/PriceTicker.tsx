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

const API_URLS = [
  "https://api.api-store.workers.dev/api/bazardor/products",
  "https://api.abcz.workers.dev/api/bazardor/products",
];

const formatBengaliNumber = (value: number | string) => {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return "০";
  }

  return number.toLocaleString("bn-BD", {
    maximumFractionDigits: 2,
  });
};

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

const TickerItem = ({
  product,
  index,
}: {
  product: Product;
  index: number;
}) => {
  const name =
    product.name ||
    product.title ||
    "পণ্য";

  const price = Number(
    product.todayPrice ??
      product.currentPrice ??
      product.price ??
      0
  );

  const change = Number(
    product.changePercent ??
      product.percentageChange ??
      product.change ??
      0
  );

  return (
    <div className="flex h-10 shrink-0 flex-row items-center border-r border-base-300 px-5 text-sm whitespace-nowrap">
      <span className="mr-2">
        {index % 2 === 0 ? "🥔" : "🍚"}
      </span>

      <span className="font-medium">
        {name}
      </span>

      <span className="ml-2">
        {formatBengaliNumber(price)} টাকা
        {product.unit && `/${product.unit}`}
      </span>

      {change > 0 && (
        <span className="ml-2 font-semibold text-error">
          ▲ {formatBengaliNumber(change)}%
        </span>
      )}

      {change < 0 && (
        <span className="ml-2 font-semibold text-success">
          ▼ {formatBengaliNumber(Math.abs(change))}%
        </span>
      )}

      {change === 0 && (
        <span className="ml-2 text-base-content/50">
          —
        </span>
      )}
    </div>
  );
};

const PriceTicker = async () => {
  const products = await getProducts();

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

        {/* First group */}
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

        {/* Duplicate group */}
        <div
          className="ticker-group"
          aria-hidden="true"
        >
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