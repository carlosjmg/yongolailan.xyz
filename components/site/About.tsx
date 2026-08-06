"use client";

import React from "react";
import { CTAButton, Section, SectionHeader } from "./shared";

export default function About({
  p1,
  p2,
  image = "/images/ICE.webp",
  eyebrow,
  title,
  subtitle,
  epkPdf,
}: {
  p1: string;
  p2: string;
  image?: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  epkPdf?: string;
}) {
  return (
    <Section id="about">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(40px, 6vw, 80px)", alignItems: "center" }}>
        <div style={{ position: "relative", aspectRatio: "4/5", background: "var(--bg2)", overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="Yongolailan" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%" }} />
        </div>

        <div>
          <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
          {p1 && <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--text-dim)", lineHeight: 1.8, marginBottom: "20px" }}>{p1}</p>}
          {p2 && <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--text-dim)", lineHeight: 1.8 }}>{p2}</p>}

          {epkPdf && (
            <div style={{ marginTop: "32px" }}>
              <CTAButton label="Download EPK (PDF)" primary href={epkPdf} />
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
