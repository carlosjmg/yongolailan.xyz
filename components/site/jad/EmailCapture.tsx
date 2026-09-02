"use client";

import { useState } from "react";

/** Discreet, no-popup email capture. Posts to /api/subscribe. */
export default function EmailCapture({ heading }: { heading: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const r = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "just-another-day" }),
      });
      setStatus(r.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="jad-email">
      <div className="jad-email-heading">{heading}</div>
      {status === "done" ? (
        <div className="jad-email-done">Thanks — you&rsquo;re on the list.</div>
      ) : (
        <form className="jad-email-form" onSubmit={submit}>
          <input
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email address"
          />
          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "…" : "Notify me"}
          </button>
        </form>
      )}
      {status === "error" && <div className="jad-email-error">Please try again.</div>}
    </div>
  );
}
