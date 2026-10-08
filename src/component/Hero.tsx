import Link from "next/link";

const Hero = () => {
  return (
    <section className="border-b border-base-300 bg-base-100">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">

          {/* Left Content */}
          <div className="max-w-2xl">

            {/* Eyebrow */}
            <p className="mb-4 text-sm font-semibold tracking-wide text-primary">
              প্রতিদিনের বাজারদর
            </p>

            {/* Heading */}
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              বাংলাদেশের
              <br />

              <span className="text-primary">
                বাজারদর
              </span>{" "}
              এক নজরে
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl text-base leading-8 text-base-content/70 sm:text-lg">
              নিত্যপ্রয়োজনীয় পণ্যের বর্তমান বাজারদর
              সহজে জানুন। চাল, ডাল, তেল, সবজি, মাছ,
              মাংসসহ প্রয়োজনীয় সব পণ্যের দাম এক
              জায়গায়।
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#সব-পণ্য"
                className="btn btn-primary"
              >
                সব পণ্যের দাম দেখুন
                <span aria-hidden="true">
                  ↓
                </span>
              </Link>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative flex aspect-square w-full max-w-md items-center justify-center rounded-3xl bg-base-200 p-8 sm:p-12">

              {/* Decorative circles */}
              <div className="absolute left-8 top-8 h-16 w-16 rounded-full bg-primary/10" />

              <div className="absolute bottom-8 right-8 h-24 w-24 rounded-full bg-primary/10" />

              {/* Basket illustration */}
              <div className="relative z-10 text-center">
                <div className="text-8xl sm:text-9xl">
                  🧺
                </div>

                <div className="mt-4 text-4xl">
                  🥬 🍅 🥔
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;