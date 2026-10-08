"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, cookieOptions, issueToken, passwordMatches } from "@/lib/resumeAuth";

export async function unlock(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!passwordMatches(password)) {
    // Slow down guessing a little.
    await new Promise((resolve) => setTimeout(resolve, 500));
    redirect("/resume?error=1");
  }
  (await cookies()).set(COOKIE, issueToken(), cookieOptions);
  redirect("/resume");
}
