import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getProductBySlug } from "@/lib/api";
import type { Product } from "@/types/product";

interface ProductDetailsPageProps {
  params: Promise<{ slug: string }>;
}

const formatBengaliNumber = (value: number): string =>
  value.toLocaleString("bn-BD", {
    maximumFractionDigits: 2,
  });

const ProductDetailsPage = async ({ params }: ProductDetailsPageProps) => {
  const { slug } = await params;

  // Protect the product details page.
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect(`/signin?callbackURL=${encodeURIComponent(`/product/${slug}`)}`);
  }

  // Find the product by its actual API slug.
  let result: Product | null = null;

  try {
    result = (await getProductBySlug(slug)) as Product | null;
  } catch (error) {
    console.error("Failed to load product:", error);
    throw error;
  }

  if (!result) {
    notFound();
  }

  const product = result;
  const markets = product.markets ?? [];

  const marketMinimums = markets
    .map((market) => market.min)
    .filter((price) => Number.isFinite(price));

  const marketMaximums = markets
    .map((market) => market.max)
    .filter((price) => Number.isFinite(price));

  const minimumPrice =
    marketMinimums.length > 0 ? Math.min(...marketMinimums) : product.today;

  const maximumPrice =
    marketMaximums.length > 0 ? Math.max(...marketMaximums) : product.today;

  const averagePrice =
    markets.length > 0
      ? markets.reduce(
          (total, market) => total + (market.min + market.max) / 2,
          0,
        ) / markets.length
      : product.today;

  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";

  return (
    <main className="min-h-screen">
      {/* Product header */}
      <section className="border-b border-base-300 bg-base-100">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <Link
            href={product.category ? `/category/${product.category}` : "/"}
            className="btn btn-ghost btn-sm mb-8"
          >
            ← ফিরে যান
          </Link>

          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="flex min-h-56 items-center justify-center rounded-3xl bg-base-200 sm:min-h-72">
              <span className="text-7xl sm:text-8xl">
                {product.image || product.categoryIcon || "🛒"}
              </span>
            </div>

            <div>
              {product.category && (
                <Link
                  href={`/category/${product.category}`}
                  className="badge badge-primary mb-4"
                >
                  {product.categoryNameBn || product.category}
                </Link>
              )}

              <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                {product.nameBn}
              </h1>

              <p className="mt-4 text-sm text-base-content/60">
                প্রতি {product.unit}
              </p>

              <div className="mt-8">
                <p className="text-sm text-base-content/60">আজকের দাম</p>

                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <span className="text-4xl font-bold">
                    {formatBengaliNumber(product.today)}{" "}
                    <span className="text-lg font-normal">টাকা</span>
                  </span>

                  {isUp && (
                    <span className="badge badge-error">
                      ▲ {formatBengaliNumber(product.change.pct)}%
                    </span>
                  )}

                  {isDown && (
                    <span className="badge badge-success">
                      ▼ {formatBengaliNumber(product.change.pct)}%
                    </span>
                  )}

                  {!isUp && !isDown && (
                    <span className="badge badge-ghost">অপরিবর্তিত</span>
                  )}
                </div>
              </div>

              <p className="mt-3 text-sm text-base-content/60">
                গতকাল: {formatBengaliNumber(product.yesterday)} টাকা
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Price summary */}
      <section className="border-b border-base-300">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="text-2xl font-bold">বাজারদরের সারাংশ</h2>

          <p className="mt-2 text-sm text-base-content/60">
            বিভিন্ন বাজারের আজকের দামের সংক্ষিপ্ত চিত্র
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { label: "সর্বনিম্ন", value: minimumPrice },
              { label: "গড় দাম", value: averagePrice },
              { label: "সর্বোচ্চ", value: maximumPrice },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-base-300 bg-base-100 p-6"
              >
                <p className="text-sm text-base-content/60">{item.label}</p>

                <p className="mt-2 text-3xl font-bold">
                  {formatBengaliNumber(item.value)}{" "}
                  <span className="text-sm font-normal">টাকা</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market-by-market prices */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <h2 className="text-2xl font-bold sm:text-3xl">বাজারভিত্তিক দাম</h2>

        <p className="mt-2 text-base-content/60">
          বিভিন্ন বাজারে আজকের সম্ভাব্য দাম
        </p>

        {markets.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-base-300 p-10 text-center">
            <p className="text-4xl">📊</p>
            <h3 className="mt-4 text-xl font-bold">
              বাজারের তথ্য পাওয়া যায়নি
            </h3>
            <p className="mt-2 text-base-content/60">
              এই পণ্যের জন্য বর্তমানে বাজারভিত্তিক তথ্য নেই।
            </p>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-2xl border border-base-300">
            <table className="table">
              <thead>
                <tr>
                  <th>বাজার</th>
                  <th>বিভাগ</th>
                  <th>সর্বনিম্ন</th>
                  <th>সর্বোচ্চ</th>
                </tr>
              </thead>

              <tbody>
                {markets.map((market, index) => (
                  <tr key={`${market.market}-${index}`}>
                    <td className="font-semibold">{market.market}</td>
                    <td>{market.division}</td>
                    <td>{formatBengaliNumber(market.min)} টাকা</td>
                    <td>{formatBengaliNumber(market.max)} টাকা</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
};

export default ProductDetailsPage;
