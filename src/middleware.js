// middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = {
  "/caretaker": ["CARETAKER"],
  "/hod": ["HOD"],
  "/student": ["STUDENT"],
  "/dsw": ["DSW"],
};

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // 1. Redirect from "/" based on role if logged in
  if (pathname === "/") {
    console.log("Token inside middleware:", token);

    if (!token) {
      return NextResponse.next();
    }

    const role = token.role?.toUpperCase();
    if (role === "CARETAKER") {
      return NextResponse.redirect(new URL("/caretaker", req.url));
    } else if (role === "HOD") {
      return NextResponse.redirect(new URL("/hod", req.url));
    }
    else if (role === "STUDENT") {
      return NextResponse.redirect(new URL("/student", req.url));
    } else {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  // 2. Allow public paths
  if (
    pathname.startsWith("/api") ||
    pathname === "/signin" ||
    pathname === "/signup"
    
    
  ) {
    return NextResponse.next();
  }

  // 3. Require login for protected paths
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 4. Role-based protection
  for (const route in protectedRoutes) {
    if (pathname.startsWith(route)) {
      const allowedRoles = protectedRoutes[route];
      const userRole = token.role?.toUpperCase();
      if (!allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/", 
    "/signin", 
    "/signup",
    "/student/:path*", 
    "/caretaker/:path*", 
    "/hod/:path*", 
    "/dsw/:path*"
  ],
};
