import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProductBySlug } from "@/lib/api";
import type { Product, Market } from "@/types/product";

// Format a number into Bengali currency style, or show "—" if invalid
function money(value: number): string {
  return Number.isFinite(value)
    ? value.toLocaleString("bn-BD", { maximumFractionDigits: 2 })
    : "—";
}

// Work out min, max, and average prices across all markets
function calculateStats(markets: Market[]) {
  // Skip markets with broken min/max values
  const validMarkets = markets.filter(
    (market) => Number.isFinite(market.min) && Number.isFinite(market.max)
  );

  // Nothing valid to work with
  if (validMarkets.length === 0) {
    return { min: null, max: null, average: null };
  }

  const min = Math.min(...validMarkets.map((market) => market.min));
  const max = Math.max(...validMarkets.map((market) => market.max));

  const average =
    validMarkets.reduce(
      (total, market) => total + (market.min + market.max) / 2,
      0
    ) / validMarkets.length;

  return { min, max, average };
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Make sure the user is signed in
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin");
  }

  let product: Product | null;

  // Load the product; if it fails, show the 404 page
  try {
    product = (await getProductBySlug(slug)) as Product | null;
  } catch (error) {
    console.error("Failed to load product:", error);
    notFound();
  }

  if (!product) notFound();

  const markets = Array.isArray(product.markets) ? product.markets : [];
  const stats = calculateStats(markets);

  // Figure out price trend direction and colors
  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";

  const changeColor = isUp
    ? "text-red-600"
    : isDown
      ? "text-[#07883F]"
      : "text-[#7B857D]";

  const changeArrow = isUp ? "▲" : isDown ? "▼" : "—";

  return (
    <main className="flex min-h-[calc(100vh-190px)] flex-col bg-[#F0F5F0] text-[#26332A]">
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 pb-8 pt-4 sm:px-6 sm:pt-5">
        {/* Breadcrumb: Home / Category / Product */}
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex flex-wrap items-center gap-2 text-[10px] text-[#68736A] sm:text-xs"
        >
          <Link href="/" className="hover:text-[#07883F]">
            হোম
          </Link>
          <span>/</span>
          <Link
            href={`/category/${encodeURIComponent(product.category)}`}
            className="hover:text-[#07883F]"
          >
            {product.categoryNameBn || product.category}
          </Link>
          <span>/</span>
          <span className="truncate">{product.nameBn}</span>
        </nav>

        {/* Product summary card: icon, name, yesterday & today price */}
        <section className="flex items-center gap-3 rounded-xl border border-[#E1EAE2] bg-[#FAFCFA] p-3 sm:gap-4 sm:p-4">
          {/* Product icon */}
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#F0F5F0] text-2xl sm:size-14 sm:text-3xl">
            <span aria-hidden="true">
              {product.image || product.categoryIcon || "🛒"}
            </span>
          </div>

          {/* Name and basic info */}
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-extrabold sm:text-lg">
              {product.nameBn}
            </h1>
            <p className="mt-0.5 text-[10px] text-[#7B857D] sm:text-xs">
              প্রতি {product.unit} · {product.categoryNameBn || product.category}
            </p>
            <p className="mt-1 text-[10px] text-[#68736A]">
              গতকালের দাম: {money(product.yesterday)} টাকা
            </p>
          </div>

          {/* Today's price box */}
          <div className="shrink-0 rounded-lg bg-[#F0F5F0] px-3 py-2 text-center sm:px-4">
            <p className="text-[9px] text-[#7B857D]">আজকের দাম</p>
            <p className="text-lg font-extrabold leading-6 sm:text-xl">
              {money(product.today)}
            </p>
            <p className="text-[9px] text-[#68736A]">
              টাকা / {product.unit}
            </p>
            {/* Price change % with arrow */}
            <p className={`mt-0.5 text-[9px] font-semibold ${changeColor}`}>
              {changeArrow} {money(Math.abs(product.change?.pct ?? 0))}%
            </p>
          </div>
        </section>

        {/* Combined card: stats summary + market table */}
        <section className="mt-3 rounded-xl border border-[#E1EAE2] bg-[#FAFCFA] p-3 sm:p-4">
          <h2 className="text-xs font-bold sm:text-sm">দামের সারসংক্ষেপ</h2>

          {/* Three stat boxes: min, max, average */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            {/* Lowest price */}
            <div className="rounded-lg border border-[#E5ECE6] bg-[#FAFCFA] p-2.5 sm:p-3">
              <p className="text-[9px] text-[#68736A] sm:text-[10px]">
                সর্বনিম্ন দাম
              </p>
              <p className="mt-1 text-sm font-extrabold text-[#07883F] sm:text-base">
                {stats.min === null ? "—" : money(stats.min)}
                <span className="ml-1 text-[9px] font-normal">টাকা</span>
              </p>
              <p className="mt-1 text-[8px] text-[#7B857D] sm:text-[9px]">
                বাজারের সর্বনিম্ন দর
              </p>
            </div>

            {/* Highest price */}
            <div className="rounded-lg border border-[#E5ECE6] bg-[#FAFCFA] p-2.5 sm:p-3">
              <p className="text-[9px] text-[#68736A] sm:text-[10px]">
                সর্বোচ্চ দাম
              </p>
              <p className="mt-1 text-sm font-extrabold text-red-600 sm:text-base">
                {stats.max === null ? "—" : money(stats.max)}
                <span className="ml-1 text-[9px] font-normal">টাকা</span>
              </p>
              <p className="mt-1 text-[8px] text-[#7B857D] sm:text-[9px]">
                বাজারের সর্বোচ্চ দর
              </p>
            </div>

            {/* Average price */}
            <div className="rounded-lg border border-[#E5ECE6] bg-[#FAFCFA] p-2.5 sm:p-3">
              <p className="text-[9px] text-[#68736A] sm:text-[10px]">
                গড় দাম
              </p>
              <p className="mt-1 text-sm font-extrabold text-[#07883F] sm:text-base">
                {stats.average === null ? "—" : money(stats.average)}
                <span className="ml-1 text-[9px] font-normal">টাকা</span>
              </p>
              <p className="mt-1 text-[8px] text-[#7B857D] sm:text-[9px]">
                প্রতি বাজারের গড়
              </p>
            </div>
          </div>

          {/* Market-by-market table */}
          <h2 className="mt-5 text-xs font-bold sm:text-sm">
            বাজারভিত্তিক আজকের দাম
          </h2>

          {markets.length > 0 ? (
            <div className="mt-2 overflow-x-auto rounded-lg border border-[#E1EAE2]">
              <table className="w-full min-w-[500px] border-collapse text-left text-[9px] sm:text-[10px]">
                <thead className="bg-[#F5F8F5]">
                  <tr className="border-b border-[#DCE5DD]">
                    <th className="px-2 py-2 font-semibold sm:px-3">বাজার</th>
                    <th className="px-2 py-2 font-semibold sm:px-3">বিভাগ</th>
                    <th className="px-2 py-2 text-right font-semibold sm:px-3">
                      সর্বনিম্ন
                    </th>
                    <th className="px-2 py-2 text-right font-semibold sm:px-3">
                      সর্বোচ্চ
                    </th>
                    <th className="px-2 py-2 text-right font-semibold sm:px-3">
                      গড়
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {/* Zebra-striped rows for readability */}
                  {markets.map((market, index) => (
                    <tr
                      key={`${market.market}-${market.division}-${index}`}
                      className={`border-b border-[#E1EAE2] last:border-b-0 ${
                        index % 2 === 1 ? "bg-[#F0F5F0]" : "bg-[#FAFCFA]"
                      }`}
                    >
                      <td className="px-2 py-2 sm:px-3">{market.market}</td>
                      <td className="px-2 py-2 sm:px-3">{market.division}</td>
                      <td className="px-2 py-2 text-right sm:px-3">
                        {money(market.min)} টাকা
                      </td>
                      <td className="px-2 py-2 text-right sm:px-3">
                        {money(market.max)} টাকা
                      </td>
                      <td className="px-2 py-2 text-right sm:px-3">
                        {money((market.min + market.max) / 2)} টাকা
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // Friendly message when no market data exists
            <p className="mt-3 rounded-lg bg-[#F0F5F0] p-4 text-xs text-[#7B857D]">
              এই পণ্যের বাজারভিত্তিক দামের তথ্য বর্তমানে পাওয়া যায়নি।
            </p>
          )}
        </section>
      </div>
    </main>
  );
}