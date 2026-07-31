"use client";

import React from "react";
import type { Photo } from "@prisma/client";
import { Section, SectionHeader } from "./shared";
import { toEmbedUrl } from "@/lib/video";

// "Live Performance" — a mixed gallery of performance photos and videos.
// Each item is a photo, unless it has a video link, in which case it plays
// inline.

const FALLBACK: { image: string; caption: string }[] = [
  { image: "/images/IMG_8117.webp", caption: "Live Performance" },
  { image: "/images/ICE.webp", caption: "Artist Photo" },
];

function Caption({ text }: { text: string }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "12px",
        left: "12px",
        right: "12px",
        fontFamily: "var(--font-mono)",
        fontSize: "9px",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "var(--text-dim)",
        background: "oklch(8% 0.018 30 / 0.7)",
        padding: "4px 8px",
        pointerEvents: "none",
      }}
    >
      {text}
    </div>
  );
}

function LiveItem({ item }: { item: Photo }) {
  const embed = toEmbedUrl(item.videoUrl);
  const caption = item.caption || item.title || "";

  return (
    <div
      className="photo-wide"
      style={{
        gridColumn: "span 2",
        aspectRatio: "16/10",
        position: "relative",
        overflow: "hidden",
        background: "var(--bg2)",
        border: "1px solid var(--border)",
      }}
    >
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
      {caption && !embed && <Caption text={caption} />}
      {caption && embed && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--text-dim)",
            background: "oklch(8% 0.018 30 / 0.85)",
            padding: "6px 10px",
            pointerEvents: "none",
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
}

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
  void email;
  // An item needs either a photo or a video link to show anything.
  const items = photos.filter((p) => p.image || p.videoUrl);

  return (
    <Section id="photos">
      <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "2px" }}>
        {items.length > 0
          ? items.map((p) => <LiveItem key={p.id} item={p} />)
          : FALLBACK.map((f, i) => (
              <div
                key={i}
                className="photo-wide"
                style={{
                  gridColumn: "span 2",
                  aspectRatio: "16/10",
                  position: "relative",
                  overflow: "hidden",
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.image} alt={f.caption} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} />
                <Caption text={f.caption} />
              </div>
            ))}
      </div>
    </Section>
  );
}
