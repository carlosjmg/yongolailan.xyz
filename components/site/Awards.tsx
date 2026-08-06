"use client";

import React from "react";
import type { Award } from "@prisma/client";
import { Section, SectionHeader } from "./shared";

// Classic film-festival laurel, drawn from a curved stem with leaves placed
// along its tangent. Mirrored for the right-hand side.
function Laurel({ flip = false }: { flip?: boolean }) {
  const P0 = { x: 30, y: 60 };
  const P1 = { x: 2, y: 40 };
  const P2 = { x: 13, y: 5 };

  const at = (t: number) => ({
    x: (1 - t) ** 2 * P0.x + 2 * (1 - t) * t * P1.x + t ** 2 * P2.x,
    y: (1 - t) ** 2 * P0.y + 2 * (1 - t) * t * P1.y + t ** 2 * P2.y,
  });
  const tangent = (t: number) => ({
    x: 2 * (1 - t) * (P1.x - P0.x) + 2 * t * (P2.x - P1.x),
    y: 2 * (1 - t) * (P1.y - P0.y) + 2 * t * (P2.y - P1.y),
  });

  const leaves = [0.12, 0.26, 0.4, 0.54, 0.68, 0.82, 0.93].map((t, i) => {
    const p = at(t);
    const d = tangent(t);
    const deg = (Math.atan2(d.y, d.x) * 180) / Math.PI;
    const size = 1 - Math.abs(t - 0.45) * 0.5;
    return { ...p, deg: deg - 32, rx: 6.4 * size, ry: 2.5 * size, key: i };
  });

  return (
    <svg
      width="26"
      height="50"
      viewBox="0 0 34 64"
      fill="none"
      aria-hidden
      style={{ transform: flip ? "scaleX(-1)" : undefined, flexShrink: 0 }}
    >
      <path
        d={`M${P0.x} ${P0.y} Q${P1.x} ${P1.y} ${P2.x} ${P2.y}`}
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {leaves.map((l) => (
        <ellipse
          key={l.key}
          cx={l.x}
          cy={l.y}
          rx={l.rx}
          ry={l.ry}
          fill="currentColor"
          transform={`rotate(${l.deg} ${l.x} ${l.y})`}
        />
      ))}
    </svg>
  );
}

function AwardItem({ award }: { award: Award }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        color: "var(--gold-dim)",
        opacity: 0.85,
        minWidth: "190px",
      }}
    >
      <Laurel />
      <div style={{ textAlign: "center", padding: "0 2px" }}>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--text)",
            lineHeight: 1.25,
            letterSpacing: "0.01em",
          }}
        >
          {award.title}
        </div>
        {award.note && (
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              color: "var(--text-dim)",
              lineHeight: 1.35,
              marginTop: "3px",
              maxWidth: "180px",
            }}
          >
            {award.note}
          </div>
        )}
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "0.16em",
            color: "var(--gold)",
            marginTop: "5px",
          }}
        >
          {award.year}
        </div>
      </div>
      <Laurel flip />
    </div>
  );
}

export default function Awards({
  awards,
  eyebrow,
  title,
  subtitle,
}: {
  awards: Award[];
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  if (awards.length === 0) return null;

  return (
    <Section id="awards">
      <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "clamp(20px, 4vw, 52px)",
          paddingTop: "6px",
        }}
      >
        {awards.map((a) => (
          <AwardItem key={a.id} award={a} />
        ))}
      </div>
    </Section>
  );
}
