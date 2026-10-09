
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

type Provider = "google" | "github";

const SocialLogin = () => {
  const searchParams = useSearchParams();
  const [loadingProvider, setLoadingProvider] =
    useState<Provider | null>(null);

  const callbackURL = searchParams.get("callbackURL");

  const redirectTo =
    callbackURL?.startsWith("/") && !callbackURL.startsWith("//")
      ? callbackURL
      : "/";

  const handleSocialLogin = async (provider: Provider) => {
    try {
      setLoadingProvider(provider);

      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: redirectTo,
        errorCallbackURL: "/signin",
      });

      if (error) {
        console.error(`${provider} sign-in error:`, error);

        toast.error(
          error.message || `${provider} sign-in failed`
        );

        setLoadingProvider(null);
      }
    } catch (error) {
      console.error(`${provider} sign-in error:`, error);

      toast.error("সাইন ইন করতে সমস্যা হয়েছে");
      setLoadingProvider(null);
    }
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <button
        type="button"
        onClick={() => handleSocialLogin("google")}
        disabled={loadingProvider !== null}
        className="btn btn-outline w-full"
      >
        {loadingProvider === "google" ? (
          <>
            <span className="loading loading-spinner loading-sm" />
            Google...
          </>
        ) : (
          <>
            <span className="text-lg font-bold">G</span>
            Google
          </>
        )}
      </button>

      <button
        type="button"
        onClick={() => handleSocialLogin("github")}
        disabled={loadingProvider !== null}
        className="btn btn-outline w-full"
      >
        {loadingProvider === "github" ? (
          <>
            <span className="loading loading-spinner loading-sm" />
            GitHub...
          </>
        ) : (
          <>
            <span className="text-lg">◉</span>
            GitHub
          </>
        )}
      </button>
    </div>
  );
};

export default SocialLogin;
