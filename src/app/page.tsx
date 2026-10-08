import Hero from "@/component/Hero";
import ProductSection from "@/component/ProductSection";
import { getProducts } from "@/lib/api";

const HomePage = async () => {
  const products = await getProducts();

  const risers = products
    .filter((product) => product.change > 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, 6);

  const fallers = products
    .filter((product) => product.change < 0)
    .sort((a, b) => a.change - b.change)
    .slice(0, 6);

  return (
    <main>
      <Hero />

      <ProductSection
        title="আজ দাম বেড়েছে ▲"
        description="আজ যেসব পণ্যের বাজারদর বেড়েছে"
        products={risers}
      />

      <ProductSection
        title="আজ দাম কমেছে ▼"
        description="আজ যেসব পণ্যের বাজারদর কমেছে"
        products={fallers}
      />

      <ProductSection
        id="সব-পণ্য"
        title="সব পণ্য"
        description="নিত্যপ্রয়োজনীয় সব পণ্যের বর্তমান বাজারদর এক নজরে"
        products={products}
      />
    </main>
  );
};

export default HomePage;