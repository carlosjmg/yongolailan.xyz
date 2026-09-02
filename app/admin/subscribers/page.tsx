import { prisma } from "@/lib/prisma";
import { deleteSubscriber } from "../audience-actions";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";

export const dynamic = "force-dynamic";

function fmtDate(d: Date) {
  return new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function SubscribersPage() {
  const subs = await prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } });
  const allEmails = subs.map((s) => s.email).join(", ");

  return (
    <div>
      <h1 className="admin-h1">Subscribers</h1>
      <p className="admin-sub">Emails captured from the &ldquo;Stay connected&rdquo; box on the landing page.</p>

      {subs.length === 0 ? (
        <div className="admin-panel">No subscribers yet.</div>
      ) : (
        <>
          <div className="admin-panel" style={{ marginBottom: "16px" }}>
            <label className="admin-label">All emails ({subs.length}) — select all and copy</label>
            <textarea
              readOnly
              rows={3}
              value={allEmails}
              style={{
                width: "100%",
                marginTop: "8px",
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                padding: "10px",
                background: "var(--bg)",
                color: "var(--text-dim)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                resize: "vertical",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {subs.map((s) => (
              <div
                key={s.id}
                className="admin-panel"
                style={{ marginBottom: 0, display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}
              >
                <a href={`mailto:${s.email}`} style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--gold)", textDecoration: "none" }}>
                  {s.email}
                </a>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-dimmer)" }}>{fmtDate(s.createdAt)}</span>
                  <form action={deleteSubscriber.bind(null, s.id)}>
                    <ConfirmSubmit className="admin-btn admin-btn-sm" message={`Delete ${s.email}?`}>
                      Delete
                    </ConfirmSubmit>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
