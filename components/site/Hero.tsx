"use client";

import React from "react";

// Clean hero: full-bleed background image. The photo shows clearly at the top;
// only the bottom fades to dark for a smooth transition into the next section.
// A cache-busting query on the URL guarantees a freshly-uploaded image shows.
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
      {/* Bottom fade — smooth transition into the section below (no shadow up top). */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: "linear-gradient(to bottom, transparent 55%, oklch(8% 0.018 30 / 0.6) 82%, oklch(8% 0.018 30) 100%)",
        }}
      />

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
