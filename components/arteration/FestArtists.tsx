"use client";

import { useState } from "react";

export type FestArtistView = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string | null;
  instagramUrl: string | null;
  linkUrl: string | null;
};

export type FestYearView = { year: string; artists: FestArtistView[] };

const TINTS = ["var(--af-purple)", "var(--af-orange)", "var(--af-mustard)", "var(--af-olive)"];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function Detail({ a, i, labels }: { a: FestArtistView; i: number; labels: { noBio: string; instagram: string; website: string } }) {
  return (
    <div className="af-detail">
      <div className="af-detail-photo">
        {a.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={a.image} alt={a.name} loading="lazy" />
        ) : (
          <div className="af-detail-ph" style={{ color: TINTS[i % TINTS.length] }} aria-hidden="true">
            {initials(a.name)}
          </div>
        )}
      </div>
      <div className="af-detail-text">
        {a.role ? <p className="af-detail-role">{a.role}</p> : null}
        <p className="af-detail-bio">{a.bio || labels.noBio}</p>
        {a.instagramUrl || a.linkUrl ? (
          <p className="af-detail-links">
            {a.instagramUrl ? (
              <a href={a.instagramUrl} target="_blank" rel="noopener noreferrer">
                {labels.instagram} ↗
              </a>
            ) : null}
            {a.linkUrl ? (
              <a href={a.linkUrl} target="_blank" rel="noopener noreferrer">
                {labels.website} ↗
              </a>
            ) : null}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function FestArtists({
  years,
  labels,
}: {
  years: FestYearView[];
  labels: { noBio: string; instagram: string; website: string; soon: string };
}) {
  const [year, setYear] = useState(years[0]?.year ?? "");
  const group = years.find((y) => y.year === year) ?? years[0];
  const list = group?.artists ?? [];
  const [activeId, setActiveId] = useState<string | null>(null);
  // Desktop always has one artist in the side panel (the first until you pick another).
  const active = list.find((a) => a.id === activeId) ?? list[0];
  const activeIndex = Math.max(0, list.findIndex((a) => a.id === active?.id));

  if (!group || list.length === 0) {
    return <p className="af-empty">{labels.soon}</p>;
  }

  return (
    <div>
      {years.length > 1 ? (
        <div className="af-years" role="tablist">
          {years.map((y) => (
            <button
              key={y.year}
              type="button"
              role="tab"
              aria-selected={y.year === group.year}
              className={y.year === group.year ? "is-on" : ""}
              onClick={() => {
                setYear(y.year);
                setActiveId(null);
              }}
            >
              {y.year}
            </button>
          ))}
        </div>
      ) : null}

      <div className="af-dir">
        <ol className="af-lineup-list">
          {list.map((a, i) => {
            const open = a.id === activeId;
            return (
              <li key={a.id} className={a.id === active?.id ? "is-active" : ""}>
                <button
                  type="button"
                  className="af-lu-row"
                  aria-expanded={open}
                  onClick={() => {
                    // Desktop: select it in the side panel. Phones: open/close it in place.
                    if (window.matchMedia("(min-width: 960px)").matches) setActiveId(a.id);
                    else setActiveId(open ? null : a.id);
                  }}
                  onMouseEnter={() => {
                    // On desktop the side panel follows the pointer.
                    if (window.matchMedia("(min-width: 960px)").matches) setActiveId(a.id);
                  }}
                  onFocus={() => {
                    if (window.matchMedia("(min-width: 960px)").matches) setActiveId(a.id);
                  }}
                >
                  <span className="af-lu-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="af-lu-name">{a.name}</span>
                  {a.role ? <span className="af-lu-role">{a.role}</span> : null}
                  <span className="af-lu-plus" aria-hidden="true" />
                </button>
                {open ? (
                  <div className="af-inline">
                    <Detail a={a} i={i} labels={labels} />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>

        {active ? (
          <aside className="af-panel" aria-live="polite">
            <Detail a={active} i={activeIndex} labels={labels} />
          </aside>
        ) : null}
      </div>
    </div>
  );
}
