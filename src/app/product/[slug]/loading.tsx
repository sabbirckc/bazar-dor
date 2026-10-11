export default function ProductLoading() {
  return (
    // Whole page fades in and out (pulse effect)
    <main className="mx-auto min-h-screen max-w-6xl animate-pulse px-4 py-10">
      {/* Breadcrumb placeholder */}
      <div className="mb-8 h-5 w-28 rounded bg-gray-200" />

      {/* Top section: image box + product info skeleton */}
      <section className="grid gap-10 border-b border-gray-200 py-8 lg:grid-cols-2">
        {/* Image box with a cart icon inside */}
        <div className="flex min-h-64 items-center justify-center rounded-2xl bg-gray-200">
          <span className="text-6xl">🛒</span>
        </div>

        {/* Right side: title, price, and button placeholders */}
        <div className="space-y-5 py-4">
          <div className="h-5 w-20 rounded bg-gray-200" />
          <div className="h-10 w-4/5 rounded bg-gray-200" />
          <div className="h-4 w-28 rounded bg-gray-200" />
          <div className="mt-8 h-4 w-24 rounded bg-gray-200" />
          <div className="h-10 w-48 rounded bg-gray-200" />
          <div className="h-4 w-36 rounded bg-gray-200" />
        </div>
      </section>

      {/* Price table skeleton */}
      <section className="py-10">
        <div className="mb-6 h-7 w-52 rounded bg-gray-200" />

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Three placeholder price cards */}
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-gray-200 p-6">
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="mt-4 h-8 w-32 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </section>

      {/* Chart / description block skeleton */}
      <section className="py-8">
        <div className="mb-6 h-7 w-56 rounded bg-gray-200" />
        <div className="h-48 rounded-xl bg-gray-100" />
      </section>
    </main>
  );
}