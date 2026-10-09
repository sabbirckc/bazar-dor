
import Hero from "@/component/Hero";
import ProductSection from "@/component/ProductSection";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/types/product";

const HomePage = async () => {
  const response: unknown = await fetchProducts();

  // Support either a direct array or an API response with a data array.
  const products: Product[] = Array.isArray(response)
    ? (response as Product[])
    : typeof response === "object" &&
        response !== null &&
        "data" in response &&
        Array.isArray(response.data)
      ? (response.data as Product[])
      : [];

  // Products with rising prices: highest percentage increase first.
  const risingProducts = products
    .filter((product) => product.change?.dir === "up")
    .sort(
      (a, b) =>
        (b.change?.pct ?? 0) - (a.change?.pct ?? 0)
    )
    .slice(0, 6);

  // Products with falling prices: largest percentage decrease first.
  const fallingProducts = products
    .filter((product) => product.change?.dir === "down")
    .sort(
      (a, b) =>
        (b.change?.pct ?? 0) - (a.change?.pct ?? 0)
    )
    .slice(0, 6);

  return (
    <main>
      <Hero />

      <ProductSection
        id="দাম-বেড়েছে"
        title="আজ দাম বেড়েছে ▲"
        description="যেসব পণ্যের দাম আজ বেড়েছে"
        products={risingProducts}
      />

      <ProductSection
        id="দাম-কমেছে"
        title="আজ দাম কমেছে ▼"
        description="যেসব পণ্যের দাম আজ কমেছে"
        products={fallingProducts}
      />

      <ProductSection
        id="সব-পণ্য"
        title="সব পণ্য"
        description="প্রয়োজনীয় সব পণ্যের বর্তমান বাজারদর এক জায়গায়"
        products={products}
      />
    </main>
  );
};

export default HomePage;
