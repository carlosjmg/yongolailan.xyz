import { prisma } from "@/lib/prisma";
import { isEmailConfigured } from "@/lib/email";
import { sendCampaign, deleteSubscriber } from "../audience-actions";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";

export const dynamic = "force-dynamic";

function fmtDate(d: Date) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default async function NewsletterPage({ searchParams }: { searchParams: { sent?: string; error?: string } }) {
  const [subscribers, campaigns] = await Promise.all([
    prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.campaign.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
  ]);

  const emailOn = isEmailConfigured();

  return (
    <div>
      <h1 className="admin-h1">Newsletter</h1>
      <p className="admin-sub">{subscribers.length} subscriber{subscribers.length === 1 ? "" : "s"}.</p>

      {searchParams?.sent && <div className="admin-note">Sent to {searchParams.sent} subscriber(s).</div>}
      {searchParams?.error === "empty" && <div className="admin-error" style={{ marginBottom: "16px" }}>Add a subject and a message first.</div>}
      {!emailOn && (
        <div className="admin-note">
          Email sending isn&apos;t configured yet. Composing works now; add your Resend key on deploy to actually send.
        </div>
      )}

      {/* Compose */}
      <form action={sendCampaign} className="admin-panel" style={{ maxWidth: "700px" }}>
        <div className="admin-label" style={{ marginBottom: "14px", fontSize: "12px", color: "var(--gold)" }}>Write a newsletter</div>
        <div className="admin-field">
          <label className="admin-label" htmlFor="subject">Subject</label>
          <input id="subject" name="subject" className="admin-input" placeholder="New single out now" required />
        </div>
        <div className="admin-field">
          <label className="admin-label" htmlFor="body">Message</label>
          <textarea id="body" name="body" className="admin-textarea" rows={8} placeholder="Write your update here. Basic HTML works — <b>bold</b>, <a href='...'>links</a>, <br> for line breaks." required />
          <div className="admin-help">Basic HTML is supported. An unsubscribe link is added automatically.</div>
        </div>
        <ConfirmSubmit
          className="admin-btn admin-btn-primary"
          message={`Send this newsletter to ${subscribers.length} subscriber(s)?`}
        >
          Send to {subscribers.length} subscriber{subscribers.length === 1 ? "" : "s"}
        </ConfirmSubmit>
      </form>

      {/* Sent history */}
      {campaigns.length > 0 && (
        <>
          <h2 className="admin-label" style={{ margin: "32px 0 12px", fontSize: "12px" }}>Recent sends</h2>
          <div className="admin-panel" style={{ padding: 0, overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Recipients</th>
                  <th>Sent</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id}>
                    <td>{c.subject}</td>
                    <td>{c.recipients}</td>
                    <td>{c.sentAt ? fmtDate(c.sentAt) : c.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Subscribers */}
      <h2 className="admin-label" style={{ margin: "32px 0 12px", fontSize: "12px" }}>Subscribers</h2>
      {subscribers.length === 0 ? (
        <div className="admin-panel">No subscribers yet. The signup form on your site adds them here.</div>
      ) : (
        <div className="admin-panel" style={{ padding: 0, overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.id}>
                  <td>{s.email}</td>
                  <td>{fmtDate(s.createdAt)}</td>
                  <td>
                    <form action={deleteSubscriber.bind(null, s.id)}>
                      <ConfirmSubmit className="admin-btn admin-btn-sm admin-btn-danger" message={`Remove ${s.email}?`}>
                        Remove
                      </ConfirmSubmit>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
