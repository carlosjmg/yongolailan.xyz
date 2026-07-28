"use client";

import React from "react";
import type { Photo } from "@prisma/client";
import { CTAButton, Section, SectionHeader } from "./shared";

const FALLBACK: { image: string; caption: string; category: string }[] = [
  { image: "/images/IMG_8117.webp", caption: "Live Performance · Press Photo", category: "press" },
  { image: "/images/ICE.webp", caption: "Artist Photo · Press Ready", category: "artist" },
];

export default function Photos({
  photos,
  email,
  eyebrow,
  title,
  subtitle,
}: {
  photos: Photo[];
  email: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  const large =
    photos.length > 0
      ? photos.map((p) => ({ image: p.image, caption: p.caption || p.title || "", category: p.category }))
      : FALLBACK;

  return (
    <Section id="photos">
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "2px", marginBottom: "40px" }}>
        {large.map((p, i) => (
          <div key={i} className="photo-wide" style={{ gridColumn: "span 2", aspectRatio: "16/10", position: "relative", overflow: "hidden", background: "var(--bg2)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} alt={p.caption} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} />
            {p.caption && (
              <div
                style={{
                  position: "absolute",
                  bottom: "12px",
                  left: "12px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--text-dim)",
                  background: "oklch(8% 0.018 30 / 0.7)",
                  padding: "4px 8px",
                }}
              >
                {p.caption}
              </div>
            )}
          </div>
        ))}

      </div>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <CTAButton label="Request High-Res Photos" href={`mailto:${email}?subject=High-Res Photos Request`} />
        <CTAButton label="Request Branding Kit" href={`mailto:${email}?subject=Branding Kit Request`} />
      </div>
    </Section>
  );
}
