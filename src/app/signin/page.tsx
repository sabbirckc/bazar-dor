"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const SigninPage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email")?.toString().trim() || "";
    const password = formData.get("password")?.toString() || "";

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

    try {
      setLoading(true);

      const { error } = await authClient.signIn.email({
        email,
        password,
        rememberMe: true,
        callbackURL: "/",
      });

      if (error) {
        toast.error(
          error.message || "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়"
        );
        return;
      }

      toast.success("সফলভাবে সাইন ইন হয়েছে");

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Signin error:", error);

      toast.error("সাইন ইন করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-base-200 px-4 py-10">
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body">
            {/* Logo */}
            <div className="text-center">
              <Link href="/" className="inline-block">
                <div className="text-4xl">🛒</div>

                <h1 className="mt-2 text-3xl font-bold">
                  বাজার দর
                </h1>
              </Link>

              <p className="mt-2 text-base-content/60">
                আপনার অ্যাকাউন্টে সাইন ইন করুন
              </p>
            </div>

            {/* Signin Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
            >
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
                  placeholder="আপনার পাসওয়ার্ড"
                  className="input input-bordered w-full"
                  autoComplete="current-password"
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
                    সাইন ইন হচ্ছে...
                  </>
                ) : (
                  "সাইন ইন"
                )}
              </button>
            </form>

            {/* Signup */}
            <div className="divider">অথবা</div>

            <p className="text-center text-sm text-base-content/70">
              অ্যাকাউন্ট নেই?{" "}
              <Link
                href="/signup"
                className="link link-primary font-semibold"
              >
                সাইন আপ করুন
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

export default SigninPage;