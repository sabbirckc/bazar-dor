"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

type SocialProvider = "google" | "github";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] =
    useState<SocialProvider | "">("");

  const inputClass =
    "mt-1.5 h-10 w-full rounded-lg border border-[#E0E8E1] bg-white px-3 text-sm text-[#26332A] outline-none transition placeholder:text-[#9AA39B] focus:border-[#07883F] focus:ring-2 focus:ring-[#07883F]/10 disabled:cursor-not-allowed disabled:opacity-60";

  const socialButtonClass =
    "flex h-9 min-w-0 items-center justify-center gap-1.5 rounded-lg border border-[#E1EAE2] bg-white px-2 text-[10px] font-semibold text-[#26332A] transition-colors hover:bg-[#F5F8F5] disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password) {
      const message = "ইমেইল ও পাসওয়ার্ড লিখুন।";
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    setIsLoading(true);

    toast.loading("সাইন ইন যাচাই হচ্ছে...", {
      id: "signin-status",
    });

    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        const message =
          error.message || "সাইন ইন করা যায়নি। আবার চেষ্টা করুন।";

        setErrorMessage(message);

        toast.error(message, {
          id: "signin-status",
          duration: 4000,
        });

        return;
      }

      toast.dismiss("signin-status");

      await new Promise((resolve) => setTimeout(resolve, 300));

      const params = new URLSearchParams(window.location.search);
      const callbackUrl = params.get("callbackUrl");

      const base =
        callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")
          ? callbackUrl
          : "/";

      const separator = base.includes("?") ? "&" : "?";
      const destination = `${base}${separator}auth=success`;

      router.replace(destination);
    } catch (error) {
      console.error("Sign-in error:", error);

      const message = "একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।";
      setErrorMessage(message);

      toast.error(message, {
        id: "signin-status",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: SocialProvider) => {
    setErrorMessage("");
    setSocialLoading(provider);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/?auth=success",
      });

      if (error) {
        const message =
          error.message || "সোশ্যাল সাইন ইন ব্যর্থ হয়েছে।";

        setErrorMessage(message);
        toast.error(message);
        setSocialLoading("");
      }
    } catch (error) {
      console.error("Social sign-in error:", error);

      const message = "সাইন ইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";
      setErrorMessage(message);
      toast.error(message);
      setSocialLoading("");
    }
  };

  return (
    <main className="flex flex-1 flex-col items-center bg-[#F0F5F0] px-4 py-10 sm:py-14">
      {/* Page heading */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-[#26332A] sm:text-3xl">
          সাইন ইন
        </h1>

        <p className="mt-2 text-sm text-[#7B857D]">
          বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
        </p>
      </div>

      {/* Signin card */}
      <div className="w-full max-w-[400px] rounded-2xl border border-[#E1EAE2] bg-[#FAFCFA] p-6 sm:p-7">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="signin-email"
              className="block text-sm font-semibold text-[#26332A]"
            >
              ইমেইল
            </label>

            <input
              id="signin-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClass}
              required
              disabled={isLoading || socialLoading !== ""}
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="signin-password"
              className="block text-sm font-semibold text-[#26332A]"
            >
              পাসওয়ার্ড
            </label>

            <input
              id="signin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="আপনার পাসওয়ার্ড লিখুন"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClass}
              required
              disabled={isLoading || socialLoading !== ""}
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
            className="flex h-11 w-full items-center justify-center rounded-lg bg-[#07883F] px-4 text-sm font-bold text-white transition-colors hover:bg-[#066F34] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#07883F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#E1EAE2]" />
          <span className="text-xs text-[#7B857D]">অথবা</span>
          <div className="h-px flex-1 bg-[#E1EAE2]" />
        </div>

        {/* Social signin */}
        <div className="grid grid-cols-2 gap-3">
          {/* Google */}
          <button
            type="button"
            onClick={() => handleSocialSignIn("google")}
            disabled={isLoading || socialLoading !== ""}
            className={socialButtonClass}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 48 48"
              className="size-[18px] shrink-0"
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
            onClick={() => handleSocialSignIn("github")}
            disabled={isLoading || socialLoading !== ""}
            className={socialButtonClass}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-[18px] shrink-0 fill-current"
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

        {/* Signup link */}
        <p className="mt-5 text-center text-xs leading-5 text-[#68736A] sm:text-sm">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href="/signup"
            className="font-bold text-[#07883F] hover:underline"
          >
            সাইন আপ করুন
          </Link>
        </p>
      </div>

      {/* Back home */}
      <Link
        href="/"
        className="mt-5 text-xs text-[#7B857D] transition-colors hover:text-[#07883F] sm:text-sm"
      >
        ← হোম পেজে ফিরে যান
      </Link>
    </main>
  );
}