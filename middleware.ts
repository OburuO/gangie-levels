import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type {  NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const PUBLIC_FILE = /\.(.*)$/;
  // Token will exist if the user is logged in
  const token = await getToken({
    req,
    secret: process.env.JWT_SECRET
  });
  const { pathname } = req.nextUrl;
  // Allow the requests if the following are true...
  // 1) It's a request for next-auth session & provider fetching
  // 2) The token exists
  // 3) Request info pages
  if (pathname.includes("/api/auth") || pathname.includes("/@info") || token || PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  };
  // Redirect them to login if they dont have token & are requesting a protected route
  if (!token && pathname !== "/auth/signin") {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  };
};
