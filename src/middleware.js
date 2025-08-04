import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {},
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // ✅ Skip auth check for caretaker routes
        if (pathname.startsWith("/caretaker")) {
          return true;
        }

        if (!token) return false;

        // Student routes
        if (pathname.startsWith("/student") && token.roles.includes("student")) return true;

        // DSW routes
        if (pathname.startsWith("/dsw") && token.roles.includes("dsw")) return true;

        // Dean routes
        if (pathname.startsWith("/dean") && token.roles.includes("dean")) return true;

        // Director routes
        if (pathname.startsWith("/director") && token.roles.includes("director")) return true;

        return false; // otherwise unauthorized
      },
    },
    pages: {
      signIn: "/auth/login",
      error: "/unauthorized",
    },
  }
);

// Protect only these folders
export const config = {
  matcher: ["/student/:path*", "/caretaker/:path*", "/dsw/:path*", "/dean/:path*", "/director/:path*"],
};
