"use client";

import React, { useState } from "react";
import type { Release } from "@prisma/client";

function hueOf(oklch: string): string {
  const nums = oklch.match(/[\d.]+/g);
  return nums && nums[2] ? nums[2] : "60";
}

function firstLink(r: Release): string | undefined {
  return (
    r.spotifyUrl ||
    r.appleUrl ||
    r.soundcloudUrl ||
    r.youtubeUrl ||
    r.bandcampUrl ||
    undefined
  );
}

function FeaturedCard({ release }: { release: Release }) {
  const [hover, setHover] = useState(false);
  const hue = hueOf(release.accentColor);
  const href = firstLink(release);
  const bg = release.coverImage
    ? "var(--bg2)"
    : `linear-gradient(135deg, oklch(16% 0.05 ${hue}), oklch(10% 0.02 30))`;

  const content = (
    <>
      {release.coverImage && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${release.coverImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.4,
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, oklch(8% 0.018 30 / 0.85), transparent)",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: release.accentColor,
            marginBottom: "8px",
          }}
        >
          {release.featuredType || "Featured"}
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(22px, 3vw, 32px)",
            fontWeight: 400,
            color: "var(--text)",
            marginBottom: "6px",
          }}
        >
          {release.title}
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--text-dimmer)",
            letterSpacing: "0.05em",
          }}
        >
          {release.genre}
        </div>
      </div>
    </>
  );

  const style: React.CSSProperties = {
    position: "relative",
    background: bg,
    padding: "40px 32px",
    minHeight: "200px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.3s",
    transform: hover ? "scale(1.01)" : "scale(1)",
    textDecoration: "none",
  };
  const handlers = { onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false) };

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={style} {...handlers}>
        {content}
      </a>
    );
  }
  return (
    <div style={style} {...handlers}>
      {content}
    </div>
  );
}

export default function Featured({
  releases,
  pressQuote,
  pressAttribution,
}: {
  releases: Release[];
  pressQuote: string;
  pressAttribution: string;
}) {
  if (releases.length === 0 && !pressQuote) return null;
  return (
    <div style={{ background: "var(--bg)", padding: "0 clamp(24px, 6vw, 80px)" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", paddingTop: "80px" }}>
        {releases.length > 0 && (
          <>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--gold)",
                marginBottom: "24px",
              }}
            >
              Featured
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "2px",
              }}
            >
              {releases.slice(0, 3).map((r) => (
                <FeaturedCard key={r.id} release={r} />
              ))}
            </div>
          </>
        )}
        {pressQuote && (
          <div
            style={{
              borderLeft: "2px solid var(--gold)",
              padding: "24px 32px",
              margin: "80px 0",
              background: "oklch(10% 0.018 30)",
            }}
          >
            <blockquote
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "clamp(20px, 2.5vw, 32px)",
                fontWeight: 300,
                color: "oklch(82% 0.01 60)",
                lineHeight: 1.4,
                marginBottom: "16px",
              }}
            >
              &ldquo;{pressQuote}&rdquo;
            </blockquote>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--gold)",
              }}
            >
              {pressAttribution}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
