"use client";

import React, { useState } from "react";
import { EyebrowLabel, SectionFullWidth, SectionHeader } from "./shared";

const INQUIRY_TYPES = [
  "booking",
  "press",
  "collaborations",
  "licensing",
  "sound design",
  "DJ sets",
  "live performance",
  "general",
];

function ContactInfoRow({ label, value, href }: { label: string; value: string; href: string }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "block",
        padding: "16px 20px",
        background: hover ? "var(--bg3)" : "var(--bg)",
        border: "1px solid",
        borderColor: hover ? "oklch(30% 0.015 30)" : "var(--border)",
        transition: "all 0.2s",
        textDecoration: "none",
      }}
    >
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "6px" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: hover ? "var(--text)" : "var(--text-dim)" }}>{value}</div>
    </a>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-dimmer)", marginBottom: "8px" }}>{label}</div>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  background: "var(--bg)",
  border: "1px solid var(--border)",
  color: "var(--text)",
  borderRadius: "2px",
  fontFamily: "var(--font-body)",
  fontSize: "13px",
  outline: "none",
};

export default function Contact({
  email,
  whatsapp,
  whatsappUrl,
  labelName,
  labelLocation,
}: {
  email: string;
  whatsapp: string;
  whatsappUrl: string;
  labelName: string;
  labelLocation: string;
}) {
  const [form, setForm] = useState({ name: "", email: "", type: "booking", message: "" });
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
    <SectionFullWidth id="contact" dark>
      <SectionHeader
        eyebrow="Booking & Press"
        title="Get in Touch"
        subtitle="Open to bookings, collaborations, press, and live performance inquiries worldwide."
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "60px" }}>
        <div>
          <EyebrowLabel>Direct Contact</EyebrowLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "40px" }}>
            <ContactInfoRow label="Email" value={email} href={`mailto:${email}`} />
            <ContactInfoRow label="WhatsApp / Booking" value={whatsapp} href={whatsappUrl} />
          </div>

          <EyebrowLabel>Inquiry Types</EyebrowLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "40px" }}>
            {INQUIRY_TYPES.map((t) => (
              <span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", padding: "7px 14px", border: "1px solid var(--border)", color: "var(--text-dim)", borderRadius: "2px" }}>
                {t}
              </span>
            ))}
          </div>

          <EyebrowLabel>Label</EyebrowLabel>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--text-dim)", lineHeight: 1.7 }}>
            {labelName}
            <br />
            {labelLocation}
            <br />
            For label-related inquiries, use the same contact above.
          </p>
        </div>

        <div>
          <EyebrowLabel>Send a Message</EyebrowLabel>
          {status === "sent" ? (
            <div style={{ padding: "40px", border: "1px solid var(--gold)", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: "var(--gold)", marginBottom: "12px" }}>Message Received</div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--text-dim)" }}>Thank you. We&apos;ll be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Field label="Name">
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" style={inputStyle} />
              </Field>
              <Field label="Email">
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" style={inputStyle} />
              </Field>
              <Field label="Inquiry Type">
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={{ ...inputStyle, cursor: "pointer", appearance: "none" }}>
                  {INQUIRY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Message">
                <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your inquiry..." rows={5} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
              </Field>

              {status === "error" && (
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "oklch(65% 0.18 25)" }}>{error}</div>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                style={{
                  padding: "14px 32px",
                  background: "var(--gold)",
                  border: "none",
                  color: "oklch(8% 0.018 30)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  cursor: status === "sending" ? "default" : "pointer",
                  fontWeight: 500,
                  borderRadius: "2px",
                  alignSelf: "flex-start",
                  opacity: status === "sending" ? 0.7 : 1,
                }}
              >
                {status === "sending" ? "Sending…" : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </SectionFullWidth>
  );
}
