import Link from "next/link";

export default function NotFound() {
  return (
    // Center the 404 message on the screen
    <main className="flex min-h-[calc(100vh-120px)] items-center justify-center bg-[#F0F5F0] px-4 py-12 text-center">
      <div className="mx-auto flex max-w-xl flex-col items-center">
        {/* Search illustration in a soft circle */}
        <div
          className="mb-5 flex size-16 items-center justify-center rounded-full bg-[#E4F3E8] text-5xl"
          aria-hidden="true"
        >
          🔎
        </div>

        {/* Small "Error 404" label */}
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#07883F]">
          Error 404
        </p>

        {/* Main heading */}
        <h1 className="text-3xl font-extrabold leading-tight text-[#26332A] sm:text-4xl">
          পেজটি খুঁজে পাওয়া যায়নি
        </h1>

        {/* Friendly explanation */}
        <p className="mt-4 max-w-lg text-sm leading-6 text-[#526056] sm:text-base">
          দুঃখিত, আপনি যে পেজটি খুঁজছেন সেটি পাওয়া যায়নি।
          সঠিক ঠিকানা ব্যবহার করুন অথবা হোম পেজে ফিরে যান।
        </p>

        {/* Button back to home */}
        <Link
          href="/"
          className="mt-7 inline-flex items-center justify-center gap-2 rounded-lg bg-[#07883F] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#066F34] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#07883F]"
        >
          <span aria-hidden="true">←</span>
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}