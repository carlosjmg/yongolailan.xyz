"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/actions";

const GROUPS: { label: string; items: { href: string; label: string }[] }[] = [
  {
    label: "Content",
    items: [
      { href: "/admin/catalog", label: "Catalog / Music" },
      { href: "/admin/videos", label: "Videos" },
      { href: "/admin/games", label: "Games" },
      { href: "/admin/photos", label: "Live" },
      { href: "/admin/links", label: "Links" },
      { href: "/admin/merch", label: "Merch" },
      { href: "/admin/awards", label: "Awards" },
    ],
  },
  {
    label: "Caribbean Sea Sound",
    items: [
      { href: "/admin/label-artists", label: "Artists" },
      { href: "/admin/label-productions", label: "Productions" },
    ],
  },
  {
    label: "Site",
    items: [
      { href: "/admin/settings", label: "Home & Hero" },
      { href: "/admin/about", label: "About & Bio" },
      { href: "/admin/sections", label: "Section Titles" },
      { href: "/admin/availability", label: "Availability" },
    ],
  },
  {
    label: "Landing Pages",
    items: [
      { href: "/admin/landing-pages/just-another-day", label: "Just Another Day" },
    ],
  },
  {
    label: "Audience",
    items: [
      { href: "/admin/messages", label: "Messages" },
      { href: "/admin/subscribers", label: "Subscribers" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || (href !== "/admin" && pathname.startsWith(href));

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        Yongolailan
        <small>Admin</small>
      </div>

      <Link href="/admin" className={`admin-navlink ${pathname === "/admin" ? "active" : ""}`}>
        Dashboard
      </Link>

      {GROUPS.map((g) => (
        <div key={g.label}>
          <div className="admin-navgroup">{g.label}</div>
          {g.items.map((item) => (
            <Link key={item.href} href={item.href} className={`admin-navlink ${isActive(item.href) ? "active" : ""}`}>
              {item.label}
            </Link>
          ))}
        </div>
      ))}

      <div style={{ marginTop: "auto", padding: "20px 22px 0" }}>
        <Link href="/" target="_blank" className="admin-navlink" style={{ padding: 0, marginBottom: "14px" }}>
          View site ↗
        </Link>
        <form action={logout}>
          <button type="submit" className="admin-btn admin-btn-sm" style={{ width: "100%", justifyContent: "center" }}>
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
