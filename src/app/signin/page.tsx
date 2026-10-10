"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const SignInPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      setIsLoading(true);

      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
        callbackURL: "/",
      });

      if (error) {
        setErrorMessage(
          error.message || "সাইন ইন করা যায়নি। আবার চেষ্টা করুন।"
        );
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setErrorMessage("একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (
    provider: "google" | "github"
  ) => {
    setErrorMessage("");

    try {
      setSocialLoading(provider);

      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        setErrorMessage(
          error.message || "সোশ্যাল সাইন ইন ব্যর্থ হয়েছে।"
        );
        setSocialLoading("");
      }
    } catch {
      setErrorMessage("সাইন ইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
      setSocialLoading("");
    }
  };

  const inputClass =
    "mt-1.5 block h-11 w-full rounded-lg border border-[#DCE5DD] bg-white px-3 text-sm text-[#26332A] outline-none transition placeholder:text-[#9AA39B] focus:border-[#07883F] focus:ring-2 focus:ring-[#07883F]/15 disabled:cursor-not-allowed disabled:opacity-60";

  const socialButtonClass =
    "flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#DCE5DD] bg-white px-2 text-xs font-semibold text-[#26332A] transition hover:bg-[#F4F8F4] hover:border-[#B8CDBB] disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm";

  return (
    <main className="flex min-h-[calc(100vh-150px)] flex-col items-center justify-center bg-[#F0F5F0] px-4 py-10">
      <div className="w-full max-w-[400px]">
        {/* Heading */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-[#07883F] text-2xl shadow-sm">
            <span role="img" aria-label="বাজারের ট্রলি">
              🛒
            </span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-[#26332A] sm:text-3xl">
            বাজার দর
          </h1>

          <p className="mt-2 text-sm text-[#7B857D]">
            আপনার অ্যাকাউন্টে সাইন ইন করুন
          </p>
        </div>

        {/* Sign-in card */}
        <div className="rounded-2xl border border-[#E1EAE2] bg-[#FAFCFA] p-5 shadow-[0_8px_30px_rgba(38,51,42,0.06)] sm:p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#26332A]"
              >
                ইমেইল
              </label>

              <input
                id="email"
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
                htmlFor="password"
                className="block text-sm font-semibold text-[#26332A]"
              >
                পাসওয়ার্ড
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="কমপক্ষে ৮ অক্ষর"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={inputClass}
                required
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
              className="flex h-11 w-full items-center justify-center rounded-lg bg-[#07883F] px-4 text-sm font-bold text-white transition hover:bg-[#066F34] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#07883F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
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

          {/* Social sign-in */}
          <div className="grid grid-cols-2 gap-3">
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
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
                  transform="translate(0 5)"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.73 7.18l7.64 5.93c4.46-4.13 7.13-10.2 7.13-17.58Z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.98 23.98 0 0 0 0 21.56l7.98-6.19Z"
                  transform="translate(0 5)"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.9-5.87l-7.64-5.93c-2.12 1.42-4.84 2.26-8.26 2.26-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
                  transform="translate(0 -3)"
                />
              </svg>

            <span className="truncate">
              {socialLoading === "google"
                ? "অপেক্ষা করুন..."
                : "Google দিয়ে চালিয়ে যান"}
            </span>
            </button>

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
                <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.24-1.62-1.24-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 .1.7 2.34 3.17 1.78.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.21 1.15-2.99-.12-.28-.5-1.42.11-2.95 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.56 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.53.23 2.67.11 2.95.72.78 1.15 1.77 1.15 2.99 0 4.29-2.62 5.24-5.11 5.52.4.35.75 1.02.75 2.06v3.06c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
              </svg>

            <span className="truncate">
              {socialLoading === "github"
                ? "অপেক্ষা করুন..."
                : "GitHub দিয়ে চালিয়ে যান"}
            </span>
            </button>
          </div>

          {/* Sign-up link */}
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
        <div className="mt-5 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-[#7B857D] transition hover:text-[#07883F] sm:text-sm"
          >
            <span aria-hidden="true">←</span>
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
};

export default SignInPage;