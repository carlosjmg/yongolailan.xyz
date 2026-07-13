"use client";

import React, { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not subscribe. Please try again.");
      setStatus("done");
      setMessage(data.message || "You're on the list. Welcome.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <div style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "clamp(56px, 7vw, 88px) clamp(24px, 6vw, 80px)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "40px",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "16px" }}>
            Newsletter
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 300, lineHeight: 1.05, color: "var(--text)", letterSpacing: "-0.01em", marginBottom: "14px" }}>
            New music, shows & drops
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--text-dim)", lineHeight: 1.7, maxWidth: "440px" }}>
            Releases, live sessions, and special art — straight to your inbox. No noise, unsubscribe anytime.
          </p>
        </div>

        <div>
          {status === "done" ? (
            <div style={{ padding: "28px 24px", border: "1px solid var(--gold)", borderRadius: "2px" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "24px", color: "var(--gold)", marginBottom: "8px" }}>Subscribed</div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--text-dim)" }}>{message}</p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{
                    flex: 1,
                    minWidth: "220px",
                    padding: "14px 16px",
                    background: "var(--bg2)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                    borderRadius: "2px",
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  disabled={status === "sending"}
                  style={{
                    padding: "14px 28px",
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
                    opacity: status === "sending" ? 0.7 : 1,
                  }}
                >
                  {status === "sending" ? "…" : "Subscribe"}
                </button>
              </div>
              {status === "error" && (
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "oklch(65% 0.18 25)" }}>{message}</div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
