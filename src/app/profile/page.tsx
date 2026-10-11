"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // Form + UI state
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const user = session?.user;

  // Fill the input with the current name once it loads
  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  // Save the updated name
  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    // Name can't be empty
    if (!name.trim()) {
      setErrorMessage("আপনার নাম লিখুন।");
      return;
    }

    try {
      setIsSaving(true);

      const { error } = await authClient.updateUser({
        name: name.trim(),
      });

      if (error) {
        setErrorMessage(error.message || "তথ্য আপডেট করা যায়নি।");
        return;
      }

      setMessage("আপনার নাম সফলভাবে আপডেট হয়েছে।");
      router.refresh();
    } catch {
      setErrorMessage("একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsSaving(false);
    }
  };

  // Sign the user out
  const handleSignOut = async () => {
    setErrorMessage("");

    try {
      setIsSigningOut(true);

      const { error } = await authClient.signOut();

      if (error) {
        setErrorMessage(error.message || "সাইন আউট করা যায়নি।");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setErrorMessage("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setIsSigningOut(false);
    }
  };

  // Loading skeleton while the session is being fetched
  if (isPending) {
    return (
      <main className="min-h-[60vh] bg-[#F0F5F0] px-4 py-12">
        <div className="mx-auto max-w-3xl animate-pulse">
          <div className="mb-5 h-5 w-32 rounded bg-[#DCE5DD]" />
          <div className="h-24 rounded-xl bg-white" />
          <div className="mt-4 h-36 rounded-xl bg-white" />
        </div>
      </main>
    );
  }

  // Not signed in — ask the user to sign in
  if (!user) {
    return (
      <main className="flex min-h-[50vh] flex-col items-center justify-center bg-[#F0F5F0] px-4 text-center">
        <h1 className="text-xl font-bold text-[#26332A]">
          আমার প্রোফাইল
        </h1>
        <p className="mt-2 text-sm text-[#7B857D]">
          প্রোফাইল দেখতে সাইন ইন করুন।
        </p>
        <button
          onClick={() => router.push("/signin")}
          className="mt-4 rounded-lg bg-[#07883F] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#066F34]"
        >
          সাইন ইন
        </button>
      </main>
    );
  }

  // Shared input styling
  const inputClass =
    "mt-2 h-10 w-full rounded-lg border border-[#E1EAE2] bg-[#FAFCFA] px-3 text-sm text-[#26332A] outline-none transition placeholder:text-[#9AA39B] focus:border-[#07883F] focus:ring-2 focus:ring-[#07883F]/10";

  return (
    <main className="min-h-[calc(100vh-190px)] bg-[#F0F5F0] px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-3xl">
        {/* Page heading */}
        <header className="mb-5">
          <h1 className="text-lg font-extrabold text-[#26332A] sm:text-xl">
            আমার প্রোফাইল
          </h1>
          <p className="mt-1 text-xs text-[#7B857D] sm:text-sm">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </header>

        {/* Profile summary card: avatar, name, email, sign-out */}
        <section className="flex items-center gap-3 rounded-xl border border-[#E1EAE2] bg-[#FAFCFA] p-4 sm:gap-4 sm:p-5">
          {/* Avatar image, or first letter of the name as a fallback */}
          {user.image ? (
            <img
              src={user.image}
              alt={`${user.name || "ব্যবহারকারী"}-এর প্রোফাইল`}
              className="size-12 shrink-0 rounded-lg object-cover sm:size-14"
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#E4F3E8] text-lg font-bold text-[#07883F] sm:size-14"
            >
              {(user.name?.trim().charAt(0) || "U").toUpperCase()}
            </div>
          )}

          {/* Name and email */}
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-bold text-[#26332A] sm:text-base">
              {user.name || "ব্যবহারকারী"}
            </h2>
            <p className="mt-1 truncate text-xs text-[#7B857D] sm:text-sm">
              {user.email}
            </p>
          </div>

          {/* Sign-out button with a small arrow icon */}
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut || isSaving}
            className="inline-flex h-[34px] shrink-0 items-center justify-center gap-1 rounded-md border border-[#FF9999] bg-transparent px-3 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50 disabled:opacity-60"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-3.5"
            >
              <path d="M10 17l5-5-5-5" />
              <path d="M15 12H3" />
              <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
            </svg>

            {isSigningOut ? "অপেক্ষা করুন..." : "সাইন আউট"}
          </button>
        </section>

        {/* Editable info card */}
        <section className="mt-4 rounded-xl border border-[#E1EAE2] bg-[#FAFCFA] p-4 sm:p-6">
          <h2 className="mb-5 text-sm font-bold text-[#26332A]">তথ্য</h2>

          <form onSubmit={handleUpdate}>
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-medium text-[#526056]"
              >
                নাম
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="আপনার নাম লিখুন"
                autoComplete="name"
                maxLength={100}
                required
                disabled={isSaving}
                className={inputClass}
              />
            </div>

            {/* Success message */}
            {message && (
              <p role="status" className="mt-3 text-xs text-[#07883F]">
                {message}
              </p>
            )}

            {/* Error message */}
            {errorMessage && (
              <p role="alert" className="mt-3 text-xs text-red-600">
                {errorMessage}
              </p>
            )}

            {/* Save button */}
            <button
              type="submit"
              disabled={isSaving || isSigningOut}
              className="mt-3 flex h-10 w-full items-center justify-center rounded-md bg-[#07883F] px-4 text-xs font-bold text-white shadow-sm transition hover:bg-[#066F34] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#07883F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}