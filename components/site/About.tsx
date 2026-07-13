"use client";

import React from "react";
import { CTAButton, Section, SectionHeader } from "./shared";

function parseArr<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export default function About({
  p1,
  p2,
  stats,
  image = "/images/ICE.webp",
  showEpk,
}: {
  p1: string;
  p2: string;
  stats: string;
  image?: string;
  showEpk: boolean;
}) {
  const statList = parseArr<[string, string][]>(stats, []);

  return (
    <Section id="about">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(40px, 6vw, 80px)", alignItems: "center" }}>
        <div style={{ position: "relative", aspectRatio: "4/5", background: "var(--bg2)", overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="Yongolailan" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(to right, var(--gold), transparent)" }} />
        </div>

        <div>
          <SectionHeader eyebrow="About" title="The Artist" />
          {p1 && <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--text-dim)", lineHeight: 1.8, marginBottom: "20px" }}>{p1}</p>}
          {p2 && <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--text-dim)", lineHeight: 1.8, marginBottom: "36px" }}>{p2}</p>}

          {statList.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "36px" }}>
              {statList.map(([num, label]) => (
                <div key={label} style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 300, color: "var(--gold)", lineHeight: 1 }}>{num}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-dimmer)", marginTop: "6px" }}>{label}</div>
                </div>
              ))}
            </div>
          )}

          {showEpk && <CTAButton label="Full EPK →" primary to="epk" />}
        </div>
      </div>
    </Section>
  );
}
