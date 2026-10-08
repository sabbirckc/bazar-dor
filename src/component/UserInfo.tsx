"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

const UserInfo = () => {
  const router = useRouter();

  const { data: session, isPending } =
    authClient.useSession();

  const user = session?.user;

  const handleSignOut = async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(
          error.message || "সাইন আউট করা যায়নি"
        );
        return;
      }

      toast.success("সফলভাবে সাইন আউট হয়েছে");

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);

      toast.error(
        "সাইন আউট করতে সমস্যা হয়েছে"
      );
    }
  };

  // Session loading
  if (isPending) {
    return (
      <div className="flex items-center gap-3">
        <div className="skeleton h-8 w-24 rounded-lg" />
        <div className="skeleton h-8 w-20 rounded-lg" />
      </div>
    );
  }

  // User is logged in
  if (user) {
    return (
      <div className="flex items-center gap-3">
        {/* Profile */}
        <Link
          href="/profile"
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-base-200"
        >
          {/* User image */}
          <div className="avatar">
            <div className="w-9 rounded-full bg-base-200">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg">
                  👤
                </div>
              )}
            </div>
          </div>

          {/* User name */}
          <span className="hidden font-medium sm:inline">
            {user.name}
          </span>
        </Link>

        {/* Sign out */}
        <button
          type="button"
          onClick={handleSignOut}
          className="btn btn-outline btn-error btn-sm"
        >
          সাইন আউট
        </button>
      </div>
    );
  }

  // User is not logged in
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/signin"
        className="btn btn-ghost btn-sm"
      >
        সাইন ইন
      </Link>

      <Link
        href="/signup"
        className="btn btn-primary btn-sm"
      >
        সাইন আপ
      </Link>
    </div>
  );
};

export default UserInfo;