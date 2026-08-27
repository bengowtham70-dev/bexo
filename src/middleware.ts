export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/employer/:path*", "/admin/:path*"],
};
