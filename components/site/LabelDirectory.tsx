"use client";

import React, { useState } from "react";
import Link from "next/link";

export interface DirectoryArtist {
  id: string;
  name: string;
  slug: string;
  role: string;
  shortDescription: string;
  image: string | null;
}

/** Description that always begins with the artist's name, in bold. */
function Description({ a }: { a: DirectoryArtist }) {
  return (
    <>
      <b>{a.name}</b>
      {a.shortDescription ? ` — ${a.shortDescription}` : ""}
    </>
  );
}

/**
 * The artist directory. Two experiences that share the same data and hierarchy
 * (Artist → image → short description → artist page), toggled purely by CSS:
 *  - Desktop: a hover list on the left drives a sticky preview on the right.
 *  - Touch:   an accordion, tap to reveal the image + description.
 */
export default function LabelDirectory({ artists }: { artists: DirectoryArtist[] }) {
  const [activeId, setActiveId] = useState(artists[0]?.id ?? "");
  const [openId, setOpenId] = useState<string | null>(null);

  if (artists.length === 0) {
    return (
      <p className="cssound-songs-empty">The roster is being put together — check back soon.</p>
    );
  }

  const active = artists.find((a) => a.id === activeId) ?? artists[0];

  return (
    <>
      {/* ── Desktop ── */}
      <div className="cssound-section-label">
        <span>Artists</span>
      </div>

      <div className="cssound-directory">
        <ul className="cssound-list">
          {artists.map((a) => (
            <li key={a.id} className={`cssound-row ${a.id === activeId ? "is-active" : ""}`}>
              <Link
                href={`/caribbean-sea-sound/artists/${a.slug}`}
                onMouseEnter={() => setActiveId(a.id)}
                onFocus={() => setActiveId(a.id)}
              >
                <span className="cssound-row-name">{a.name}</span>
                <span className="cssound-row-go mono" aria-hidden>
                  View →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="cssound-preview" aria-hidden>
          <div className="cssound-preview-frame">
            {active.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={active.id} src={active.image} alt={active.name} loading="eager" />
            ) : (
              <div className="cssound-preview-empty">No image yet</div>
            )}
          </div>
          <p className="cssound-preview-desc">
            <Description a={active} />
          </p>
        </div>
      </div>

      {/* ── Touch accordion ── */}
      <ul className="cssound-accordion">
        {artists.map((a) => {
          const open = openId === a.id;
          return (
            <li key={a.id} className={`cssound-acc-row ${open ? "is-open" : ""}`}>
              <button
                type="button"
                className="cssound-acc-head"
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : a.id)}
              >
                <span className="cssound-acc-name">{a.name}</span>
                <span className="cssound-acc-sign" aria-hidden>
                  {open ? "×" : "+"}
                </span>
              </button>
              <div className="cssound-acc-body" style={{ maxHeight: open ? "640px" : "0" }}>
                <div className="cssound-acc-inner">
                  {a.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="cssound-acc-img" src={a.image} alt={a.name} loading="lazy" />
                  )}
                  <p className="cssound-acc-desc">
                    <Description a={a} />
                  </p>
                  <Link href={`/caribbean-sea-sound/artists/${a.slug}`} className="cssound-acc-link">
                    View artist →
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
