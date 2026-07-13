"use client";

import React from "react";
import { SectionFullWidth, SectionHeader } from "./shared";

export default function Merch() {
  return (
    <SectionFullWidth id="merch" dark>
      <SectionHeader eyebrow="Merchandise" title="Merch" />
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
        <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--text-dimmer)", maxWidth: "440px", lineHeight: 1.7, marginBottom: "32px" }}>
          Clothing, posters, vinyl, visual art, and special releases — connected to Havanece, Yemaya, Ọ̀SUN, Sueño Tropical, and Caribbean Sea Sound.
        </p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
          {["Clothing", "Posters", "Vinyl", "Visual Art", "Special Downloads"].map((cat) => (
            <span
              key={cat}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "6px 14px",
                border: "1px solid var(--border)",
                color: "var(--text-dimmer)",
                borderRadius: "2px",
              }}
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    </SectionFullWidth>
  );
}
