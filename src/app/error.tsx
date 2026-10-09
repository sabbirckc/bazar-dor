
"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({
  error,
  reset,
}: ErrorPageProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <section className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="text-5xl" aria-hidden="true">
          😕
        </div>

        <h1 className="mt-5 text-2xl font-bold text-gray-900">
          কিছু একটা সমস্যা হয়েছে
        </h1>

        <p className="mt-3 text-gray-600">
          দুঃখিত, পেজটি লোড করার সময় সমস্যা হয়েছে।
          আবার চেষ্টা করুন।
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            আবার চেষ্টা করুন
          </button>

          <a
            href="/"
            className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            হোমে ফিরে যান
          </a>
        </div>
      </section>
    </main>
  );
}
