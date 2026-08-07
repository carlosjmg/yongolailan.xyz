"use client";

import React, { useId } from "react";
import type { Award } from "@prisma/client";
import { Section, SectionHeader } from "./shared";

// ── Laurel wreath ──────────────────────────────────────────────
// A full film-festival wreath: one branch is drawn along a circular arc with
// leaves fanned out on both sides of the stem, then mirrored so the two stems
// cross at the bottom. Metallic gold gradient, sized in a 200x196 viewBox.

const CX = 100;
const CY = 100;
const R = 76;
const A_START = 102; // degrees, just left of top
const A_END = 300; // sweeps well past the bottom so the two tails cross in an X

const angleAt = (t: number) => A_START + (A_END - A_START) * t;
// The very end of the stem flares out a little, like the reference wreath.
const radiusAt = (t: number) => R * (1 + 0.06 * Math.max(0, (t - 0.85) / 0.15) ** 1.6);

function pointAt(t: number) {
  const rad = (angleAt(t) * Math.PI) / 180;
  const r = radiusAt(t);
  return { x: CX + r * Math.cos(rad), y: CY - r * Math.sin(rad), rad };
}

// Leaves taper at both ends of the branch and are fullest around the middle.
const scaleAt = (t: number) => 1 - Math.min(1, Math.abs(t - 0.44) / 0.5) * 0.32;

function leafTransform(t: number, inward: boolean) {
  const { x, y, rad } = pointAt(t);
  // Unit vectors in SVG space (y grows downward).
  const back = { x: Math.sin(rad), y: Math.cos(rad) }; // along the stem, toward the top
  const side = inward
    ? { x: -Math.cos(rad), y: Math.sin(rad) }
    : { x: Math.cos(rad), y: -Math.sin(rad) };
  const dx = 0.6 * back.x + 0.85 * side.x;
  const dy = 0.6 * back.y + 0.85 * side.y;
  const deg = (Math.atan2(dy, dx) * 180) / Math.PI;
  return `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${deg.toFixed(2)})`;
}

// Pointed at the base (on the stem) and at the tip.
function leafPath(len: number, halfWidth: number) {
  return `M0 0 Q${(len * 0.42).toFixed(2)} ${-halfWidth.toFixed(2)} ${len.toFixed(2)} 0 Q${(len * 0.42).toFixed(2)} ${halfWidth.toFixed(2)} 0 0`;
}

const STEM_PATH = (() => {
  let d = "";
  for (let i = 0; i <= 72; i++) {
    const p = pointAt(i / 72);
    d += `${i === 0 ? "M" : "L"}${p.x.toFixed(2)} ${p.y.toFixed(2)} `;
  }
  return d.trim();
})();

// Leaves stop short of the end so the crossing tails stay bare.
const OUTER = Array.from({ length: 20 }, (_, i) => 0.02 + (i * 0.78) / 19);
const INNER = Array.from({ length: 14 }, (_, i) => 0.06 + (i * 0.68) / 13);

function Branch({ gid }: { gid: string }) {
  const fill = `url(#${gid})`;
  return (
    <g>
      <path d={STEM_PATH} fill="none" stroke={fill} strokeWidth="2.1" strokeLinecap="round" />
      {OUTER.map((t, i) => {
        const s = scaleAt(t);
        return <path key={`o${i}`} d={leafPath(17 * s, 6.8 * s)} fill={fill} transform={leafTransform(t, false)} />;
      })}
      {/* Inner leaves stay short so the award text keeps a clear centre. */}
      {INNER.map((t, i) => {
        const s = scaleAt(t);
        return <path key={`i${i}`} d={leafPath(10 * s, 4.3 * s)} fill={fill} transform={leafTransform(t, true)} />;
      })}
    </g>
  );
}

function Wreath() {
  const raw = useId();
  const gid = `laurelGold-${raw.replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <defs>
        {/* Metallic sweep so the wreath catches light like a foil laurel. */}
        <linearGradient id={gid} x1="16" y1="8" x2="184" y2="192" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbf0c9" />
          <stop offset="12%" stopColor="#f2e0a2" />
          <stop offset="24%" stopColor="#d9b459" />
          <stop offset="38%" stopColor="#f6e7b3" />
          <stop offset="52%" stopColor="#c99a34" />
          <stop offset="66%" stopColor="#efdc9c" />
          <stop offset="82%" stopColor="#c08f28" />
          <stop offset="100%" stopColor="#a3761f" />
        </linearGradient>
      </defs>
      <Branch gid={gid} />
      <g transform="translate(200 0) scale(-1 1)">
        <Branch gid={gid} />
      </g>
    </svg>
  );
}

function AwardItem({ award }: { award: Award }) {
  return (
    <div
      style={{
        position: "relative",
        width: "clamp(150px, 43vw, 204px)",
        aspectRatio: "1",
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
        // Type is sized in em off this value so the text always keeps the same
        // proportion to the wreath and never grows into the leaves.
        fontSize: "clamp(8.6px, 2.46vw, 11.7px)",
      }}
    >
      <Wreath />
      <div style={{ position: "relative", textAlign: "center", maxWidth: "50%" }}>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1em",
            fontWeight: 500,
            color: "var(--text)",
            lineHeight: 1.28,
            letterSpacing: "0.01em",
          }}
        >
          {award.title}
        </div>
        {award.note && (
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.76em",
              color: "var(--text-dim)",
              lineHeight: 1.26,
              marginTop: "0.4em",
            }}
          >
            {award.note}
          </div>
        )}
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.78em",
            letterSpacing: "0.16em",
            color: "var(--gold)",
            marginTop: "0.55em",
          }}
        >
          {award.year}
        </div>
      </div>
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
          gap: "clamp(4px, 1.2vw, 14px)",
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
