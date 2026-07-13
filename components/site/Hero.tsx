"use client";

import React, { useEffect, useState } from "react";
import { CTAButton } from "./shared";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")";

export default function Hero({
  eyebrow,
  name,
  roleLine,
  oneLiner,
  image,
  email,
  showCatalog,
  showPortfolio,
  showEpk,
}: {
  eyebrow: string;
  name: string;
  roleLine: string;
  oneLiner: string;
  image: string;
  email: string;
  showCatalog: boolean;
  showPortfolio: boolean;
  showEpk: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const fade = (delay: string): React.CSSProperties => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "none" : "translateY(20px)",
    transition: `opacity 0.8s ${delay}, transform 0.8s ${delay}`,
  });

  return (
    <section
      id="home"
      style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background:
            "linear-gradient(135deg, oklch(7% 0.025 220) 0%, oklch(8% 0.018 30) 50%, oklch(9% 0.022 45) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          opacity: 0.45,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          background:
            "linear-gradient(to bottom, transparent 0%, oklch(8% 0.018 30 / 0.2) 40%, oklch(8% 0.018 30 / 0.8) 75%, oklch(8% 0.018 30) 100%)",
        }}
      />
      <div style={{ position: "absolute", inset: 0, zIndex: 3, backgroundImage: GRAIN, opacity: 0.6 }} />

      <div
        style={{
          position: "relative",
          zIndex: 4,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "clamp(96px, 12vw, 140px) clamp(24px, 6vw, 80px) clamp(56px, 8vw, 100px)",
          maxWidth: "1400px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(10px, 1.1vw, 11px)",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--gold)",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            ...fade("0.2s"),
          }}
        >
          <span style={{ width: "28px", height: "1px", background: "var(--gold)", opacity: 0.6 }} />
          <span>{eyebrow}</span>
        </div>

        <h1
          className="hero-name"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(64px, 11vw, 156px)",
            fontWeight: 300,
            lineHeight: 0.88,
            letterSpacing: "-0.025em",
            color: "oklch(96% 0.005 60)",
            marginBottom: "28px",
            ...fade("0.35s"),
          }}
        >
          {name}
        </h1>

        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(11px, 1.3vw, 14px)",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "oklch(78% 0.01 60)",
            marginBottom: "20px",
            ...fade("0.5s"),
          }}
        >
          {roleLine}
        </div>

        <p
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(18px, 2.2vw, 28px)",
            fontWeight: 300,
            color: "oklch(74% 0.015 60)",
            maxWidth: "620px",
            marginBottom: "clamp(36px, 5vw, 52px)",
            lineHeight: 1.4,
            ...fade("0.65s"),
          }}
        >
          {oneLiner}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", ...fade("0.8s") }}>
          {showCatalog && <CTAButton label="Listen" primary to="catalog" />}
          {showPortfolio && <CTAButton label="Watch" to="portfolio" />}
          {showEpk && <CTAButton label="EPK" to="epk" />}
          <CTAButton label="Booking" to="contact" />
        </div>

        <div
          style={{
            marginTop: "clamp(28px, 4vw, 40px)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "8px 18px",
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--text-dimmer)",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.8s 1s",
          }}
        >
          <span>Bookings · Press</span>
          <a
            href={`mailto:${email}`}
            style={{
              color: "oklch(82% 0.01 60)",
              textDecoration: "none",
              borderBottom: "1px solid oklch(35% 0.015 30)",
              paddingBottom: "2px",
              textTransform: "none",
              letterSpacing: "0.02em",
              fontSize: "12px",
            }}
          >
            {email}
          </a>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          opacity: 0.4,
          animation: "scrollBounce 2s infinite",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--text-dim)",
          }}
        >
          Scroll
        </div>
        <div style={{ width: "1px", height: "32px", background: "linear-gradient(to bottom, var(--gold), transparent)" }} />
      </div>
    </section>
  );
}
