export default function HomeLoading() {
  return (
    // Whole page fades in and out (pulse effect)
    <main className="mx-auto min-h-screen max-w-6xl animate-pulse px-4 py-10">
      {/* Hero section skeleton: text lines + image box */}
      <section className="grid gap-8 rounded-2xl border border-gray-200 p-6 sm:p-10 lg:grid-cols-2">
        {/* Left side: title and paragraph placeholders */}
        <div className="space-y-4">
          <div className="h-4 w-32 rounded bg-gray-200" />
          <div className="h-10 w-4/5 rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-2/3 rounded bg-gray-200" />
          <div className="h-10 w-36 rounded-lg bg-gray-200" />
        </div>

        {/* Right side: image box with a cart icon */}
        <div className="flex min-h-48 items-center justify-center rounded-2xl bg-gray-200">
          <span className="text-5xl">🛒</span>
        </div>
      </section>

      {/* Three product sections, each with a title + grid of cards */}
      {[1, 2, 3].map((section) => (
        <section key={section} className="py-10">
          {/* Section title placeholder */}
          <div className="mb-6 h-7 w-48 rounded bg-gray-200" />

          {/* Grid of 8 fake product cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="rounded-xl border border-gray-200 p-4">
                {/* Image box with a cart icon */}
                <div className="mb-4 flex h-24 items-center justify-center rounded-lg bg-gray-100">
                  <span className="text-3xl">🛒</span>
                </div>

                {/* Two lines standing in for name & price */}
                <div className="mb-3 h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-5 w-1/2 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}