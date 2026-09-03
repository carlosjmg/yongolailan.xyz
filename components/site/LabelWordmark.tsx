"use client";

import Link from "next/link";
import { useRef, type CSSProperties } from "react";

/**
 * The "Caribbean Sea Sound" wordmark in the label header. It gently floats
 * (CSS, see .cssound-wordmark) and, on hover, ripples letter-by-letter — the
 * same wave as the Yongolailan hero one-liner, a touch softer.
 */
export default function LabelWordmark({
  text,
  href,
  className,
  style,
}: {
  text: string;
  href: string;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const frame = useRef<number | null>(null);

  const applyWave = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const glyphs = el.querySelectorAll<HTMLElement>("[data-glyph]");
    if (!glyphs.length) return;
    const fontPx = parseFloat(getComputedStyle(el).fontSize) || 16;
    const amp = fontPx * 0.18; // gentle — softer than the hero one-liner (0.42)
    const first = glyphs[0].getBoundingClientRect();
    const last = glyphs[glyphs.length - 1].getBoundingClientRect();
    const advance = Math.max(6, (last.right - first.left) / glyphs.length);
    const sigma = advance * 1.5; // a slightly wider, gentler ripple
    glyphs.forEach((g) => {
      const r = g.getBoundingClientRect();
      const dx = clientX - (r.left + r.width / 2);
      const lift = amp * Math.exp(-(dx * dx) / (2 * sigma * sigma));
      g.style.transform = `translateY(${-lift}px)`;
    });
  };

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const x = e.clientX;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => applyWave(x));
  };

  const onLeave = () => {
    if (frame.current) cancelAnimationFrame(frame.current);
    const el = ref.current;
    if (!el) return;
    el.querySelectorAll<HTMLElement>("[data-glyph]").forEach((g) => {
      g.style.transform = "translateY(0)";
    });
  };

  return (
    <Link ref={ref} href={href} className={className} style={style} onPointerMove={onMove} onPointerLeave={onLeave}>
      {Array.from(text).map((ch, i) =>
        ch === " " ? (
          <span key={i}> </span>
        ) : (
          <span
            key={i}
            data-glyph
            style={{ display: "inline-block", transition: "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)", willChange: "transform" }}
          >
            {ch}
          </span>
        )
      )}
    </Link>
  );
}
