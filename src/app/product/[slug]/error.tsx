"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ProductErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProductError({ error, reset }: ProductErrorProps) {
  // Log the error so we can debug it later
  useEffect(() => {
    console.error("Product details error:", error);
  }, [error]);

  return (
    // Center the error message on the screen
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <section className="max-w-lg text-center">
        {/* Box icon */}
        <div className="text-5xl" aria-hidden="true">
          📦
        </div>

        {/* Main title */}
        <h1 className="mt-4 text-2xl font-bold">
          পণ্যের তথ্য লোড করা যায়নি
        </h1>

        {/* Short apology note */}
        <p className="mt-3 text-gray-600">
          দুঃখিত, পণ্যের তথ্য আনতে সমস্যা হয়েছে।
          অনুগ্রহ করে আবার চেষ্টা করুন।
        </p>

        {/* Retry button + back-home link */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            আবার চেষ্টা করুন
          </button>

          <Link
            href="/"
            className="rounded-lg border border-gray-300 px-5 py-3 hover:bg-gray-50"
          >
            হোমে ফিরে যান
          </Link>
        </div>
      </section>
    </main>
  );
}