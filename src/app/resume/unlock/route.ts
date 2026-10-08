import { NextRequest, NextResponse } from "next/server";
import { COOKIE, cookieOptions, issueToken, passwordMatches } from "@/lib/resumeAuth";

/**
 * One-click access for links sent to recruiters: /resume/unlock?key=<password>
 * sets the same cookie as the form, then lands on /resume with a clean URL.
 */
export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key") ?? "";
  if (!passwordMatches(key)) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return NextResponse.redirect(new URL("/resume?error=1", request.url));
  }
  const response = NextResponse.redirect(new URL("/resume", request.url));
  response.cookies.set(COOKIE, issueToken(), cookieOptions);
  return response;
}
