"use client";

import React, { useRef, useState } from "react";
import type { MerchItem } from "@prisma/client";
import { SectionFullWidth, SectionHeader } from "./shared";

/** One photo, or a slider when an item has several. Every photo is shown whole
 *  (never cropped) over a blurred copy of itself, so portrait, landscape and
 *  square shots all fill the same 3:4 frame cleanly. The slider moves with a
 *  transform rather than native scrolling — scrolling snaps to whole pixels,
 *  which let a sliver of the neighbouring photo (a white line, on white-
 *  background shots) show along the edge. One round button in the bottom-right
 *  corner advances; swiping works on touch screens. */
function MerchGallery({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const [fit, setFit] = useState<Record<number, "cover" | "contain">>({});
  const touchX = useRef<number | null>(null);
  const many = images.length > 1;
  const wrap = (i: number) => (i + images.length) % images.length;

  // A photo whose shape is close to the frame fills it (a hair of crop); any
  // other shape is shown whole over the blurred copy instead of being cut.
  const decideFit = (img: HTMLImageElement, i: number) => {
    if (!img.naturalWidth) return;
    const ratio = img.naturalWidth / img.naturalHeight / (3 / 4);
    const mode = ratio > 0.88 && ratio < 1.14 ? "cover" : "contain";
    setFit((f) => (f[i] === mode ? f : { ...f, [i]: mode }));
  };

  return (
    <div
      style={{ position: "relative", aspectRatio: "3 / 4", background: "var(--bg2)", overflow: "hidden", touchAction: "pan-y" }}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (!many || touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 40) setIndex((i) => wrap(i + (dx < 0 ? 1 : -1)));
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          transform: `translateX(-${index * 100}%)`,
          transition: "transform 0.4s cubic-bezier(0.22, 0.61, 0.36, 1)",
        }}
      >
        {images.map((src, i) => (
          <div key={src} style={{ position: "relative", flex: "0 0 100%", width: "100%", height: "100%", overflow: "hidden" }}>
            {Math.abs(i - index) <= 1 && (
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: "-24px",
                  backgroundImage: `url(${src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "blur(22px)",
                }}
              />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={many ? `${alt} (photo ${i + 1} of ${images.length})` : alt}
              loading={i === 0 ? "eager" : "lazy"}
              draggable={false}
              ref={(el) => {
                if (el && el.complete) decideFit(el, i);
              }}
              onLoad={(e) => decideFit(e.currentTarget, i)}
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                objectFit: fit[i] === "cover" ? "cover" : "contain",
                display: "block",
              }}
            />
          </div>
        ))}
      </div>

      {many && (
        <>
          <div style={{ position: "absolute", left: "12px", bottom: "18px", display: "flex", gap: "6px", padding: "5px 8px", borderRadius: "999px", background: "oklch(8% 0.018 30 / 0.5)", pointerEvents: "none" }}>
            {images.map((_, i) => (
              <span
                key={i}
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: i === index ? "oklch(100% 0 0)" : "oklch(100% 0 0 / 0.45)",
                  transition: "background 0.2s",
                }}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label={`Next photo (${index + 1} of ${images.length})`}
            onClick={() => setIndex(wrap(index + 1))}
            style={{
              position: "absolute",
              right: "12px",
              bottom: "12px",
              width: "44px",
              height: "44px",
              boxSizing: "border-box",
              borderRadius: "50%",
              border: "1px solid oklch(100% 0 0 / 0.5)",
              background: "oklch(8% 0.018 30 / 0.7)",
              color: "var(--text)",
              fontSize: "22px",
              lineHeight: 1,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 0 2px 2px",
              backdropFilter: "blur(4px)",
            }}
          >
            ›
          </button>
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
