"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const SignupPage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = formData.get("name")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim() || "";
    const password = formData.get("password")?.toString() || "";
    const confirmPassword =
      formData.get("confirmPassword")?.toString() || "";

    // Name validation
    if (!name) {
      toast.error("আপনার নাম লিখুন");
      return;
    }

    if (name.length < 2) {
      toast.error("নাম কমপক্ষে ২ অক্ষরের হতে হবে");
      return;
    }

    // Email validation
    if (!email) {
      toast.error("আপনার ইমেইল লিখুন");
      return;
    }

    // Password validation
    if (!password) {
      toast.error("আপনার পাসওয়ার্ড লিখুন");
      return;
    }

    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }

    // Confirm password validation
    if (!confirmPassword) {
      toast.error("পাসওয়ার্ড নিশ্চিত করুন");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("পাসওয়ার্ড মিলছে না");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/signin",
      });

      // Debug information
      console.log("Signup data:", data);
      console.log("Signup error:", error);

      if (error) {
        console.error("Better Auth signup error:", error);

        toast.error(
          error.message || "অ্যাকাউন্ট তৈরি করা যায়নি"
        );

        return;
      }

      toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে");

      router.push("/signin");
      router.refresh();
    } catch (error) {
      console.error("Signup error:", error);

      toast.error("অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-base-200 px-4 py-10">
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body">

            {/* Logo and title */}
            <div className="text-center">
              <Link href="/" className="inline-block">
                <div className="text-4xl">🛒</div>

                <h1 className="mt-2 text-3xl font-bold">
                  বাজার দর
                </h1>
              </Link>

              <p className="mt-2 text-base-content/60">
                নতুন অ্যাকাউন্ট তৈরি করুন
              </p>
            </div>

            {/* Signup form */}
            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="label"
                >
                  <span className="label-text">
                    নাম
                  </span>
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="আপনার নাম"
                  className="input input-bordered w-full"
                  autoComplete="name"
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="label"
                >
                  <span className="label-text">
                    ইমেইল
                  </span>
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  className="input input-bordered w-full"
                  autoComplete="email"
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="label"
                >
                  <span className="label-text">
                    পাসওয়ার্ড
                  </span>
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="কমপক্ষে ৮ অক্ষর"
                  className="input input-bordered w-full"
                  autoComplete="new-password"
                  disabled={loading}
                />
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="label"
                >
                  <span className="label-text">
                    পাসওয়ার্ড নিশ্চিত করুন
                  </span>
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="পাসওয়ার্ড আবার লিখুন"
                  className="input input-bordered w-full"
                  autoComplete="new-password"
                  disabled={loading}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    অ্যাকাউন্ট তৈরি হচ্ছে...
                  </>
                ) : (
                  "অ্যাকাউন্ট তৈরি করুন"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="divider">
              অথবা
            </div>

            {/* Sign in */}
            <p className="text-center text-sm text-base-content/70">
              ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}

              <Link
                href="/signin"
                className="link link-primary font-semibold"
              >
                সাইন ইন করুন
              </Link>
            </p>

            {/* Home */}
            <Link
              href="/"
              className="btn btn-ghost mt-2"
            >
              ← হোমে ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignupPage;