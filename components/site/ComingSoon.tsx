import React from "react";

export default function ComingSoon({
  id,
  eyebrow,
  title,
  subtitle,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  void subtitle;
  return (
    <div id={id} data-section style={{ background: "var(--bg)" }}>
      <div style={{ padding: "clamp(72px, 8vw, 112px) clamp(20px, 6vw, 80px)", maxWidth: "1400px", margin: "0 auto" }}>
        {eyebrow && (
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "14px" }}>
            {eyebrow}
          </div>
        )}
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 72px)", fontWeight: 300, lineHeight: 1, color: "var(--text)", letterSpacing: "-0.01em" }}>
          {title}
        </h2>
        <div
          style={{
            marginTop: "32px",
            padding: "clamp(50px, 7vw, 90px) 20px",
            border: "1px solid var(--border)",
            textAlign: "center",
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 300,
            color: "oklch(25% 0.015 30)",
          }}
        >
          Coming Soon
        </div>
      </div>
    </div>
  );
}
