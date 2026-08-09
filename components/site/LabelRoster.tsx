"use client";

import React from "react";
import type { LabelArtist, LabelProduction } from "@prisma/client";
import PlatformIcon, { hasPlatformIcon } from "./PlatformIcon";

export type ArtistWithProductions = LabelArtist & { productions: LabelProduction[] };

function ListenLink({ url }: { url: string }) {
  let host = "";
  try {
    host = new URL(url).hostname.replace(/^www\./, "").split(".")[0];
  } catch {
    /* not a parseable URL — fall through to the plain label */
  }
  const glyph = host ? hasPlatformIcon(host) : false;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "7px",
        fontFamily: "var(--font-mono)",
        fontSize: "10px",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "var(--text-dim)",
        textDecoration: "none",
        transition: "color 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-dim)")}
    >
      {glyph ? <PlatformIcon name={host} size={15} /> : null}
      Listen
    </a>
  );
}

function ProductionRow({ p }: { p: LabelProduction }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "14px 0",
        borderTop: "1px solid var(--border)",
      }}
    >
      {p.cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={p.cover}
          alt=""
          style={{ width: "52px", height: "52px", objectFit: "cover", borderRadius: "3px", flexShrink: 0 }}
        />
      ) : (
        <div
          aria-hidden
          style={{ width: "52px", height: "52px", borderRadius: "3px", background: "var(--bg3)", flexShrink: 0 }}
        />
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "15px",
            color: "var(--text)",
            lineHeight: 1.3,
          }}
        >
          {p.title}
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--text-dimmer)",
            marginTop: "5px",
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          {p.releaseType && <span>{p.releaseType}</span>}
          {p.year && <span>{p.year}</span>}
          {p.credit && <span style={{ color: "var(--text-dim)" }}>{p.credit}</span>}
        </div>
      </div>

      {p.linkUrl && <ListenLink url={p.linkUrl} />}
    </div>
  );
}

function ArtistBlock({ artist }: { artist: ArtistWithProductions }) {
  return (
    <article
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 300px) minmax(0, 1fr)",
        gap: "clamp(24px, 4vw, 56px)",
        alignItems: "start",
        paddingBottom: "clamp(44px, 6vw, 76px)",
      }}
      className="label-artist"
    >
      <div>
        {artist.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={artist.image}
            alt={artist.name}
            style={{
              width: "100%",
              aspectRatio: "1",
              objectFit: "cover",
              borderRadius: "3px",
              marginBottom: "18px",
            }}
          />
        ) : null}

        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 3.4vw, 40px)",
            fontWeight: 400,
            lineHeight: 1.05,
            color: "var(--text)",
            letterSpacing: "-0.01em",
          }}
        >
          {artist.name}
        </h2>

        {artist.role && (
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--gold)",
              marginTop: "9px",
            }}
          >
            {artist.role}
          </div>
        )}

        {artist.bio && (
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              lineHeight: 1.65,
              color: "var(--text-dim)",
              marginTop: "14px",
            }}
          >
            {artist.bio}
          </p>
        )}

        {artist.linkUrl && (
          <a
            href={artist.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: "14px",
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--text-dim)",
              textDecoration: "none",
              borderBottom: "1px solid var(--border)",
              paddingBottom: "3px",
              transition: "color 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--gold)";
              e.currentTarget.style.borderColor = "var(--gold)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-dim)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            Artist page ↗
          </a>
        )}
      </div>

      <div>
        {artist.productions.length === 0 ? (
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--text-dimmer)",
              paddingTop: "14px",
              borderTop: "1px solid var(--border)",
            }}
          >
            Productions coming soon
          </div>
        ) : (
          artist.productions.map((p) => <ProductionRow key={p.id} p={p} />)
        )}
      </div>
    </article>
  );
}

export default function LabelRoster({ artists }: { artists: ArtistWithProductions[] }) {
  if (artists.length === 0) {
    return (
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "16px",
          color: "var(--text-dim)",
          maxWidth: "60ch",
        }}
      >
        The roster is being put together. Check back soon.
      </p>
    );
  }

  return (
    <div>
      {artists.map((a) => (
        <ArtistBlock key={a.id} artist={a} />
      ))}
    </div>
  );
}
