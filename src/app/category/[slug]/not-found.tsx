
import Link from "next/link";

const CategoryNotFound = () => {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="max-w-lg text-center">
        <div className="text-6xl">🔎</div>

        <h1 className="mt-5 text-3xl font-bold">
          বিভাগটি পাওয়া যায়নি
        </h1>

        <p className="mt-3 text-base-content/60">
          দুঃখিত, এই বিভাগের কোনো তথ্য পাওয়া যায়নি।
          অন্য একটি বিভাগ নির্বাচন করে দেখুন।
        </p>

        <Link href="/" className="btn btn-primary mt-6">
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
};

export default CategoryNotFound;
