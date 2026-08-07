"use client";

import React from "react";
import { scrollToSection } from "./shared";

// Full-bleed artwork with a restrained one-liner and a booking call to action
// sitting at the bottom, over the gradient that carries into the next section.
export default function Hero({
  image,
  name,
  roleLine,
  roleColor,
}: {
  image: string;
  name: string;
  roleLine?: string;
  /** Chosen in the admin (Home & Hero). Already validated as a hex colour. */
  roleColor: string;
}) {
  return (
    <section
      id="home"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "oklch(8% 0.018 30)",
      }}
    >
      {/* Bottom fade — keeps the type readable and eases into the next section. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          // Same curve as before, just starting at neck height in the artwork
          // (~72% down) instead of mid-torso. The midpoint keeps its original
          // 53%-of-the-ramp position so the falloff shape is unchanged.
          background:
            "linear-gradient(to bottom, transparent 72%, oklch(8% 0.018 30 / 0.55) 87%, oklch(8% 0.018 30) 100%)",
        }}
      />

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
        {name} — {roleLine || "DJ · Producer · Live Electronic Performer"}
      </h1>

      <div
        className="hero-copy"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "22px",
        }}
      >
        {roleLine && (
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(11px, 1.35vw, 14px)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: roleColor,
            }}
          >
            {roleLine}
          </div>
        )}

        <button
          onClick={() => scrollToSection("contact")}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: roleColor,
            background: "transparent",
            padding: "13px 34px",
            border: `1px solid ${roleColor}`,
            borderRadius: "999px",
            cursor: "pointer",
            transition: "background 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = roleColor;
            e.currentTarget.style.color = "#0a0a0c";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = roleColor;
          }}
        >
          Booking
        </button>
      </div>
    </section>
  );
}
