import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  const isAuthPage = path.startsWith("/auth");
  const isHomePage = path === "/"; // ✅ protected route is `/`

  // 🟡 Not logged in
  if (!token) {
    // Allow access to `/auth` (login/signup)
    if (isAuthPage) return NextResponse.next();

    // Block access to `/` if not logged in → send to `/auth`
    if (isHomePage) {
      return NextResponse.redirect(new URL("/auth", req.url));
    }

    return NextResponse.next();
  }

  // 🟢 Logged in
  // If user tries to open `/auth` → redirect to home
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/:path*"], // ✅ protect `/` and allow `/auth`
};
