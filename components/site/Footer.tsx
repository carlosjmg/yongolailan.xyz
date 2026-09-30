"use client";

import React from "react";

export default function Footer({
  logo = "/images/Yongo-logo-blanco.webp",
}: {
  logo?: string;
}) {
  return (
    <footer style={{ background: "oklch(6% 0.018 30)", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 24px", textAlign: "center" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt="Yongolailan" style={{ height: "22px", opacity: 0.8, margin: "0 auto 14px", display: "block" }} />
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.12em", color: "var(--text-dimmer)" }}>
          ® All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
