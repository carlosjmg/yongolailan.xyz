"use client";

import React from "react";
import type { Award } from "@prisma/client";
import { CTAButton, DownloadRow, EyebrowLabel, SectionFullWidth, SectionHeader } from "./shared";

function parseArr<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export default function EPK({
  settings,
  awards,
  email,
  liveImage = "/images/IMG_8117.webp",
}: {
  settings: Record<string, string>;
  awards: Award[];
  email: string;
  liveImage?: string;
}) {
  const soundTags = parseArr<string[]>(settings["epk.soundTags"], []);
  const identityFacts = parseArr<[string, string][]>(settings["epk.identityFacts"], []);
  const banner: [string, string][] = [
    ["One-Liner", settings["epk.oneLiner"] || ""],
    ["Sound", settings["epk.sound"] || ""],
    ["Performance", settings["epk.performance"] || ""],
    ["Recognition", settings["epk.recognition"] || ""],
  ];

  return (
    <SectionFullWidth id="epk" dark>
      <SectionHeader
        eyebrow="Electronic Press Kit"
        title="EPK / Press"
        subtitle="Bio, awards, press materials, and booking — everything festivals, press, and agents need in one place."
      />

      {/* Banner facts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1px",
          background: "var(--border)",
          marginBottom: "48px",
          border: "1px solid var(--border)",
        }}
      >
        {banner.map(([k, v]) => (
          <div key={k} style={{ background: "var(--bg2)", padding: "20px 22px", display: "flex", flexDirection: "column", gap: "8px", minHeight: "120px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)" }}>{k}</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--text)", lineHeight: 1.5 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Featured live session */}
      <div
        className="epk-featured-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
          gap: "2px",
          marginBottom: "56px",
          background: "var(--border)",
          border: "1px solid var(--border)",
        }}
      >
        <div style={{ position: "relative", minHeight: "320px", backgroundImage: `url(${liveImage})`, backgroundSize: "cover", backgroundPosition: "center" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, oklch(8% 0.018 30 / 0.7), transparent 60%)" }} />
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--gold)",
              background: "oklch(8% 0.018 30 / 0.6)",
              padding: "6px 10px",
              border: "1px solid oklch(72% 0.16 60 / 0.4)",
            }}
          >
            Featured Live Session
          </div>
          <div style={{ position: "absolute", bottom: "24px", left: "24px", right: "24px" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 300, color: "oklch(95% 0.005 60)", letterSpacing: "-0.01em", marginBottom: "4px" }}>
              EYEIFE Festival — Mix Session
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "oklch(82% 0.01 60)" }}>
              Official Mention · 2024 &amp; 2025
            </div>
          </div>
        </div>
        <div style={{ background: "var(--bg2)", padding: "28px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "20px" }}>
          <div>
            <EyebrowLabel>About the Session</EyebrowLabel>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--text-dim)", lineHeight: 1.7, marginBottom: "20px" }}>
              A live electronic set blending Afro-Cuban percussion, ritual Yoruba vocals, and contemporary house — recorded for EYEIFE Festival&apos;s official program two years running.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                ["Length", "58 min"],
                ["Format", "Live electronic / DJ hybrid"],
                ["Genre", "Afro-Cuban House · Ritual"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: "12px", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.08em" }}>
                  <span style={{ color: "var(--text-dimmer)", textTransform: "uppercase" }}>{k}</span>
                  <span style={{ color: "var(--text)", textAlign: "right" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <CTAButton label="Watch Session" primary to="portfolio" />
            <CTAButton label="Booking" to="contact" />
          </div>
        </div>
      </div>

      {/* Bio / Identity / Press columns */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "40px" }}>
        <div>
          <EyebrowLabel>Artist Biography</EyebrowLabel>
          {["epk.bio1", "epk.bio2", "epk.bio3"].map((k) =>
            settings[k] ? (
              <p key={k} style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--text-dim)", lineHeight: 1.8, marginBottom: "24px" }}>
                {settings[k]}
              </p>
            ) : null
          )}
        </div>

        <div>
          <EyebrowLabel>Identity</EyebrowLabel>
          <div style={{ display: "flex", flexDirection: "column", marginBottom: "40px" }}>
            {identityFacts.map(([k, v]) => (
              <div key={k} style={{ display: "grid", gridTemplateColumns: "120px 1fr", padding: "12px 0", borderBottom: "1px solid var(--border)", gap: "16px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-dimmer)" }}>{k}</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--text)" }}>{v}</span>
              </div>
            ))}
          </div>

          <EyebrowLabel>Awards &amp; Recognition</EyebrowLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {awards.map((a) => (
              <div key={a.id} style={{ padding: "16px 20px", background: "var(--bg)", borderLeft: "2px solid var(--gold)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "17px", color: "var(--text)", marginBottom: "4px" }}>{a.title}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--text-dim)" }}>{a.note}</div>
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--gold)", flexShrink: 0 }}>{a.year}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <EyebrowLabel>Press Quote</EyebrowLabel>
          <blockquote style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(18px, 2vw, 22px)", fontWeight: 300, color: "oklch(80% 0.01 60)", borderLeft: "2px solid var(--gold)", paddingLeft: "20px", marginBottom: "40px", lineHeight: 1.5 }}>
            &ldquo;{settings["epk.pressQuote"]}&rdquo;
          </blockquote>

          <EyebrowLabel>Sound Description</EyebrowLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "40px" }}>
            {soundTags.map((tag) => (
              <span key={tag} style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", padding: "6px 12px", border: "1px solid var(--border)", color: "var(--text-dim)", borderRadius: "2px" }}>
                {tag}
              </span>
            ))}
          </div>

          <EyebrowLabel>EPK Resources</EyebrowLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <DownloadRow label="Request Full EPK (PDF)" href={`mailto:${email}?subject=EPK Request`} />
            <DownloadRow label="Request Press Photos (High-Res)" href={`mailto:${email}?subject=Press Photos Request`} />
            <DownloadRow label="Request Logo & Branding Assets" href={`mailto:${email}?subject=Branding Assets Request`} />
            <DownloadRow label="Request Rider & Technical Spec" href={`mailto:${email}?subject=Technical Rider Request`} />
          </div>
        </div>
      </div>
    </SectionFullWidth>
  );
}
