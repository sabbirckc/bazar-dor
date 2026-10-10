"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const SignUpPage = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (name.trim().length < 2) {
      const message = "নাম কমপক্ষে ২ অক্ষরের হতে হবে।";
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    if (password.length < 8) {
      const message = "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।";
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    if (password !== confirmPassword) {
      const message = "দুটি পাসওয়ার্ড মিলছে না।";
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    try {
      setIsLoading(true);

      toast.loading("অ্যাকাউন্ট তৈরি হচ্ছে...", {
        id: "signup-status",
      });

      // No callbackURL here — we redirect manually with a param so
      // AuthToastHandler can fire the single success toast.
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (error) {
        const message =
          error.message ||
          "অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।";

        setErrorMessage(message);

        toast.error(message, {
          id: "signup-status",
          duration: 4000,
        });

        return;
      }

      // Clear the loading toast. The success toast is fired by
      // AuthToastHandler once we land on /?auth=signup-success.
      toast.dismiss("signup-status");

      // Tiny delay so the dismiss paints before navigation.
      await new Promise((resolve) => setTimeout(resolve, 300));

      router.replace("/?auth=signup-success");
      // NOTE: no router.refresh() — it would remount the tree and
      // interfere with the toast that AuthToastHandler is about to fire.
    } catch (error) {
      console.error("Sign-up error:", error);

      const message =
        "একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।";
      setErrorMessage(message);

      toast.error(message, {
        id: "signup-status",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: "google" | "github") => {
    setErrorMessage("");

    try {
      setSocialLoading(provider);

      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/?auth=signup-success",
      });

      if (error) {
        const message =
          error.message || "সোশ্যাল সাইন আপ ব্যর্থ হয়েছে।";
        setErrorMessage(message);
        toast.error(message);
        setSocialLoading("");
      }
      // On success, the browser will redirect and AuthToastHandler
      // will fire the single success toast — no client-side toast here.
    } catch (error) {
      console.error("Social sign-up error:", error);

      const message =
        "সোশ্যাল সাইন আপ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";
      setErrorMessage(message);
      toast.error(message);
      setSocialLoading("");
    }
  };

  const inputClass =
    "mt-1.5 h-10 w-full rounded-lg border border-[#E0E8E1] bg-[#FAFCFA] px-3 text-sm text-[#26332A] outline-none transition placeholder:text-[#9AA39B] focus:border-[#07883F] focus:ring-2 focus:ring-[#07883F]/10";

  return (
    <main className="flex min-h-[560px] flex-col items-center bg-[#F0F5F0] px-4 py-8 sm:min-h-[600px] sm:py-10">
      {/* Page heading */}
      <div className="mb-5 text-center">
        <h1 className="text-xl font-extrabold text-[#26332A] sm:text-2xl">
          অ্যাকাউন্ট তৈরি করুন
        </h1>

        <p className="mt-1 text-xs leading-5 text-[#7B857D] sm:text-sm">
          বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
        </p>
      </div>

      {/* Signup card */}
      <div className="w-full max-w-[312px] rounded-xl border border-[#E1EAE2] bg-[#FAFCFA] p-4 sm:max-w-[340px] sm:p-5">
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name */}
          <div>
            <label
              htmlFor="signup-name"
              className="block text-xs font-medium text-[#26332A]"
            >
              নাম
            </label>

            <input
              id="signup-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="যেমন: রহিম উদ্দিন"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClass}
              required
              minLength={2}
              maxLength={100}
              disabled={isLoading}
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="signup-email"
              className="block text-xs font-medium text-[#26332A]"
            >
              ইমেইল
            </label>

            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClass}
              required
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="signup-password"
              className="block text-xs font-medium text-[#26332A]"
            >
              পাসওয়ার্ড
            </label>

            <input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="কমপক্ষে ৮ অক্ষর"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClass}
              required
              minLength={8}
              disabled={isLoading}
            />
          </div>

          {/* Confirm password */}
          <div>
            <label
              htmlFor="signup-confirm-password"
              className="block text-xs font-medium text-[#26332A]"
            >
              পাসওয়ার্ড নিশ্চিত করুন
            </label>

            <input
              id="signup-confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="আবার লিখুন"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              className={inputClass}
              required
              minLength={8}
              disabled={isLoading}
            />
          </div>

          {/* Error message */}
          {errorMessage && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs leading-5 text-red-700"
            >
              {errorMessage}
            </p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading || socialLoading !== ""}
            className="flex h-10 w-full items-center justify-center rounded-lg bg-[#07883F] px-4 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#066F34] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#07883F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#E1EAE2]" />
          <span className="text-[10px] text-[#7B857D]">অথবা</span>
          <div className="h-px flex-1 bg-[#E1EAE2]" />
        </div>

        {/* Social signup */}
        <div className="grid grid-cols-2 gap-2">
          {/* Google */}
          <button
            type="button"
            onClick={() => handleSocialSignUp("google")}
            disabled={isLoading || socialLoading !== ""}
            className="flex h-9 min-w-0 items-center justify-center gap-1.5 rounded-lg border border-[#E1EAE2] bg-white px-1.5 text-[10px] font-semibold text-[#26332A] transition-colors hover:bg-[#F5F8F5] disabled:opacity-50 sm:text-xs"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 48 48"
              className="size-4 shrink-0"
            >
              <path
                fill="#4285F4"
                d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z"
              />
              <path
                fill="#34A853"
                d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4 1.9-6.9 1.9-5.3 0-9.8-3.6-11.4-8.4H5.8v5.2A20 20 0 0 0 24 44Z"
              />
              <path
                fill="#FBBC05"
                d="M12.6 27.5a12 12 0 0 1 0-7v-5.2H5.8a20 20 0 0 0 0 17.4l6.8-5.2Z"
              />
              <path
                fill="#EA4335"
                d="M24 12.1c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6.1 29.5 4 24 4A20 20 0 0 0 5.8 15.3l6.8 5.2c1.6-4.8 6.1-8.4 11.4-8.4Z"
              />
            </svg>

            <span className="truncate">
              {socialLoading === "google"
                ? "অপেক্ষা করুন..."
                : "Google দিয়ে চালিয়ে যান"}
            </span>
          </button>

          {/* GitHub */}
          <button
            type="button"
            onClick={() => handleSocialSignUp("github")}
            disabled={isLoading || socialLoading !== ""}
            className="flex h-9 min-w-0 items-center justify-center gap-1.5 rounded-lg border border-[#E1EAE2] bg-white px-1.5 text-[10px] font-semibold text-[#26332A] transition-colors hover:bg-[#F5F8F5] disabled:opacity-50 sm:text-xs"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-4 shrink-0 fill-current"
            >
              <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.68-3.76-1.32-3.76-1.32-.51-1.29-1.24-1.63-1.24-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 .1.98 2.19 3.16 1.55.1-.72.4-1.22.69-1.5-2.48-.28-5.08-1.24-5.08-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.56 0c2.12-1.44 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.29-2.6 5.23-5.09 5.51.4.35.75 1.02.75 2.06v3.06c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
            </svg>

            <span className="truncate">
              {socialLoading === "github"
                ? "অপেক্ষা করুন..."
                : "GitHub দিয়ে চালিয়ে যান"}
            </span>
          </button>
        </div>

        {/* Sign in link */}
        <p className="mt-4 text-center text-[10px] text-[#68736A] sm:text-xs">
          অ্যাকাউন্ট আছে?{" "}
          <Link
            href="/signin"
            className="font-semibold text-[#07883F] hover:underline"
          >
            সাইন ইন করুন
          </Link>
        </p>
      </div>

      {/* Back home */}
      <Link
        href="/"
        className="mt-5 text-xs text-[#7B857D] transition-colors hover:text-[#07883F]"
      >
        ← হোম পেজে ফিরে যান
      </Link>
    </main>
  );
};

export default SignUpPage;