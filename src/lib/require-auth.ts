import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function requireAuth(returnTo = "/") {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(
      `/signin?reason=auth-required&callbackUrl=${encodeURIComponent(returnTo)}`
    );
  }

  return session;
}