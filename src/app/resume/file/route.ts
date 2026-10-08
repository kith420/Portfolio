import { NextRequest, NextResponse } from "next/server";
import { COOKIE, readResume, tokenValid } from "@/lib/resumeAuth";

/** The PDF itself. Only served to a browser holding a valid access cookie. */
export async function GET(request: NextRequest) {
  if (!tokenValid(request.cookies.get(COOKIE)?.value)) {
    return NextResponse.redirect(new URL("/resume", request.url));
  }
  const pdf = await readResume();
  const download = request.nextUrl.searchParams.has("download");
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="Nathan_Keith_Poernama_Resume.pdf"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
