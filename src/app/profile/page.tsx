"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const ProfilePage = () => {
const router = useRouter();
const { data: session, isPending } = authClient.useSession();

const [name, setName] = useState("");
const [isSaving, setIsSaving] = useState(false);
const [isSigningOut, setIsSigningOut] = useState(false);

const user = session?.user;

useEffect(() => {
if (user) {
setName(user.name || "");
}
}, [user?.name]);

useEffect(() => {
if (!isPending && !session?.user) {
router.replace("/signin?callbackURL=%2Fprofile");
}
}, [isPending, session?.user, router]);

const handleUpdateProfile = async (
event: FormEvent<HTMLFormElement>,
) => {
event.preventDefault();

const trimmedName = name.trim();

if (trimmedName.length < 2) {
  toast.error("নাম কমপক্ষে ২ অক্ষরের হতে হবে");
  return;
}

try {
  setIsSaving(true);

  const { error } = await authClient.updateUser({
    name: trimmedName,
  });

  if (error) {
    toast.error(error.message || "প্রোফাইল আপডেট করা যায়নি");
    return;
  }

  toast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে");
  await authClient.getSession();
  router.refresh();
} catch (error) {
  console.error("Profile update failed:", error);
  toast.error("প্রোফাইল আপডেট করতে সমস্যা হয়েছে");
} finally {
  setIsSaving(false);
}

};

const handleSignOut = async () => {
try {
setIsSigningOut(true);

  const { error } = await authClient.signOut();

  if (error) {
    toast.error(error.message || "সাইন আউট করা যায়নি");
    return;
  }

  toast.success("সফলভাবে সাইন আউট হয়েছে");
  router.replace("/signin");
  router.refresh();
} catch (error) {
  console.error("Sign out failed:", error);
  toast.error("সাইন আউট করতে সমস্যা হয়েছে");
} finally {
  setIsSigningOut(false);
}

};

if (isPending || !user) {
return (
<main className="flex min-h-[70vh] items-center justify-center px-4">
<div
       className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"
       role="status"
       aria-label="লোড হচ্ছে"
     />
</main>
);
}

return (
<main className="min-h-screen bg-[#f1f7f2] px-4 py-10 text-[#172b40]">
<div className="mx-auto max-w-2xl">
<Link
       href="/"
       className="mb-6 inline-flex rounded-lg px-3 py-2 text-sm transition hover:bg-gray-200"
     >
← হোমে ফিরে যান
</Link>

    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
      <header className="text-center">
        <h1 className="text-3xl font-bold">আমার প্রোফাইল</h1>
        <p className="mt-2 text-sm text-gray-600 sm:text-base">
          আপনার অ্যাকাউন্টের তথ্য দেখুন ও আপডেট করুন
        </p>
      </header>

      <form onSubmit={handleUpdateProfile} className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium"
          >
            আপনার নাম
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            minLength={2}
            maxLength={100}
            autoComplete="name"
            required
            disabled={isSaving}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium"
          >
            ইমেইল
          </label>
          <input
            id="email"
            type="email"
            value={user.email}
            className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-600"
            readOnly
          />
          <p className="mt-2 text-xs text-gray-500">
            ইমেইল ঠিকানা এখানে পরিবর্তন করা যাবে না।
          </p>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSaving || name.trim() === (user.name || "")}
        >
          {isSaving ? "আপডেট হচ্ছে..." : "প্রোফাইল আপডেট করুন"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-sm text-gray-500">অ্যাকাউন্ট</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <button
        type="button"
        onClick={handleSignOut}
        className="w-full rounded-lg border border-red-300 px-4 py-3 font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isSigningOut}
      >
        {isSigningOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
      </button>
    </section>
  </div>
</main>

);
};

export default ProfilePage;