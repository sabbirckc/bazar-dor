import Link from "next/link";

const NotFound = () => {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl text-center">
        <div className="text-8xl">🔍</div>

        <p className="mt-6 text-6xl font-black text-primary">
          404
        </p>

        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
          পেজটি পাওয়া যায়নি
        </h1>

        <p className="mx-auto mt-3 max-w-lg text-base-content/60">
          আপনি যে পেজটি খুঁজছেন সেটি হয়তো মুছে ফেলা হয়েছে
          অথবা ভুল ঠিকানা ব্যবহার করা হয়েছে।
        </p>

        <Link
          href="/"
          className="btn btn-primary mt-8"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
};

export default NotFound;