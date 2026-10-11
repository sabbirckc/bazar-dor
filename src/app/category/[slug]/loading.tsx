export default function CategoryLoading() {
  return (
    // Whole page fades in and out (pulse effect)
    <main className="mx-auto min-h-[60vh] max-w-6xl animate-pulse px-4 py-10">
      {/* Header skeleton: title + subtitle placeholders */}
      <div className="mb-8">
        <div className="h-8 w-56 rounded bg-gray-200" />
        <div className="mt-3 h-4 w-72 max-w-full rounded bg-gray-200" />
      </div>

      {/* Filter / sort bar placeholder */}
      <div className="mb-6 h-10 w-48 rounded-lg bg-gray-200" />

      {/* Product grid skeleton */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {/* Render 8 fake cards */}
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-gray-200 p-4">
            {/* Image box with a cart icon inside */}
            <div className="mb-4 flex h-28 items-center justify-center rounded-lg bg-gray-100">
              <span className="text-3xl">🛒</span>
            </div>

            {/* Two lines that stand in for product name & price */}
            <div className="mb-3 h-4 w-3/4 rounded bg-gray-200" />
            <div className="h-5 w-1/2 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </main>
  );
}