"use client";

import React from "react";

// Clean hero: just the full-bleed background image, no text, buttons, overlays
// or shadows. Everything else appears as you scroll down.
export default function Hero({ image, name }: { image: string; name: string }) {
  return (
    <section
      id="home"
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "oklch(8% 0.018 30)",
      }}
    >
      {/* Visually hidden heading — keeps the page SEO/accessibility-friendly. */}
      <h1
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
          whiteSpace: "nowrap",
          border: 0,
          padding: 0,
          margin: "-1px",
        }}
      >
        {name} — DJ · Producer · Live Electronic Performer
      </h1>
    </section>
  );
}
