import { prisma } from "@/lib/prisma";
import { markMessage, deleteMessage } from "../audience-actions";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";

export const dynamic = "force-dynamic";

function fmtDate(d: Date) {
  return new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="admin-h1">Messages</h1>
      <p className="admin-sub">Inquiries from your contact form.</p>

      {messages.length === 0 ? (
        <div className="admin-panel">No messages yet.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {messages.map((m) => (
            <div
              key={m.id}
              className="admin-panel"
              style={{ marginBottom: 0, borderLeft: m.read ? "1px solid var(--border)" : "3px solid var(--gold)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", marginBottom: "8px" }}>
                <div>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--text)", fontWeight: 500 }}>{m.name}</span>
                  <span className="admin-tag" style={{ marginLeft: "10px" }}>{m.type}</span>
                  {!m.read && <span className="admin-tag soon" style={{ marginLeft: "6px" }}>New</span>}
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-dimmer)" }}>{fmtDate(m.createdAt)}</span>
              </div>
              <a href={`mailto:${m.email}`} style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--gold)", textDecoration: "none" }}>
                {m.email}
              </a>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--text-dim)", lineHeight: 1.7, marginTop: "10px", whiteSpace: "pre-wrap" }}>
                {m.message}
              </p>
              <div className="admin-row-actions" style={{ marginTop: "14px" }}>
                <a href={`mailto:${m.email}?subject=Re: your ${m.type} inquiry`} className="admin-btn admin-btn-sm admin-btn-primary">Reply</a>
                <form action={markMessage.bind(null, m.id, !m.read)}>
                  <button type="submit" className="admin-btn admin-btn-sm">{m.read ? "Mark unread" : "Mark read"}</button>
                </form>
                <form action={deleteMessage.bind(null, m.id)}>
                  <ConfirmSubmit className="admin-btn admin-btn-sm admin-btn-danger" message="Delete this message?">
                    Delete
                  </ConfirmSubmit>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
