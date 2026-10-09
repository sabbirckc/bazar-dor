"use client";

import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

type Provider =
  | "google"
  | "github";

const SocialLogin = () => {
  const [loadingProvider, setLoadingProvider] =
    useState<Provider | null>(null);

  const handleSocialLogin = async (
    provider: Provider
  ) => {
    try {
      setLoadingProvider(provider);

      const { error } =
        await authClient.signIn.social({
          provider,
          callbackURL: "/",
        });

      if (error) {
        console.error(
          `${provider} login error:`,
          error
        );

        toast.error(
          error.message ||
            `${provider} দিয়ে সাইন ইন করা যায়নি`
        );

        setLoadingProvider(null);
      }
    } catch (error) {
      console.error(
        `${provider} login error:`,
        error
      );

      toast.error(
        `${provider} দিয়ে সাইন ইন করতে সমস্যা হয়েছে`
      );

      setLoadingProvider(null);
    }
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {/* Google */}

      <button
        type="button"
        onClick={() =>
          handleSocialLogin("google")
        }
        disabled={loadingProvider !== null}
        className="btn btn-outline"
      >
        {loadingProvider === "google" ? (
          <>
            <span className="loading loading-spinner loading-sm" />
            Google দিয়ে সাইন ইন হচ্ছে...
          </>
        ) : (
          <>
            <span className="text-lg">
              G
            </span>
            Google
          </>
        )}
      </button>

      {/* GitHub */}

      <button
        type="button"
        onClick={() =>
          handleSocialLogin("github")
        }
        disabled={loadingProvider !== null}
        className="btn btn-outline"
      >
        {loadingProvider === "github" ? (
          <>
            <span className="loading loading-spinner loading-sm" />
            GitHub দিয়ে সাইন ইন হচ্ছে...
          </>
        ) : (
          <>
            <span className="text-lg">
              ◉
            </span>
            GitHub
          </>
        )}
      </button>
    </div>
  );
};

export default SocialLogin;