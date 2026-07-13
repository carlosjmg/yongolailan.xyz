import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { isEmailConfigured } from "@/lib/email";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [releases, portfolio, videos, games, photos, links, subscribers, unread] = await Promise.all([
    prisma.release.count(),
    prisma.portfolioItem.count(),
    prisma.video.count(),
    prisma.game.count(),
    prisma.photo.count(),
    prisma.link.count(),
    prisma.subscriber.count(),
    prisma.contactMessage.count({ where: { read: false } }),
  ]);

  const stats: { href: string; num: number | string; label: string }[] = [
    { href: "/admin/catalog", num: releases, label: "Releases" },
    { href: "/admin/portfolio", num: portfolio, label: "Portfolio items" },
    { href: "/admin/videos", num: videos, label: "Videos" },
    { href: "/admin/games", num: games, label: "Games" },
    { href: "/admin/photos", num: photos, label: "Photos" },
    { href: "/admin/links", num: links, label: "Links" },
    { href: "/admin/newsletter", num: subscribers, label: "Subscribers" },
    { href: "/admin/messages", num: unread, label: "Unread messages" },
  ];

  const emailOn = isEmailConfigured();
  const blobOn = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  return (
    <div>
      <h1 className="admin-h1">Dashboard</h1>
      <p className="admin-sub">Manage everything on your site — no code required.</p>

      {(!emailOn || !blobOn) && (
        <div className="admin-note">
          <strong>Local preview mode.</strong>{" "}
          {!emailOn && "Emails are logged to the terminal instead of sent. "}
          {!blobOn && "Uploads are saved locally. "}
          Both switch on automatically once the site is deployed with its keys.
        </div>
      )}

      <div className="admin-grid">
        {stats.map((s) => (
          <Link key={s.href} href={s.href} className="admin-stat">
            <div className="num">{s.num}</div>
            <div className="lbl">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="admin-panel" style={{ marginTop: "28px" }}>
        <div className="admin-label" style={{ marginBottom: "14px" }}>Quick actions</div>
        <div className="admin-row-actions">
          <Link href="/admin/catalog/new" className="admin-btn admin-btn-primary">+ Add release</Link>
          <Link href="/admin/photos/new" className="admin-btn">+ Upload photo</Link>
          <Link href="/admin/videos/new" className="admin-btn">+ Add video</Link>
          <Link href="/admin/games/new" className="admin-btn">+ Add game</Link>
          <Link href="/admin/newsletter" className="admin-btn">Write newsletter</Link>
          <Link href="/admin/availability" className="admin-btn">Show / hide sections</Link>
        </div>
      </div>
    </div>
  );
}
