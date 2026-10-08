"use client";

import {
  FormEvent,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

interface ProfileUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

interface ProfileFormProps {
  user: ProfileUser;
}

const ProfileForm = ({
  user,
}: ProfileFormProps) => {
  const router = useRouter();

  const [name, setName] = useState(
    user.name
  );

  const [loading, setLoading] =
    useState(false);

  const [signingOut, setSigningOut] =
    useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error(
        "আপনার নাম লিখুন"
      );

      return;
    }

    if (trimmedName.length < 2) {
      toast.error(
        "নাম কমপক্ষে ২ অক্ষরের হতে হবে"
      );

      return;
    }

    if (trimmedName === user.name) {
      toast.info(
        "নামে কোনো পরিবর্তন করা হয়নি"
      );

      return;
    }

    try {
      setLoading(true);

      const { data, error } =
        await authClient.updateUser({
          name: trimmedName,
        });

      console.log(
        "Updated user:",
        data
      );

      console.log(
        "Update error:",
        error
      );

      if (error) {
        toast.error(
          error.message ||
            "প্রোফাইল আপডেট করা যায়নি"
        );

        return;
      }

      toast.success(
        "প্রোফাইল সফলভাবে আপডেট হয়েছে"
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      toast.error(
        "প্রোফাইল আপডেট করতে সমস্যা হয়েছে"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut =
    async () => {
      try {
        setSigningOut(true);

        const { error } =
          await authClient.signOut();

        if (error) {
          toast.error(
            error.message ||
              "সাইন আউট করা যায়নি"
          );

          return;
        }

        toast.success(
          "সফলভাবে সাইন আউট হয়েছে"
        );

        router.push("/");
        router.refresh();
      } catch (error) {
        console.error(
          "Sign out error:",
          error
        );

        toast.error(
          "সাইন আউট করতে সমস্যা হয়েছে"
        );
      } finally {
        setSigningOut(false);
      }
    };

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          {/* Profile Header */}
          <div className="flex flex-col items-center gap-5 border-b border-base-300 pb-6 sm:flex-row">
            <div className="avatar">
              <div className="w-24 rounded-full bg-base-200">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl">
                    👤
                  </div>
                )}
              </div>
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold">
                {user.name}
              </h2>

              <p className="mt-1 text-base-content/60">
                {user.email}
              </p>
            </div>
          </div>

          {/* Account Information */}
          <div className="mt-6">
            <h3 className="text-xl font-bold">
              অ্যাকাউন্ট তথ্য
            </h3>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-base-300 bg-base-200 p-4">
                <p className="text-sm text-base-content/60">
                  নাম
                </p>

                <p className="mt-1 font-semibold">
                  {user.name}
                </p>
              </div>

              <div className="rounded-xl border border-base-300 bg-base-200 p-4">
                <p className="text-sm text-base-content/60">
                  ইমেইল
                </p>

                <p className="mt-1 break-all font-semibold">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Update Form */}
          <div className="mt-8 border-t border-base-300 pt-8">
            <h3 className="text-xl font-bold">
              প্রোফাইল আপডেট করুন
            </h3>

            <p className="mt-1 text-sm text-base-content/60">
              আপনার নাম পরিবর্তন করতে নিচের
              ফর্মটি ব্যবহার করুন।
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >
              <div>
                <label
                  htmlFor="name"
                  className="label"
                >
                  <span className="label-text">
                    নাম
                  </span>
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  className="input input-bordered w-full"
                  disabled={loading}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="label"
                >
                  <span className="label-text">
                    ইমেইল
                  </span>
                </label>

                <input
                  id="email"
                  type="email"
                  value={user.email}
                  className="input input-bordered w-full"
                  disabled
                  readOnly
                />

                <p className="mt-1 text-xs text-base-content/50">
                  এই অংশটি বর্তমানে পরিবর্তনযোগ্য নয়।
                </p>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    আপডেট হচ্ছে...
                  </>
                ) : (
                  "প্রোফাইল আপডেট করুন"
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Sign Out */}
      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <h3 className="text-xl font-bold">
            অ্যাকাউন্ট
          </h3>

          <p className="mt-1 text-sm text-base-content/60">
            এই ডিভাইস থেকে আপনার অ্যাকাউন্টে
            সাইন আউট করুন।
          </p>

          <div className="mt-4">
            <button
              type="button"
              onClick={handleSignOut}
              className="btn btn-outline btn-error"
              disabled={signingOut}
            >
              {signingOut ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  সাইন আউট হচ্ছে...
                </>
              ) : (
                "সাইন আউট"
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfileForm;