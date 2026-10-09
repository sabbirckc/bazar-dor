"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const categories = [
{ slug: "chal", name: "chal" },
{ slug: "dal", name: "dal" },
{ slug: "tel", name: "tel" },
{ slug: "sobji", name: "sobji" },
{ slug: "mach", name: "mach" },
{ slug: "mangsho", name: "mangsho" },
{ slug: "dim-dui", name: "dim-dui" },
{ slug: "mosla", name: "mosla" },
];

const tickerItems = [
{ emoji: "🥚", name: "ডিম", price: "০ টাকা", unit: "/dozen" },
{ emoji: "🥔", name: "আলু", price: "০ টাকা", unit: "/kg" },
{ emoji: "🍚", name: "চাল", price: "০ টাকা", unit: "/kg" },
{ emoji: "🛢️", name: "তেল", price: "০ টাকা", unit: "/litre" },
{ emoji: "🐟", name: "মাছ", price: "০ টাকা", unit: "/kg" },
{ emoji: "🥬", name: "সবজি", price: "০ টাকা", unit: "/kg" },
];

const Navbar = () => {
const pathname = usePathname();
const router = useRouter();

const { data: session, isPending } = authClient.useSession();

const [formattedDate, setFormattedDate] = useState("");
const [isSigningOut, setIsSigningOut] = useState(false);
const [menuOpen, setMenuOpen] = useState(false);

const user = session?.user;

useEffect(() => {
setFormattedDate(
new Intl.DateTimeFormat("bn-BD", {
weekday: "long",
day: "numeric",
month: "long",
year: "numeric",
timeZone: "Asia/Dhaka",
}).format(new Date()),
);
}, []);

useEffect(() => {
setMenuOpen(false);
}, [pathname]);

const handleSignOut = async () => {
try {
setIsSigningOut(true);

  const { error } = await authClient.signOut();

  if (error) {
    console.error("Sign out failed:", error);
    return;
  }

  router.replace("/signin");
  router.refresh();
} catch (error) {
  console.error("Sign out failed:", error);
} finally {
  setIsSigningOut(false);
}

};

return (
<header className="border-b border-gray-300 bg-[#f1f7f2] text-[#172b40]">
<div className="mx-auto max-w-6xl px-4">
{/* Top row: logo, date and account */}
<div className="flex min-h-20 flex-wrap items-center justify-between gap-4 border-b border-gray-300 py-3">
<Link href="/" className="flex items-center gap-3">
<span className="text-4xl" aria-hidden="true">
🛒
</span>

        <span>
          <span className="block text-2xl font-bold leading-tight">
            বাজার দর
          </span>

          <span className="block text-sm text-gray-600">
            {formattedDate || "\u00a0"}
          </span>
        </span>
      </Link>

      <div className="flex items-center gap-3 sm:gap-5">
        {!isPending && user ? (
          <>
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-gray-100"
            >
              <span aria-hidden="true">👤</span>
              <span className="max-w-36 truncate text-sm font-medium">
                {user.name || user.email}
              </span>
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="text-sm font-medium transition hover:text-red-600 disabled:opacity-50"
            >
              {isSigningOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
            </button>
          </>
        ) : !isPending ? (
          <>
            <Link
              href="/signin"
              className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100"
            >
              সাইন ইন
            </Link>

            <Link
              href="/signup"
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              সাইন আপ
            </Link>
          </>
        ) : (
          <span className="text-sm text-gray-500">
            লোড হচ্ছে...
          </span>
        )}
      </div>
    </div>

    {/* Category navigation */}
    <nav
      aria-label="পণ্যের বিভাগ"
      className="relative border-b border-gray-300"
    >
      <button
        type="button"
        className="my-3 rounded-md border border-gray-300 px-3 py-2 text-sm md:hidden"
        onClick={() => setMenuOpen((open) => !open)}
        aria-expanded={menuOpen}
        aria-label="বিভাগের মেনু"
      >
        ☰ বিভাগ
      </button>

      <div
        className={`${menuOpen ? "flex" : "hidden"} flex-col gap-1 py-2 md:flex md:flex-row md:items-center md:justify-between md:gap-2`}
      >
        <Link
          href="/"
          className={`rounded-md px-3 py-3 text-sm transition hover:bg-gray-100 ${
            pathname === "/" ? "font-bold text-blue-700" : ""
          }`}
        >
          হোম
        </Link>

        {categories.map((category) => {
          const active = pathname === `/category/${category.slug}`;

          return (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className={`rounded-md px-3 py-3 text-sm transition hover:bg-gray-100 ${
                active ? "font-bold text-blue-700" : ""
              }`}
            >
              {category.name}
            </Link>
          );
        })}
      </div>
    </nav>

    {/* Price ticker */}
    <div
      className="overflow-hidden"
      aria-label="পণ্যের দামের টিকার"
    >
      <div className="flex w-max animate-[ticker_30s_linear_infinite] hover:[animation-play-state:paused]">
        {[...tickerItems, ...tickerItems].map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="flex min-h-10 shrink-0 items-center gap-2 border-r border-gray-300 px-5 text-sm text-gray-700"
          >
            <span aria-hidden="true">{item.emoji}</span>
            <span className="whitespace-nowrap">
              {item.name} {item.price}{item.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
</header>

);
};

export default Navbar;