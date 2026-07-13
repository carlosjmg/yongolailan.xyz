import { NextResponse, type NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, type AdminSession } from "@/lib/session";

// Protect everything under /admin (except the login page itself).
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const session = await getIronSession<AdminSession>(req, res, sessionOptions);
  const { pathname } = req.nextUrl;
  const isLogin = pathname === "/admin/login";

  if (!session.isAdmin && !isLogin) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  if (session.isAdmin && isLogin) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
