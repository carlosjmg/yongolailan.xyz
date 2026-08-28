"use client";

import React from "react";
import { scrollToSection } from "./shared";

const FADE = "oklch(8% 0.018 30";

/** smoothstep(0→1) sampled across 72%→100% of the hero height. */
const HERO_FADE_STOPS = Array.from({ length: 13 }, (_, i) => {
  const t = i / 12;
  const alpha = 3 * t * t - 2 * t * t * t;
  return `${FADE} / ${alpha.toFixed(4)}) ${(72 + 28 * t).toFixed(1)}%`;
}).join(", ");

// Full-bleed artwork with a restrained one-liner and a booking call to action
// sitting at the bottom, over the gradient that carries into the next section.
export default function Hero({
  image,
  name,
  roleLine,
  roleColor,
  copyX = 0,
  copyY = 0,
  bookingX = 0,
  bookingY = 0,
}: {
  image: string;
  name: string;
  roleLine?: string;
  /** Chosen in the admin (Home & Hero). Already validated as a hex colour. */
  roleColor: string;
  /** Admin nudge for the one-liner + Booking group, desktop only, in px. */
  copyX?: number | string;
  copyY?: number | string;
  /** Extra nudge for JUST the Booking button (relative to the group), desktop. */
  bookingX?: number | string;
  bookingY?: number | string;
}) {
  const cx = Number(copyX) || 0;
  const cy = Number(copyY) || 0;
  const bx = Number(bookingX) || 0;
  const by = Number(bookingY) || 0;
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
          // Starts at neck height in the artwork (~72% down) and follows a
          // smoothstep curve to fully opaque at the bottom. Sampled into many
          // stops on purpose: a plain 3-stop ramp begins with a sudden change
          // of slope, which the eye reads as a bright horizontal line (Mach
          // band) straight across the photo. Smoothstep leaves the slope at
          // zero on both ends, so the fade has no visible edge. Its midpoint
          // still lands at 0.5 alpha, matching the original falloff.
          background: `linear-gradient(to bottom, ${HERO_FADE_STOPS})`,
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
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "22px",
          // Admin nudge (desktop). On phones the copy is hidden, so this is moot.
          transform: `translate(${cx}px, ${cy}px)`,
        }}
      >
        {roleLine && (
          <div
            className="hero-role"
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

        {/* Phones get this button at the foot of the menu instead. */}
        <button
          className="hero-booking"
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
            // Independent nudge for just the button (desktop; hidden on phones).
            transform: `translate(${bx}px, ${by}px)`,
            transition: "background 0.2s, color 0.2s, border-color 0.2s",
          }}
          onMouseEnter={(e) => {
            // Fills with the site orange on hover, whatever colour the button
            // rests at — that accent is shared with every section heading.
            e.currentTarget.style.background = "var(--gold)";
            e.currentTarget.style.borderColor = "var(--gold)";
            e.currentTarget.style.color = "#0a0a0c";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = roleColor;
            e.currentTarget.style.color = roleColor;
          }}
        >
          Booking
        </button>
      </div>

      <ScrollCue color={roleColor} />
    </section>
  );
}

/**
 * Scroll affordance at the foot of the hero: a hairline that drains downward
 * into a slowly bouncing chevron. Fades away as soon as the visitor starts
 * scrolling, so it never lingers over the content below.
 */
function ScrollCue({ color }: { color: string }) {
  const [hidden, setHidden] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      aria-label="Scroll down"
      onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
      style={{
        position: "absolute",
        left: "50%",
        bottom: "clamp(22px, 4vh, 40px)",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        padding: "10px 18px",
        background: "none",
        border: "none",
        cursor: "pointer",
        opacity: hidden ? 0 : 0.75,
        pointerEvents: hidden ? "none" : "auto",
        transition: "opacity 0.45s ease",
        minHeight: "auto",
      }}
    >
      <span
        aria-hidden
        className="hero-cue-line"
        style={{
          width: "1px",
          height: "clamp(26px, 4.5vh, 42px)",
          background: `linear-gradient(to bottom, transparent, ${color})`,
          animation: "cueDrain 2.4s ease-in-out infinite",
        }}
      />
      <svg width="17" height="10" viewBox="0 0 17 10" fill="none" aria-hidden className="hero-cue-chevron" style={{ animation: "cueBounce 2.4s ease-in-out infinite" }}>
        <path d="M1 1 L8.5 8.5 L16 1" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
