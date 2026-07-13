import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export interface AdminSession {
  isAdmin?: boolean;
}

const password =
  process.env.SESSION_SECRET ||
  "insecure-development-session-secret-please-change-32chars";

export const sessionOptions: SessionOptions = {
  password,
  cookieName: "yongo_admin",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  },
};

export async function getSession() {
  return getIronSession<AdminSession>(cookies(), sessionOptions);
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session.isAdmin === true;
}
