import Link from "next/link";
import CategoryLinks from "./CategoryLinks";
import UserInfo from "./UserInfo";
import PriceTicker from "./PriceTicker";

interface Category {
  slug: string;
  title: string;
  topicId?: string | null;
  url?: string;
  scrapable?: boolean;
}

const Navbar = async () => {
  let categories: Category[] = [];

  const apiUrls = [
    "https://api.api-store.workers.dev/api/bazardor/categories",
    "https://api.abcz.workers.dev/api/bazardor/categories",
  ];

  for (const url of apiUrls) {
    try {
      const response = await fetch(url, {
        next: {
          revalidate: 3600,
        },
      });

      if (!response.ok) {
        console.error(`Category API failed: ${url}`, response.status);
        continue;
      }

      const result = await response.json();

      console.log("Category API response:", result);

      // Handle { data: [...] }
      if (Array.isArray(result.data)) {
        categories = result.data;
      }

      // Handle direct [...]
      else if (Array.isArray(result)) {
        categories = result;
      }

      // Stop when we successfully get categories
      if (categories.length > 0) {
        break;
      }
    } catch (error) {
      console.error(`Category fetch error from ${url}:`, error);
    }
  }

  console.log("Final categories:", categories);

  const today = new Intl.DateTimeFormat("bn-BD", {
    timeZone: "Asia/Dhaka",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="border-b border-base-300 bg-base-100">
      <div className="mx-auto max-w-6xl px-4">
        {/* Top Row */}
        <div className="flex min-h-24 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="text-4xl">🛒</div>

            <div>
              <h1 className="text-2xl font-bold leading-tight">বাজার দর</h1>

              <p className="text-sm text-base-content/60">{today}</p>
            </div>
          </Link>

          {/* User */}
          <UserInfo />
        </div>

        {/* Category Row */}
        {/* Category Row */}
        <div className="border-t border-base-300">
          <CategoryLinks categories={categories} />
        </div>

        {/* Price Ticker */}
        <PriceTicker />
      </div>
    </header>
  );
};

export default Navbar;
