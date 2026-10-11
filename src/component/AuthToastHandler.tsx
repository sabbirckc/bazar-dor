"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function AuthToastHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read the two possible query flags from the URL
  const reason = searchParams.get("reason");
  const authStatus = searchParams.get("auth");

  useEffect(() => {
    // Nothing to do if neither flag is present
    if (!reason && !authStatus) return;

    // Show the right toast for each case.
    // A shared toast id prevents duplicates from re-renders.
    if (reason === "auth-required") {
      toast.error("এই পেজটি দেখতে আগে সাইন ইন করুন।", {
        id: "auth-status",
      });
    } else if (reason === "session-expired") {
      toast.error("আপনার সেশন শেষ হয়েছে। আবার সাইন ইন করুন।", {
        id: "auth-status",
      });
    } else if (authStatus === "success") {
      toast.success("সফলভাবে সাইন ইন হয়েছে!", {
        id: "auth-status",
      });
    } else if (authStatus === "signup-success") {
      toast.success("সফলভাবে অ্যাকাউন্ট তৈরি হয়েছে!", {
        id: "auth-status",
      });
    }

    // Remove the flags from the URL so the toast doesn't re-fire
    // on refresh, back/forward navigation, or remount.
    const params = new URLSearchParams(searchParams.toString());
    params.delete("reason");
    params.delete("auth");

    const query = params.toString();
    const cleanUrl = query ? `${pathname}?${query}` : pathname;

    // Use replaceState so Next.js doesn't treat this as a navigation
    // (which would re-render the Suspense boundary and lose the toast).
    window.history.replaceState(null, "", cleanUrl);
  }, [pathname, searchParams, reason, authStatus]);

  // This component only handles side effects — nothing to render
  return null;
}