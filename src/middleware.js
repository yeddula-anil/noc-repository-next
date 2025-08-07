// middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = {
  "/admin": ["admin"],
  "/hod": ["hod"],
  "/caretaker": ["caretaker"],
  "/student": ["student"],
};

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // Allow public paths
  if (pathname === "/" || pathname.startsWith("/api") || pathname === "/signin" || pathname === "/signup") {
    return NextResponse.next();
  }

  // No token -> redirect to signin
  if (!token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // Role-based route check
  for (const route in protectedRoutes) {
    if (pathname.startsWith(route)) {
      const allowedRoles = protectedRoutes[route];
      if (!allowedRoles.includes(token.roles)) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }
  }

  return NextResponse.next();
}

// Run middleware on these paths
export const config = {
  matcher: ["/admin/:path*", "/hod/:path*", "/caretaker/:path*", "/student/:path*"],
};
