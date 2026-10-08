const CategoryLoading = () => {
  return (
    <main className="min-h-screen">
      <section className="border-b border-base-300">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex items-center gap-4">
            <div className="skeleton h-16 w-16 rounded-2xl" />

            <div>
              <div className="skeleton h-8 w-40" />

              <div className="skeleton mt-2 h-4 w-24" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="skeleton h-8 w-48" />
            <div className="skeleton mt-2 h-4 w-32" />
          </div>

          <div className="skeleton h-12 w-56" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map(
            (_, index) => (
              <div
                key={index}
                className="card border border-base-300 bg-base-100"
              >
                <div className="skeleton h-44 w-full rounded-none" />

                <div className="card-body">
                  <div className="skeleton h-5 w-32" />

                  <div className="skeleton h-4 w-20" />

                  <div className="skeleton mt-4 h-8 w-28" />
                </div>
              </div>
            )
          )}
        </div>
      </section>
    </main>
  );
};

export default CategoryLoading;