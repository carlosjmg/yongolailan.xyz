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
  logo = "/images/Yongo-logo-blanco.webp",
}: {
  photos: Photo[];
  email: string;
  logo?: string;
}) {
  const large =
    photos.length > 0
      ? photos.map((p) => ({ image: p.image, caption: p.caption || p.title || "", category: p.category }))
      : FALLBACK;

  return (
    <Section id="photos">
      <SectionHeader
        eyebrow="Visual Assets"
        title="Photos & Branding"
        subtitle="High-resolution press photos, logos, and branding assets for editorial and promotional use."
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

        {/* Branding / logo presentation tiles */}
        {["White Logo", "Black Logo", "Gold Version", "Minimal"].map((v, i) => (
          <div
            key={v}
            style={{
              aspectRatio: "4/3",
              background: i % 2 === 0 ? "var(--bg2)" : "var(--bg3)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              border: "1px solid var(--border)",
              padding: "20px",
            }}
          >
            {i === 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt="Logo white" style={{ maxWidth: "80%", maxHeight: "60px", objectFit: "contain", opacity: 0.9 }} />
            ) : (
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "22px",
                  color: i === 2 ? "var(--gold)" : i === 3 ? "var(--text-dimmer)" : "oklch(8% 0.018 30)",
                  background: i === 1 ? "var(--text)" : "none",
                  padding: i === 1 ? "6px 16px" : "0",
                  borderRadius: "1px",
                }}
              >
                Yongolailan
              </div>
            )}
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-dimmer)" }}>{v}</span>
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
