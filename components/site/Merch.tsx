"use client";

import React from "react";
import type { MerchItem } from "@prisma/client";
import { SectionFullWidth, SectionHeader } from "./shared";

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
            Vinyl, prints, apparel, and special releases — connected to Caribbean Sea Sound.
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
            {m.image && (
              <div style={{ aspectRatio: "1", overflow: "hidden", background: "var(--bg2)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.image} alt={m.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
            <div style={{ padding: "18px 18px 22px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "20px", color: "var(--text)", lineHeight: 1.15 }}>{m.title}</div>
              {m.description && (
                <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--text-dim)", lineHeight: 1.6 }}>{m.description}</p>
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
