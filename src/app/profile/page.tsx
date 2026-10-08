import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import ProfileForm from "@/component/ProfileForm";

const ProfilePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <main className="min-h-screen bg-base-200 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold sm:text-4xl">
            আমার প্রোফাইল
          </h1>

          <p className="mt-2 text-base-content/60">
            আপনার ব্যক্তিগত তথ্য দেখুন এবং আপডেট করুন।
          </p>
        </div>

        <ProfileForm
          user={{
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
          }}
        />
      </div>
    </main>
  );
};

export default ProfilePage;