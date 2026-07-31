"use client";

import React from "react";
import type { Video } from "@prisma/client";
import { SectionFullWidth, SectionHeader } from "./shared";
import { toEmbedUrl } from "@/lib/video";

function VideoCard({ video }: { video: Video }) {
  const embed = toEmbedUrl(video.embedUrl);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div
        style={{
          position: "relative",
          aspectRatio: "16 / 9",
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          overflow: "hidden",
        }}
      >
        {embed ? (
          <iframe
            src={embed}
            title={video.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ width: "100%", height: "100%", border: 0, display: "block" }}
          />
        ) : (
          // Unrecognised link — show the thumbnail (if any) and open it directly.
          <a
            href={video.embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              textDecoration: "none",
              backgroundImage: video.thumbnail ? `url(${video.thumbnail})` : undefined,
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
        )}
      </div>

      <div>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(19px, 2vw, 24px)",
            fontWeight: 400,
            color: "var(--text)",
            lineHeight: 1.2,
            marginBottom: video.description ? "6px" : 0,
          }}
        >
          {video.title}
        </h3>
        {video.description && (
          <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--text-dim)", lineHeight: 1.6 }}>
            {video.description}
          </p>
        )}
      </div>
    </div>
  );
}

export default function Videos({
  videos,
  eyebrow,
  title,
  subtitle,
}: {
  videos: Video[];
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <SectionFullWidth id="videos" dark>
      <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
      {videos.length === 0 ? (
        <div
          style={{
            padding: "clamp(50px, 7vw, 90px) 20px",
            border: "1px solid var(--border)",
            background: "var(--bg)",
            textAlign: "center",
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(30px, 5vw, 52px)",
            fontWeight: 300,
            color: "oklch(25% 0.015 30)",
          }}
        >
          Coming Soon
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "clamp(24px, 3vw, 40px)" }}>
          {videos.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      )}
    </SectionFullWidth>
  );
}
