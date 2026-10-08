import Link from "next/link";
import { headers } from "next/headers";
import {
  notFound,
  redirect,
} from "next/navigation";

import { auth } from "@/lib/auth";
import { getProductBySlug } from "@/lib/api";

interface ProductDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const formatBengaliNumber = (
  value: number
) => {
  return value.toLocaleString("bn-BD", {
    maximumFractionDigits: 2,
  });
};

const ProductDetailsPage = async ({
  params,
}: ProductDetailsPageProps) => {
  const { slug } = await params;

  /* =====================================================
     CHECK USER SESSION
  ===================================================== */

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect(
      `/signin?callbackURL=/product/${encodeURIComponent(
        slug
      )}`
    );
  }

  /* =====================================================
     GET PRODUCT
  ===================================================== */

  const product = await getProductBySlug(slug);

  /*
   * If the product does not exist,
   * show the global 404 page.
   */
  if (!product) {
    notFound();
  }

  /* =====================================================
     MARKET DATA
  ===================================================== */

  const markets = product.markets ?? [];

  const minimumPrice =
    markets.length > 0
      ? Math.min(
          ...markets.map(
            (market) => market.min
          )
        )
      : product.price;

  const maximumPrice =
    markets.length > 0
      ? Math.max(
          ...markets.map(
            (market) => market.max
          )
        )
      : product.price;

  const averagePrice =
    markets.length > 0
      ? markets.reduce(
          (total, market) =>
            total +
            (market.min + market.max) / 2,
          0
        ) / markets.length
      : product.price;

  /* =====================================================
     PRICE CHANGE
  ===================================================== */

  const isUp = product.change > 0;
  const isDown = product.change < 0;

  /* =====================================================
     UI
  ===================================================== */

  return (
    <main className="min-h-screen">
      {/* =================================================
          PRODUCT HEADER
      ================================================= */}

      <section className="border-b border-base-300 bg-base-100">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          {/* Back button */}

          <Link
            href={
              product.category
                ? `/category/${product.category}`
                : "/"
            }
            className="btn btn-ghost btn-sm mb-8"
          >
            ← ফিরে যান
          </Link>

          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* Product illustration */}

            <div className="flex min-h-80 items-center justify-center rounded-3xl bg-base-200">
              <span className="text-[10rem]">
                {product.emoji || "🛒"}
              </span>
            </div>

            {/* Product information */}

            <div>
              {/* Category */}

              {product.category && (
                <Link
                  href={`/category/${product.category}`}
                  className="badge badge-primary mb-4"
                >
                  {product.categoryName ||
                    product.category}
                </Link>
              )}

              {/* Product name */}

              <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                {product.name}
              </h1>

              {/* Description */}

              {product.description && (
                <p className="mt-4 text-base leading-7 text-base-content/60">
                  {product.description}
                </p>
              )}

              {/* Unit */}

              <p className="mt-4 text-sm text-base-content/60">
                প্রতি {product.unit}
              </p>

              {/* Today's price */}

              <div className="mt-8">
                <p className="text-sm text-base-content/60">
                  আজকের দাম
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <span className="text-4xl font-bold">
                    {formatBengaliNumber(
                      product.price
                    )}{" "}
                    <span className="text-lg font-normal">
                      টাকা
                    </span>
                  </span>

                  {/* Price increased */}

                  {isUp && (
                    <span className="badge badge-error gap-1">
                      ▲{" "}
                      {formatBengaliNumber(
                        Math.abs(
                          product.change
                        )
                      )}
                      %
                    </span>
                  )}

                  {/* Price decreased */}

                  {isDown && (
                    <span className="badge badge-success gap-1">
                      ▼{" "}
                      {formatBengaliNumber(
                        Math.abs(
                          product.change
                        )
                      )}
                      %
                    </span>
                  )}

                  {/* Price unchanged */}

                  {!isUp &&
                    !isDown && (
                      <span className="badge badge-ghost">
                        অপরিবর্তিত
                      </span>
                    )}
                </div>
              </div>

              {/* Yesterday's price */}

              {product.previousPrice !==
                undefined && (
                <p className="mt-2 text-sm text-base-content/50">
                  গতকাল:{" "}
                  {formatBengaliNumber(
                    product.previousPrice
                  )}{" "}
                  টাকা
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          PRICE SUMMARY
      ================================================= */}

      <section className="border-b border-base-300">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="text-2xl font-bold">
            বাজারদরের সারাংশ
          </h2>

          <p className="mt-2 text-sm text-base-content/60">
            বিভিন্ন বাজারের আজকের দামের সংক্ষিপ্ত চিত্র
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {/* Minimum */}

            <div className="rounded-2xl border border-base-300 bg-base-100 p-6">
              <p className="text-sm text-base-content/60">
                সর্বনিম্ন
              </p>

              <p className="mt-2 text-3xl font-bold">
                {formatBengaliNumber(
                  minimumPrice
                )}{" "}
                <span className="text-sm font-normal">
                  টাকা
                </span>
              </p>
            </div>

            {/* Average */}

            <div className="rounded-2xl border border-base-300 bg-base-100 p-6">
              <p className="text-sm text-base-content/60">
                গড় দাম
              </p>

              <p className="mt-2 text-3xl font-bold">
                {formatBengaliNumber(
                  averagePrice
                )}{" "}
                <span className="text-sm font-normal">
                  টাকা
                </span>
              </p>
            </div>

            {/* Maximum */}

            <div className="rounded-2xl border border-base-300 bg-base-100 p-6">
              <p className="text-sm text-base-content/60">
                সর্বোচ্চ
              </p>

              <p className="mt-2 text-3xl font-bold">
                {formatBengaliNumber(
                  maximumPrice
                )}{" "}
                <span className="text-sm font-normal">
                  টাকা
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          MARKET-BY-MARKET PRICES
      ================================================= */}

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">
            বাজারভিত্তিক দাম
          </h2>

          <p className="mt-2 text-base-content/60">
            বিভিন্ন বাজারে আজকের সম্ভাব্য দাম
          </p>
        </div>

        {/* No market data */}

        {markets.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-base-300 bg-base-100 p-10 text-center">
            <div className="text-5xl">
              📊
            </div>

            <h3 className="mt-4 text-xl font-bold">
              বাজারের তথ্য পাওয়া যায়নি
            </h3>

            <p className="mt-2 text-base-content/60">
              এই পণ্যের জন্য বর্তমানে
              বাজারভিত্তিক তথ্য নেই।
            </p>
          </div>
        ) : (
          /* Market table */

          <div className="mt-8 overflow-hidden rounded-2xl border border-base-300">
            <div className="overflow-x-auto">
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
                  {markets.map(
                    (market, index) => (
                      <tr
                        key={`${market.market}-${index}`}
                      >
                        <td className="font-semibold">
                          {market.market}
                        </td>

                        <td>
                          {market.division}
                        </td>

                        <td>
                          {formatBengaliNumber(
                            market.min
                          )}{" "}
                          টাকা
                        </td>

                        <td>
                          {formatBengaliNumber(
                            market.max
                          )}{" "}
                          টাকা
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default ProductDetailsPage;