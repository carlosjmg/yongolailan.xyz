"use client";

import React, { useState } from "react";
import type { Release } from "@prisma/client";
import { SectionFullWidth, SectionHeader } from "./shared";

const PLATFORMS: { key: keyof Release; label: string }[] = [
  { key: "spotifyUrl", label: "Spotify" },
  { key: "appleUrl", label: "Apple" },
  { key: "soundcloudUrl", label: "SC" },
  { key: "youtubeUrl", label: "YT" },
  { key: "bandcampUrl", label: "BC" },
];

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

function CatalogCard({ release }: { release: Release }) {
  const [hover, setHover] = useState(false);
  const listen = firstLink(release);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "var(--bg)",
        border: "1px solid",
        borderColor: hover ? "oklch(30% 0.015 30)" : "var(--border)",
        transition: "border-color 0.3s",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Cover art */}
      <div
        style={{
          aspectRatio: "1",
          background: "linear-gradient(135deg, oklch(14% 0.03 60) 0%, oklch(10% 0.015 30) 100%)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {release.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={release.coverImage}
            alt={release.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <>
            <div
              style={{
                width: "80px",
                height: "80px",
                border: `1px solid ${release.accentColor}`,
                borderRadius: "50%",
                opacity: hover ? 0.6 : 0.3,
                transition: "opacity 0.3s",
                position: "absolute",
              }}
            />
            <div
              style={{
                width: "40px",
                height: "40px",
                border: `1px solid ${release.accentColor}`,
                opacity: hover ? 0.4 : 0.2,
                transition: "opacity 0.3s",
                position: "absolute",
                transform: "rotate(45deg)",
              }}
            />
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: release.accentColor,
                opacity: 0.6,
                position: "absolute",
                bottom: "12px",
                left: "12px",
              }}
            >
              cover art
            </div>
          </>
        )}
        {listen && (
          <a
            href={listen}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Listen to ${release.title}`}
            style={{
              position: "absolute",
              inset: 0,
              background: "oklch(8% 0.018 30 / 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: hover ? 1 : 0,
              transition: "opacity 0.3s",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                border: `1px solid ${release.accentColor}`,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderTop: "9px solid transparent",
                  borderBottom: "9px solid transparent",
                  borderLeft: `16px solid ${release.accentColor}`,
                  marginLeft: "4px",
                }}
              />
            </div>
          </a>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "20px 20px 24px", flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(18px, 1.8vw, 22px)",
              fontWeight: 400,
              color: "var(--text)",
              lineHeight: 1.1,
            }}
          >
            {release.title}
          </h3>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "var(--text-dimmer)",
              letterSpacing: "0.1em",
              flexShrink: 0,
              paddingTop: "4px",
            }}
          >
            {release.year}
          </span>
        </div>

        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: release.accentColor,
          }}
        >
          {release.genre}
        </div>

        <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--text-dim)", lineHeight: 1.6 }}>
          {release.description}
        </p>

        {release.credits && (
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "var(--text-dimmer)",
              borderTop: "1px solid var(--border)",
              paddingTop: "12px",
              marginTop: "4px",
            }}
          >
            {release.credits}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", marginTop: "12px" }}>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {PLATFORMS.filter((p) => release[p.key]).map((p) => (
              <a
                key={p.label}
                href={release[p.key] as string}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "5px 9px",
                  border: "1px solid var(--border)",
                  color: "var(--text-dim)",
                  borderRadius: "2px",
                  textDecoration: "none",
                }}
              >
                {p.label}
              </a>
            ))}
          </div>
          {listen && (
            <a
              href={listen}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                padding: "8px 14px",
                background: hover ? release.accentColor : "transparent",
                color: hover ? "oklch(8% 0.018 30)" : release.accentColor,
                border: `1px solid ${release.accentColor}`,
                borderRadius: "2px",
                transition: "all 0.2s",
                fontWeight: 500,
                flexShrink: 0,
                textDecoration: "none",
              }}
            >
              Listen →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Catalog({ releases }: { releases: Release[] }) {
  const genres = ["All", ...Array.from(new Set(releases.map((r) => r.genre)))];
  const [filter, setFilter] = useState("All");
  const shown = releases.filter((r) => filter === "All" || r.genre === filter);

  return (
    <SectionFullWidth id="catalog" dark>
      <SectionHeader
        eyebrow="Discography"
        title="Catalog"
        subtitle="A growing archive of electronic ritual music rooted in Afro-Caribbean tradition."
      />

      {genres.length > 2 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "40px" }}>
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setFilter(g)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "7px 16px",
                border: "1px solid",
                borderColor: filter === g ? "var(--gold)" : "var(--border)",
                borderRadius: "2px",
                background: filter === g ? "oklch(72% 0.16 60 / 0.12)" : "transparent",
                color: filter === g ? "var(--gold)" : "var(--text-dimmer)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {g}
            </button>
          ))}
        </div>
      )}

      <div className="catalog-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(260px, 1fr))", gap: "2px" }}>
        {shown.map((r) => (
          <CatalogCard key={r.id} release={r} />
        ))}
      </div>
    </SectionFullWidth>
  );
}
