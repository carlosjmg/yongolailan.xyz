import "./admin.css";
import type { Metadata } from "next";
import { isAuthenticated } from "@/lib/session";
import Sidebar from "@/components/admin/Sidebar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAuthenticated();

  if (!authed) {
    // Unauthenticated visitors only ever see the login page (middleware
    // redirects everything else here).
    return <div className="admin-login">{children}</div>;
  }

  return (
    <div className="admin-shell">
      <Sidebar />
      <main className="admin-main">{children}</main>
    </div>
  );
}
