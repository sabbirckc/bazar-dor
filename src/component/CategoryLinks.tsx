"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Category {
  slug?: string;
  title?: string;
  name?: string;
  category?: string;
  label?: string;
  topicId?: string | null;
  url?: string;
  scrapable?: boolean;
}

interface CategoryLinksProps {
  categories: Category[];
}

const CategoryLinks = ({ categories }: CategoryLinksProps) => {
  const pathname = usePathname();

  return (
    <nav className="w-full overflow-x-auto">
      <div className="flex min-w-max items-center justify-start gap-2 py-3 lg:justify-center">
        {/* Home */}
        <Link
          href="/"
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            pathname === "/"
              ? "bg-primary text-primary-content"
              : "hover:bg-base-200"
          }`}
        >
          হোম
        </Link>

        {/* Categories */}
        {categories.map((category, index) => {
          const slug =
            category.slug || category.category || category.name || "";

          const title =
            category.title ||
            category.name ||
            category.category ||
            category.label ||
            slug;

          if (!slug) {
            return null;
          }

          const href = `/category/${slug}`;

          const isActive = pathname === href;

          return (
            <Link
              key={category.slug || `${slug}-${index}`}
              href={href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-200"
              }`}
            >
              {title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default CategoryLinks;
