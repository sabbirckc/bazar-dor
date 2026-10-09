
import Hero from "@/component/Hero";
import ProductSection from "@/component/ProductSection";
import { fetchProducts } from "@/lib/api";

const HomePage = async () => {
  const products = await fetchProducts();

  return (
    <main>
      <Hero />
      <ProductSection products={products.data ?? products} />
    </main>
  );
};

export default HomePage;
