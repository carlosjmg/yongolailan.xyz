"use client";

import React from "react";
import Link from "next/link";
import { CTAButton, Section, SectionHeader } from "./shared";

// Names inside the bio that link to their own section. The bio may write them
// in plain letters or in the bold unicode letters; the text is shown exactly as
// written and only wrapped in a link.
const BIO_LINK_RE =
  /(𝐀𝐑𝐓𝐄𝐑𝐀𝐓𝐈𝐎𝐍(?:s+𝐅𝐄𝐒𝐓)?|ARTeration(?:s+Fest)?|𝐂𝐚𝐫𝐢𝐛𝐛𝐞𝐚𝐧s+𝐒𝐞𝐚s+𝐒𝐨𝐮𝐧𝐝|Caribbeans+Seas+Sound)/iu;

function bioLinkHref(match: string): string {
  // NFKC turns the bold letters into plain ones, so one check covers both.
  return match.normalize("NFKC").toLowerCase().startsWith("arteration") ? "/arteration" : "/caribbean-sea-sound";
}

function withBioLinks(text: string): React.ReactNode {
  const parts = text.split(BIO_LINK_RE);
  if (parts.length < 2) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <Link key={i} href={bioLinkHref(part)} className="about-fest-link">
        {part}
      </Link>
    ) : (
      part
    )
  );
}

export default function About({
  p1,
  p2,
  image = "/images/ICE.webp",
  eyebrow,
  title,
  subtitle,
  hasEpk,
}: {
  p1: string;
  p2: string;
  image?: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  hasEpk?: boolean;
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
          {p1 && <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--text-dim)", lineHeight: 1.8, marginBottom: "20px" }}>{withBioLinks(p1)}</p>}
          {p2 && <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--text-dim)", lineHeight: 1.8 }}>{withBioLinks(p2)}</p>}

          <div style={{ marginTop: "32px", display: "flex", flexWrap: "wrap", gap: "14px", alignItems: "center" }}>
            {hasEpk && <CTAButton label="Download EPK (PDF)" primary href="https://www.yongolailan.xyz/yongolailan-epk" />}

            {/* Desktop-only route into the label page (mobile uses the menu). */}
            <Link
              href="/caribbean-sea-sound"
              className="about-label-cta"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "13px 28px",
                border: "1px solid oklch(35% 0.015 30)",
                borderRadius: "2px",
                color: "var(--text-dim)",
                textDecoration: "none",
                lineHeight: 1.2,
                transition: "color 0.2s, border-color 0.2s",
              }}
            >
              Caribbean Sea Sound →
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
