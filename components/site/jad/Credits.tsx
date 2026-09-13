"use client";

import { type CSSProperties, type ReactNode, useState } from "react";
import Link from "next/link";

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Wraps every occurrence of a label artist's name with a link to their
 *  artist page. Longest names first so e.g. "Arema Arega" wins over a
 *  shorter name that happens to be a substring of it, and Unicode-aware
 *  boundaries so it doesn't grab part of a longer word. */
function linkifyArtists(text: string, artists: { name: string; slug: string }[]): ReactNode[] {
  if (artists.length === 0) return [text];

  const byName = new Map(artists.map((a) => [a.name.toLowerCase(), a.slug]));
  const pattern = [...artists]
    .sort((a, b) => b.name.length - a.name.length)
    .map((a) => escapeRegExp(a.name))
    .join("|");
  const re = new RegExp(`(?<![\\p{L}\\p{N}])(${pattern})(?![\\p{L}\\p{N}])`, "giu");

  return text.split(re).map((part, i) => {
    const slug = byName.get(part.toLowerCase());
    return slug ? (
      <Link key={i} href={`/caribbean-sea-sound/artists/${slug}`} className="jad-info-link">
        {part}
      </Link>
    ) : (
      part
    );
  });
}

/**
 * The release credits. When `collapse` is on and there are more than `lines`
 * lines, only the first few show, with a "Full credits +" toggle that reveals
 * the rest — keeping the first viewport light (especially on phones). The size
 * CSS variables are inherited from the wrapper. Any credited name that matches
 * a published Label artist becomes a link to their artist page.
 */
export default function Credits({
  text,
  collapse,
  lines,
  style,
  artists = [],
}: {
  text: string;
  collapse: boolean;
  lines: number;
  style?: CSSProperties;
  artists?: { name: string; slug: string }[];
}) {
  const [open, setOpen] = useState(false);
  const parts = text.split(/\r?\n/);
  const canCollapse = collapse && parts.length > lines;
  const shown = canCollapse && !open ? parts.slice(0, lines).join("\n") : text;

  return (
    <div className="jad-credits" style={style}>
      <p className="jad-info">{linkifyArtists(shown, artists)}</p>
      {canCollapse && (
        <button type="button" className="jad-credits-toggle" onClick={() => setOpen((o) => !o)}>
          {open ? "Less −" : "Full credits +"}
        </button>
      )}
    </div>
  );
}
