"use client";

import React, { useState } from "react";
import type { Link as LinkModel } from "@prisma/client";
import { Section, SectionHeader } from "./shared";

function PlatformLink({ platform }: { platform: LinkModel }) {
  const [hover, setHover] = useState(false);
  const disabled = !platform.url || platform.url === "#";
  return (
    <a
      href={disabled ? undefined : platform.url}
      target={disabled ? undefined : "_blank"}
      rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "24px 20px",
        background: hover ? "var(--bg2)" : "var(--bg)",
        border: "1px solid",
        borderColor: hover ? "oklch(28% 0.015 30)" : "var(--border)",
        transition: "all 0.2s",
        textDecoration: "none",
        gap: "6px",
        cursor: disabled ? "default" : "pointer",
      }}
    >
      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: platform.color, marginBottom: "8px" }} />
      <div style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 500, color: hover ? "var(--text)" : "oklch(72% 0.01 60)" }}>{platform.name}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.06em", color: "var(--text-dimmer)" }}>{platform.handle}</div>
      <div style={{ marginTop: "8px", fontFamily: "var(--font-mono)", fontSize: "11px", color: hover && !disabled ? platform.color : "transparent", transition: "color 0.2s" }}>→</div>
    </a>
  );
}

export default function Links({ links }: { links: LinkModel[] }) {
  if (links.length === 0) return null;
  return (
    <Section id="links">
      <SectionHeader eyebrow="Official Links" title="Everywhere" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "2px" }}>
        {links.map((p) => (
          <PlatformLink key={p.id} platform={p} />
        ))}
      </div>
    </Section>
  );
}
