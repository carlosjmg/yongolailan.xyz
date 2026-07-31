"use client";

import React, { useState } from "react";
import type { Link as LinkModel } from "@prisma/client";
import { Section, SectionHeader } from "./shared";
import PlatformIcon from "./PlatformIcon";

// Borderless logo row — each platform is just its mark, which lifts and picks
// up its brand colour on hover. No cards, no boxes.
function PlatformLink({ platform }: { platform: LinkModel }) {
  const [hover, setHover] = useState(false);
  const disabled = !platform.url || platform.url === "#";
  const active = hover && !disabled;

  return (
    <a
      href={disabled ? undefined : platform.url}
      target={disabled ? undefined : "_blank"}
      rel="noopener noreferrer"
      title={platform.handle ? `${platform.name} — ${platform.handle}` : platform.name}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "44px",
        minHeight: "44px",
        color: active ? platform.color : "oklch(72% 0.01 60)",
        opacity: active ? 1 : 0.75,
        transform: active ? "translateY(-3px)" : "none",
        transition: "color 0.25s, opacity 0.25s, transform 0.25s",
        textDecoration: "none",
        cursor: disabled ? "default" : "pointer",
      }}
    >
      <PlatformIcon name={platform.name} size={30} />
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
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "clamp(26px, 4vw, 48px)",
          paddingTop: "8px",
        }}
      >
        {links.map((p) => (
          <PlatformLink key={p.id} platform={p} />
        ))}
      </div>
    </Section>
  );
}
