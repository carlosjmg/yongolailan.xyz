"use client";

import React, { useState } from "react";
import type { PortfolioItem } from "@prisma/client";
import { Section, SectionHeader } from "./shared";

function PortfolioCard({ item }: { item: PortfolioItem }) {
  const [active, setActive] = useState(false);
  const clickable = Boolean(item.linkUrl);

  const body = (
    <>
      {active && (
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "2px", background: item.color }} />
      )}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: active ? item.color : "var(--text-dimmer)",
          marginBottom: "12px",
        }}
      >
        {item.tag}
      </div>
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(24px, 2.5vw, 32px)",
          fontWeight: 300,
          color: active ? "var(--text)" : "oklch(60% 0.01 60)",
          marginBottom: "6px",
        }}
      >
        {item.title}
      </h3>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: "14px",
          color: active ? item.color : "var(--text-dimmer)",
          marginBottom: active ? "16px" : 0,
          transition: "all 0.3s",
        }}
      >
        {item.subtitle}
      </div>
      {active && (
        <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--text-dim)", lineHeight: 1.7, marginTop: "12px" }}>
          {item.description}
        </p>
      )}
      {active && item.linkUrl && (
        <div style={{ marginTop: "16px", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: item.color }}>
          Visit →
        </div>
      )}
    </>
  );

  const style: React.CSSProperties = {
    padding: "32px 28px",
    background: active ? "var(--bg2)" : "var(--bg)",
    border: "1px solid",
    borderColor: active ? item.color : "var(--border)",
    cursor: "pointer",
    transition: "all 0.3s",
    position: "relative",
    overflow: "hidden",
    textDecoration: "none",
    display: "block",
  };

  // Toggle detail on hover/click; if it has a link, the whole card links out.
  if (clickable && active) {
    return (
      <a
        href={item.linkUrl as string}
        target="_blank"
        rel="noopener noreferrer"
        style={style}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
      >
        {body}
      </a>
    );
  }
  return (
    <div
      style={style}
      onClick={() => setActive((v) => !v)}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      {body}
    </div>
  );
}

export default function Portfolio({ items }: { items: PortfolioItem[] }) {
  return (
    <Section id="portfolio">
      <SectionHeader
        eyebrow="Portfolio"
        title="Creative Work"
        subtitle="Music, film, games, and digital experiences rooted in Caribbean culture."
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2px" }}>
        {items.map((item) => (
          <PortfolioCard key={item.id} item={item} />
        ))}
      </div>
    </Section>
  );
}
