
const CategoryLoading = () => {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-10">
      <div className="h-10 w-56 animate-pulse rounded-lg bg-base-300" />

      <div className="mt-8 h-24 animate-pulse rounded-2xl bg-base-200" />

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div
            key={index}
            className="h-64 animate-pulse rounded-xl border border-base-300 bg-base-200"
          />
        ))}
      </div>
    </main>
  );
};

export default CategoryLoading;
