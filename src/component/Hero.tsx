"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  const [formattedDate, setFormattedDate] = useState("");

  // Format the date on the client to avoid hydration mismatches.
  useEffect(() => {
    setFormattedDate(
      new Intl.DateTimeFormat("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Dhaka",
      }).format(new Date())
    );
  }, []);

  return (
    <section className="bg-[#F0F5F0] px-3 py-3 sm:px-6 sm:py-5 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-2 rounded-2xl border border-[#E3EBE4] bg-[#FAFCFA] p-4 sm:gap-6 sm:p-6 lg:grid-cols-[1.3fr_0.7fr] lg:gap-8 lg:p-8">
          {/* Left side: date, heading, description, button */}
          <div className="min-w-0">
            {/* Bengali date badge (empty space reserved before it loads) */}
            <p className="mb-2 inline-flex rounded-full bg-[#E4F3E8] px-3 py-1 text-[10px] font-semibold text-[#07883F] sm:text-xs">
              {formattedDate || "\u00a0"}
            </p>

            {/* Main heading */}
            <h1 className="max-w-2xl text-2xl font-extrabold leading-[1.25] tracking-tight text-[#26332A] sm:text-3xl lg:text-4xl">
              আজকের বাজারের দাম এক নজরে
            </h1>

            {/* Short description */}
            <p className="mt-2 max-w-xl text-xs leading-5 text-[#788078] sm:mt-3 sm:text-sm sm:leading-6">
              চাল, ডাল, তেল, সবজি, মাছ, মাংসসহ নিত্যপ্রয়োজনীয়
              পণ্যের বর্তমান বাজারদর জানুন — বাজারদরভিত্তিক
              বিস্তারিত তথ্য এক জায়গায়।
            </p>

            {/* Scroll-down button to the "all products" section */}
            <div className="mt-4">
              <Link
                href="#সব-পণ্য"
                className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-[#07883F] px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#066F34] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#07883F] focus-visible:ring-offset-2 sm:min-h-10 sm:px-5 sm:text-sm"
              >
                সব পণ্য দেখুন
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Right side: basket illustration */}
          <div className="flex items-center justify-center py-2 lg:justify-end">
            <div className="flex flex-col items-center">
              <Image
                src="/bazar-hero.png"
                alt="বাজার দর - তাজা ফল ও সবজির ঝুড়ি"
                width={300}
                height={300}
                priority
                className="h-auto w-[170px] object-contain sm:w-[220px] lg:w-[280px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;