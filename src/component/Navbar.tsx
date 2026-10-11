"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

// A category shown in the nav bar
interface Category {
  slug: string;
  title: string;
  icon: string;
}

// A product shown in the scrolling ticker
interface TickerProduct {
  id: number;
  slug: string;
  nameBn: string;
  image?: string;
  categoryIcon?: string;
  today: number;
  unit: string;
  change?: {
    dir: "up" | "down" | "same" | "flat";
    pct: number;
  };
}

interface NavbarProps {
  tickerProducts: TickerProduct[];
}

// Fixed list of categories shown in the second row
const categories: Category[] = [
  { slug: "chal", title: "চাল", icon: "🍚" },
  { slug: "dal", title: "ডাল", icon: "🫘" },
  { slug: "tel", title: "তেল", icon: "🛢️" },
  { slug: "sobji", title: "সবজি", icon: "🥬" },
  { slug: "mach", title: "মাছ", icon: "🐟" },
  { slug: "mangsho", title: "মাংস", icon: "🍗" },
  { slug: "dim-dudh", title: "ডিম-দুধ", icon: "🥛" },
  { slug: "moshla", title: "মসলা", icon: "🌶️" },
];

// Format a number into Bengali style, or "—" if invalid
function formatPrice(value: number) {
  return Number.isFinite(value)
    ? value.toLocaleString("bn-BD", { maximumFractionDigits: 2 })
    : "—";
}

export default function Navbar({ tickerProducts }: NavbarProps) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  // UI state
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Format the date after mounting to avoid hydration mismatches.
  useEffect(() => {
    setFormattedDate(
      new Intl.DateTimeFormat("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Dhaka",
      }).format(new Date())
    );
  }, []);

  // Sign the user out and send them home
  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);

      const { error } = await authClient.signOut();

      if (error) {
        console.error("Sign out failed:", error.message);
        return;
      }

      setProfileMenuOpen(false);
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header className="relative z-40 border-b border-[#E1EAE2] bg-[#FAFCFA] text-[#26332A]">
      {/* Top row: logo + date on the left, user area on the right */}
      <div className="mx-auto flex min-h-[48px] max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Logo and today's date */}
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2"
          aria-label="বাজার দর হোম পেজ"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#07883F] text-lg text-white">
            🛒
          </span>

          <span className="min-w-0">
            <span className="block text-sm font-extrabold leading-4">
              বাজার দর
            </span>

            <span className="mt-0.5 block text-[9px] leading-3 text-[#7B857D]">
              {formattedDate || "\u00a0"}
            </span>
          </span>
        </Link>

        {/* User area: profile menu, or sign-in/sign-up, or a loader */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          {!isPending && user ? (
            <div className="relative">
              {/* Profile trigger button */}
              <button
                type="button"
                onClick={() => setProfileMenuOpen((previous) => !previous)}
                aria-expanded={profileMenuOpen}
                aria-haspopup="menu"
                className="flex max-w-[175px] items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-[#F0F5F0] sm:max-w-[210px]"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt=""
                    className="size-7 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#E4F3E8] text-sm font-bold text-[#07883F]">
                    {user.name?.trim().charAt(0) || "U"}
                  </span>
                )}

                <span className="max-w-[100px] truncate text-[10px] font-medium sm:max-w-[130px] sm:text-xs">
                  {user.name || "ব্যবহারকারী"}
                </span>

                <span aria-hidden="true" className="text-[9px] text-[#7B857D]">
                  ⌄
                </span>
              </button>

              {/* Profile dropdown */}
              {profileMenuOpen && (
                <>
                  {/* Invisible click-away layer */}
                  <button
                    type="button"
                    aria-label="মেনু বন্ধ করুন"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setProfileMenuOpen(false)}
                  />

                  <div
                    role="menu"
                    className="absolute right-0 top-full z-50 mt-2 w-[220px] rounded-xl border border-[#E1EAE2] bg-[#FAFCFA] p-2 shadow-[0_8px_24px_rgba(38,51,42,0.16)]"
                  >
                    {/* Name + email header */}
                    <div className="border-b border-[#E8EEE8] px-2.5 py-2">
                      <p className="truncate text-xs font-bold text-[#26332A]">
                        {user.name || "ব্যবহারকারী"}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-[#7B857D]">
                        {user.email}
                      </p>
                    </div>

                    {/* Link to profile page */}
                    <Link
                      href="/profile"
                      role="menuitem"
                      onClick={() => setProfileMenuOpen(false)}
                      className="mt-1 flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-[#526056] transition hover:bg-[#F0F5F0] hover:text-[#07883F]"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        className="size-3.5"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="8" r="3.5" />
                        <path d="M5 20c0-3.5 2.8-6 7-6s7 2.5 7 6" />
                      </svg>

                      আমার প্রোফাইল
                    </Link>

                    {/* Sign-out button */}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-red-500 transition hover:bg-red-50 disabled:opacity-60"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-3.5"
                        aria-hidden="true"
                      >
                        <path d="M10 17l5-5-5-5" />
                        <path d="M15 12H3" />
                        <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
                      </svg>

                      {isSigningOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : !isPending ? (
            <>
              {/* Not signed in: show sign-in + sign-up links */}
              <Link
                href="/signin"
                className="rounded-md px-2 py-2 text-xs font-semibold text-[#26332A] transition hover:text-[#07883F]"
              >
                সাইন ইন
              </Link>

              <Link
                href="/signup"
                className="rounded-md bg-[#07883F] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#066F34]"
              >
                সাইন আপ
              </Link>
            </>
          ) : (
            // Session still loading: show a small skeleton
            <div className="h-7 w-20 animate-pulse rounded-lg bg-[#E4F3E8]" />
          )}
        </div>
      </div>

      {/* Second row: category navigation */}
      <nav className="border-t border-[#E8EEE8]">
        <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 sm:gap-2 sm:px-6">
          {/* Home link */}
          <Link
            href="/"
            className="flex h-8 shrink-0 items-center gap-1 rounded-md px-2 text-[10px] font-semibold transition hover:bg-[#E4F3E8] hover:text-[#07883F] sm:text-xs"
          >
            <span aria-hidden="true">🏠</span>
            হোম
          </Link>

          {/* One link per category */}
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="flex h-8 shrink-0 items-center gap-1 rounded-md px-2 text-[10px] font-medium transition hover:bg-[#E4F3E8] hover:text-[#07883F] sm:text-xs"
            >
              <span aria-hidden="true">{category.icon}</span>
              {category.title}
            </Link>
          ))}
        </div>
      </nav>

      {/* Third row: scrolling price ticker */}
      <div className="ticker-container border-y border-[#E1EAE2]">
        {tickerProducts.length > 0 ? (
          <div className="ticker-track">
            {/* Two identical copies so the loop looks endless */}
            {[0, 1].map((copy) => (
              <div className="ticker-group" key={copy}>
                {tickerProducts.map((product, index) => {
                  const isUp = product.change?.dir === "up";
                  const isDown = product.change?.dir === "down";

                  const changeColor = isUp
                    ? "text-red-500"
                    : isDown
                      ? "text-[#07883F]"
                      : "text-[#7B857D]";

                  return (
                    <Link
                      key={`${copy}-${product.id}-${index}`}
                      href={`/product/${encodeURIComponent(product.slug)}`}
                      // Second copy is invisible to screen readers + keyboard
                      tabIndex={copy === 0 ? 0 : -1}
                      aria-hidden={copy === 1}
                      className="flex h-8 shrink-0 items-center gap-1.5 border-r border-[#E1EAE2] px-3 text-[10px] transition hover:bg-[#F0F5F0]"
                    >
                      <span aria-hidden="true">
                        {product.image || product.categoryIcon || "🛒"}
                      </span>

                      <span className="text-[#526056]">{product.nameBn}</span>

                      <span className="text-[#26332A]">
                        {formatPrice(product.today)} টাকা/{product.unit}
                      </span>

                      {/* Arrow + percent change */}
                      <span className={`font-semibold ${changeColor}`}>
                        {isUp ? "▲" : isDown ? "▼" : "—"}
                        {formatPrice(Math.abs(product.change?.pct ?? 0))}%
                      </span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          // Fallback when there's no ticker data
          <div className="flex h-8 items-center px-4 text-[10px] text-[#7B857D]">
            বাজারদরের তথ্য আপাতত পাওয়া যাচ্ছে না।
          </div>
        )}
      </div>
    </header>
  );
}