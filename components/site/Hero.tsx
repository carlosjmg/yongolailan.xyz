"use client";

import React from "react";
import { scrollToSection } from "./shared";

// Full-bleed artwork with a restrained one-liner and a booking call to action
// sitting at the bottom, over the gradient that carries into the next section.
export default function Hero({
  image,
  name,
  roleLine,
}: {
  image: string;
  name: string;
  roleLine?: string;
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
          background:
            "linear-gradient(to bottom, transparent 45%, oklch(8% 0.018 30 / 0.55) 74%, oklch(8% 0.018 30) 100%)",
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
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          // Sits just under the fixed 64px nav.
          padding: "clamp(104px, 15vh, 168px) clamp(24px, 6vw, 80px) 0",
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
              color: "rgba(255,255,255,0.92)",
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
            color: "#ffffff",
            background: "transparent",
            padding: "13px 34px",
            border: "1px solid rgba(255,255,255,0.75)",
            borderRadius: "999px",
            cursor: "pointer",
            transition: "background 0.2s, border-color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.14)";
            e.currentTarget.style.borderColor = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.75)";
          }}
        >
          Booking
        </button>
      </div>
    </section>
  );
}
