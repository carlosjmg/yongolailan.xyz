"use client";

import { useState } from "react";

const INQUIRY_TYPES = ["Collaboration", "Licensing", "Distribution", "Press", "General"];

function ContactRow({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="cssound-contact-row">
      <div className="cssound-contact-row-label">{label}</div>
      <div className="cssound-contact-row-value">{value}</div>
    </a>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="cssound-contact-field-label">{label}</div>
      {children}
    </div>
  );
}

/**
 * The label's own contact section — the same shape as the main site's
 * Contact (direct info, inquiry types, a form), reskinned light for
 * Caribbean Sea Sound. Posts to the shared /api/contact endpoint; the
 * "Label — …" type prefix is what routes the notification email to the
 * label's own inbox instead of the main one (see app/api/contact/route.ts).
 */
export default function LabelContact({ email, phone, whatsappUrl }: { email: string; phone: string; whatsappUrl: string }) {
  const [form, setForm] = useState({ name: "", email: "", type: `Label — ${INQUIRY_TYPES[0]}`, message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please email directly.");
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <div className="cssound-contact-grid">
      <div>
        <div className="cssound-eyebrow" style={{ marginBottom: "22px" }}>
          Direct Contact
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "36px" }}>
          <ContactRow label="Email" value={email} href={`mailto:${email}`} />
          <ContactRow label="WhatsApp" value={phone} href={whatsappUrl} />
        </div>

        <div className="cssound-eyebrow" style={{ marginBottom: "16px" }}>
          Inquiry Types
        </div>
        <div className="cssound-contact-tags">
          {INQUIRY_TYPES.map((t) => (
            <span key={t} className="cssound-contact-tag">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div>
        <div className="cssound-eyebrow" style={{ marginBottom: "22px" }}>
          Send a Message
        </div>
        {status === "sent" ? (
          <div className="cssound-contact-sent">
            <div className="cssound-contact-sent-title">Message Received</div>
            <p style={{ fontSize: "14px", color: "var(--ink-soft)" }}>Thank you. We&apos;ll be in touch shortly.</p>
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Field label="Name">
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="cssound-contact-input"
              />
            </Field>
            <Field label="Email">
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                className="cssound-contact-input"
              />
            </Field>
            <Field label="Inquiry Type">
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="cssound-contact-input"
                style={{ cursor: "pointer" }}
              >
                {INQUIRY_TYPES.map((t) => (
                  <option key={t} value={`Label — ${t}`}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Message">
              <textarea
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us about your inquiry..."
                rows={5}
                className="cssound-contact-input"
                style={{ resize: "vertical", lineHeight: 1.6 }}
              />
            </Field>

            {status === "error" && <div className="cssound-contact-error">{error}</div>}

            <button type="submit" disabled={status === "sending"} className="cssound-contact-submit">
              {status === "sending" ? "Sending…" : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
