import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token as unknown as { role?: string } | undefined;
    const role = token?.role;
    const path = req.nextUrl.pathname;
    if (path.startsWith("/admin") && role !== "ADMIN" && role !== "MODERATOR") {
      return new NextResponse(JSON.stringify({ error: "Forbidden — ADMIN only" }), { status: 403, headers: { "content-type": "application/json" } });
    }
    if (path.startsWith("/employer") && role === "CANDIDATE") {
      return new NextResponse(JSON.stringify({ error: "Forbidden — EMPLOYER only" }), { status: 403, headers: { "content-type": "application/json" } });
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: ["/dashboard/:path*", "/employer/:path*", "/admin/:path*"],
};
