
export default function CategoryLoading() {
  return (
    <main className="mx-auto min-h-[60vh] max-w-6xl animate-pulse px-4 py-10">
      <div className="mb-8">
        <div className="h-8 w-56 rounded bg-gray-200" />
        <div className="mt-3 h-4 w-72 max-w-full rounded bg-gray-200" />
      </div>

      <div className="mb-6 h-10 w-48 rounded-lg bg-gray-200" />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-200 p-4"
          >
            <div className="mb-4 flex h-28 items-center justify-center rounded-lg bg-gray-100">
              <span className="text-3xl">🛒</span>
            </div>
            <div className="mb-3 h-4 w-3/4 rounded bg-gray-200" />
            <div className="h-5 w-1/2 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </main>
  );
}
