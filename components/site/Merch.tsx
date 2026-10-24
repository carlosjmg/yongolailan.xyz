"use client";

import React, { useRef, useState } from "react";
import type { MerchItem } from "@prisma/client";
import { SectionFullWidth, SectionHeader } from "./shared";

const arrowStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  width: "34px",
  height: "34px",
  borderRadius: "50%",
  border: "1px solid oklch(100% 0 0 / 0.35)",
  background: "oklch(8% 0.018 30 / 0.55)",
  color: "var(--text)",
  fontSize: "16px",
  lineHeight: 1,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
};

/** One photo, or a swipeable strip (scroll-snap) with arrows and dots when an
 *  item has several. Touch/trackpad swiping is native; the arrows just scroll. */
function MerchGallery({ images, alt }: { images: string[]; alt: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const many = images.length > 1;

  const go = (to: number) => {
    const el = track.current;
    if (!el) return;
    const i = Math.max(0, Math.min(images.length - 1, to));
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div style={{ position: "relative", aspectRatio: "1", background: "var(--bg2)", overflow: "hidden" }}>
      <div
        ref={track}
        className="merch-track"
        onScroll={(e) => {
          const el = e.currentTarget;
          setIndex(Math.round(el.scrollLeft / el.clientWidth));
        }}
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          overflowX: many ? "auto" : "hidden",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
        }}
      >
        {images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt={many ? `${alt} (photo ${i + 1} of ${images.length})` : alt}
            loading={i === 0 ? "eager" : "lazy"}
            draggable={false}
            style={{ flex: "0 0 100%", width: "100%", height: "100%", objectFit: "cover", scrollSnapAlign: "start" }}
          />
        ))}
      </div>

      {many && (
        <>
          <button type="button" aria-label="Previous photo" onClick={() => go(index - 1)} disabled={index === 0} style={{ ...arrowStyle, left: "10px", opacity: index === 0 ? 0.35 : 1 }}>
            ‹
          </button>
          <button type="button" aria-label="Next photo" onClick={() => go(index + 1)} disabled={index === images.length - 1} style={{ ...arrowStyle, right: "10px", opacity: index === images.length - 1 ? 0.35 : 1 }}>
            ›
          </button>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: "10px", display: "flex", justifyContent: "center", gap: "6px", pointerEvents: "none" }}>
            {images.map((_, i) => (
              <span
                key={i}
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: i === index ? "var(--text)" : "oklch(100% 0 0 / 0.4)",
                  transition: "background 0.2s",
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Merch({
  items,
  eyebrow,
  title,
  subtitle,
}: {
  items: MerchItem[];
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  if (items.length === 0) {
    return (
      <SectionFullWidth id="merch" dark>
        <SectionHeader eyebrow={eyebrow} title={title} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(60px, 8vw, 100px) 20px",
            textAlign: "center",
            border: "1px solid var(--border)",
            background: "var(--bg)",
          }}
        >
          <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 300, color: "oklch(25% 0.015 30)", marginBottom: "20px" }}>
            Coming Soon
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--text-dimmer)", maxWidth: "440px", lineHeight: 1.7 }}>
            Vinyl, prints, apparel, and special releases, connected to Caribbean Sea Sound.
          </p>
        </div>
      </SectionFullWidth>
    );
  }

  return (
    <SectionFullWidth id="merch" dark>
      <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }}>
        {items.map((m) => (
          <div key={m.id} style={{ border: "1px solid var(--border)", background: "var(--bg)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {(() => {
              const images = [m.image, m.image2, m.image3, m.image4].filter((x): x is string => Boolean(x));
              return images.length > 0 ? <MerchGallery images={images} alt={m.title} /> : null;
            })()}
            <div style={{ padding: "18px 18px 22px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "20px", color: "var(--text)", lineHeight: 1.15 }}>{m.title}</div>
              {m.description && (
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--text-dim)", lineHeight: 1.6 }}>{m.description}</p>
              )}
              {m.price && <div style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--gold)", letterSpacing: "0.05em" }}>{m.price}</div>}
              {m.linkUrl && (
                <a
                  href={m.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginTop: "auto",
                    alignSelf: "flex-start",
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    padding: "10px 22px",
                    background: "var(--gold)",
                    color: "oklch(8% 0.018 30)",
                    borderRadius: "2px",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Order →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </SectionFullWidth>
  );
}
