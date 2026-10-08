"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const UserSession = () => {
  const router = useRouter();

  const {
    data: session,
    isPending,
    error,
  } = authClient.useSession();

  const handleSignOut = async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "সাইন আউট করা যায়নি");
        return;
      }

      toast.success("সফলভাবে সাইন আউট হয়েছে");

      router.push("/signin");
      router.refresh();
    } catch (error) {
      console.error("Signout error:", error);

      toast.error("সাইন আউট করতে সমস্যা হয়েছে");
    }
  };

  // Session loading
  if (isPending) {
    return (
      <div className="flex items-center justify-center p-6">
        <span className="loading loading-spinner loading-md" />
      </div>
    );
  }

  // Session error
  if (error) {
    return (
      <div className="alert alert-error">
        <span>সেশন লোড করা যায়নি</span>
      </div>
    );
  }

  // User is not logged in
  if (!session?.user) {
    return (
      <div className="rounded-lg border border-base-300 bg-base-100 p-6 text-center shadow-sm">
        <h2 className="text-xl font-bold">
          আপনি সাইন ইন করেননি
        </h2>

        <p className="mt-2 text-sm text-base-content/60">
          আপনার অ্যাকাউন্ট ব্যবহার করতে সাইন ইন করুন।
        </p>

        <button
          onClick={() => router.push("/signin")}
          className="btn btn-primary mt-4"
        >
          সাইন ইন
        </button>
      </div>
    );
  }

  // User is logged in
  return (
    <div className="rounded-lg border border-base-300 bg-base-100 p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-base-content/60">
            স্বাগতম
          </p>

          <h2 className="text-xl font-bold">
            {session.user.name}
          </h2>

          <p className="mt-1 text-sm text-base-content/60">
            {session.user.email}
          </p>
        </div>

        <button
          onClick={handleSignOut}
          className="btn btn-error btn-outline"
        >
          সাইন আউট
        </button>
      </div>
    </div>
  );
};

export default UserSession;