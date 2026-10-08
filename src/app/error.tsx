"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

const ErrorPage = ({
  error,
  reset,
}: ErrorPageProps) => {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl text-center">
        <div className="text-7xl">😕</div>

        <h1 className="mt-6 text-3xl font-bold sm:text-4xl">
          কিছু একটা সমস্যা হয়েছে
        </h1>

        <p className="mx-auto mt-3 max-w-lg text-base-content/60">
          দুঃখিত, পেজটি লোড করার সময় একটি সমস্যা হয়েছে।
          আবার চেষ্টা করুন।
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="btn btn-primary"
          >
            আবার চেষ্টা করুন
          </button>

          <Link
            href="/"
            className="btn btn-outline"
          >
            ← হোম পেজে যান
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ErrorPage;