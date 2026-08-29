"use client";

import React, { useState } from "react";
import type { Photo } from "@prisma/client";
import { Section, SectionHeader } from "./shared";
import { toEmbedUrl } from "@/lib/video";
import ShowMore from "./ShowMore";

const PAGE_SIZE = 6;

// "Live" — a mixed gallery of performance photos and videos. Each item is a
// photo, unless it has a video link, in which case it plays inline. Titles sit
// below the media, matching the Films section.

const FALLBACK: { image: string; caption: string }[] = [
  { image: "/images/IMG_8117.webp", caption: "Live Performance" },
  { image: "/images/ICE.webp", caption: "Artist Photo" },
];

/** Title below the media — same type treatment as the Films cards. */
function ItemTitle({ text, size = 24 }: { text: string; size?: number }) {
  return (
    <h3
      style={{
        fontFamily: "var(--font-display)",
        // Admin-controlled, in px — a direct, predictable size.
        fontSize: `${size}px`,
        fontWeight: 400,
        color: "var(--text)",
        lineHeight: 1.2,
      }}
    >
      {text}
    </h3>
  );
}

// Same 16/9 box as the Films cards, so Live media matches them exactly.
const mediaBoxStyle: React.CSSProperties = {
  aspectRatio: "16 / 9",
  position: "relative",
  overflow: "hidden",
  background: "var(--bg2)",
  border: "1px solid var(--border)",
};

function LiveItem({ item, captionSize }: { item: Photo; captionSize: number }) {
  const embed = toEmbedUrl(item.videoUrl);
  const caption = item.caption || item.title || "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={mediaBoxStyle}>
        {embed ? (
          <iframe
            src={embed}
            title={caption || "Live performance"}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ width: "100%", height: "100%", border: 0, display: "block" }}
          />
        ) : item.videoUrl ? (
          // A video link we can't embed — open it in a new tab instead.
          <a
            href={item.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              textDecoration: "none",
              backgroundImage: item.image ? `url(${item.image})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                border: "1px solid var(--gold)",
                background: "oklch(8% 0.018 30 / 0.55)",
              }}
            >
              <span
                style={{
                  width: 0,
                  height: 0,
                  borderTop: "9px solid transparent",
                  borderBottom: "9px solid transparent",
                  borderLeft: "15px solid var(--gold)",
                  marginLeft: "4px",
                }}
              />
            </span>
          </a>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={caption}
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }}
          />
        )}
      </div>

      {caption && <ItemTitle text={caption} size={captionSize} />}
    </div>
  );
}

export default function Photos({
  photos,
  email,
  eyebrow,
  title,
  subtitle,
  captionSize = 24,
}: {
  photos: Photo[];
  email: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Admin-controlled desktop size (px) of the caption under each Live item. */
  captionSize?: number | string;
}) {
  void email;
  const cap = Math.min(60, Math.max(12, Number(captionSize) || 24));
  // An item needs either a photo or a video link to show anything.
  const items = photos.filter((p) => p.image || p.videoUrl);
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? items : items.slice(0, PAGE_SIZE);
  const hiddenCount = items.length - shown.length;

  return (
    <Section id="photos">
      <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "clamp(24px, 3vw, 40px)",
        }}
      >
        {items.length > 0
          ? shown.map((p) => <LiveItem key={p.id} item={p} captionSize={cap} />)
          : FALLBACK.map((f, i) => (
              <div
                key={i}
                style={{ display: "flex", flexDirection: "column", gap: "14px" }}
              >
                <div style={mediaBoxStyle}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.image} alt={f.caption} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} />
                </div>
                <ItemTitle text={f.caption} size={cap} />
              </div>
            ))}
      </div>

      <ShowMore expanded={expanded} hiddenCount={hiddenCount} onToggle={() => setExpanded((v) => !v)} />
    </Section>
  );
}
