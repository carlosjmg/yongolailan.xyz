"use client";

import React, { useState } from "react";
import type { Link as LinkModel } from "@prisma/client";
import { Section, SectionHeader } from "./shared";
import PlatformIcon from "./PlatformIcon";

function PlatformLink({ platform }: { platform: LinkModel }) {
  const [hover, setHover] = useState(false);
  const disabled = !platform.url || platform.url === "#";

  return (
    <a
      href={disabled ? undefined : platform.url}
      target={disabled ? undefined : "_blank"}
      rel="noopener noreferrer"
      title={platform.name}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "26px 20px",
        background: hover ? "var(--bg2)" : "var(--bg)",
        border: "1px solid",
        borderColor: hover ? "oklch(28% 0.015 30)" : "var(--border)",
        transition: "all 0.2s",
        textDecoration: "none",
        gap: "10px",
        cursor: disabled ? "default" : "pointer",
      }}
    >
      {/* Brand logo — takes the place of the platform name. */}
      <div
        style={{
          color: hover && !disabled ? platform.color : "oklch(80% 0.01 60)",
          transition: "color 0.2s",
          minHeight: "28px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <PlatformIcon name={platform.name} size={28} />
      </div>

      {platform.handle && (
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.06em", color: "var(--text-dimmer)" }}>
          {platform.handle}
        </div>
      )}

      <div
        style={{
          marginTop: "2px",
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          color: hover && !disabled ? platform.color : "transparent",
          transition: "color 0.2s",
        }}
      >
        →
      </div>
    </a>
  );
}

export default function Links({
  links,
  eyebrow,
  title,
  subtitle,
}: {
  links: LinkModel[];
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  if (links.length === 0) return null;
  return (
    <Section id="links">
      <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "2px" }}>
        {links.map((p) => (
          <PlatformLink key={p.id} platform={p} />
        ))}
      </div>
    </Section>
  );
}
