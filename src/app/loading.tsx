const HomeLoading = () => {
  return (
    <main className="min-h-screen">
      {/* Hero Skeleton */}
      <section className="border-b border-base-300">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* Text */}
            <div>
              <div className="skeleton h-5 w-32" />

              <div className="skeleton mt-5 h-12 w-full max-w-xl" />
              <div className="skeleton mt-3 h-12 w-4/5 max-w-lg" />

              <div className="skeleton mt-6 h-6 w-full max-w-xl" />
              <div className="skeleton mt-2 h-6 w-4/5 max-w-lg" />

              <div className="skeleton mt-8 h-12 w-48" />
            </div>

            {/* Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="skeleton aspect-square w-full max-w-md rounded-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Product Sections */}
      {Array.from({ length: 3 }).map((_, sectionIndex) => (
        <section
          key={sectionIndex}
          className="border-b border-base-300 py-12 sm:py-16"
        >
          <div className="mx-auto max-w-6xl px-4">
            {/* Section heading */}
            <div className="mb-8">
              <div className="skeleton h-8 w-56" />
              <div className="skeleton mt-2 h-4 w-72" />
            </div>

            {/* Product cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map(
                (_, cardIndex) => (
                  <div
                    key={cardIndex}
                    className="card border border-base-300 bg-base-100"
                  >
                    <div className="skeleton h-44 w-full rounded-none" />

                    <div className="card-body">
                      <div className="skeleton h-5 w-32" />

                      <div className="skeleton h-4 w-20" />

                      <div className="skeleton mt-4 h-8 w-28" />

                      <div className="skeleton mt-2 h-5 w-16" />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      ))}
    </main>
  );
};

export default HomeLoading;