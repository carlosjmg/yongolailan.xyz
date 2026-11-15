"use client";

import { useCallback, useEffect, useState } from "react";

type P = { id: string; image: string; caption: string; edition: string };

export default function FestGallery({ photos }: { photos: P[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + photos.length) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, step]);

  const current = open === null ? null : photos[open];

  return (
    <>
      <div className="af-gallery">
        {photos.map((p, i) => (
          <button key={p.id} type="button" className="af-gallery-item" onClick={() => setOpen(i)} aria-label={p.caption || "Open photo"}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} alt={p.caption || "ARTeration Fest"} loading="lazy" />
          </button>
        ))}
      </div>

      {current ? (
        <div className="af-lightbox" role="dialog" aria-modal="true" onClick={close}>
          <button type="button" className="af-lb-btn af-lb-close" onClick={close} aria-label="Close">
            ×
          </button>
          {photos.length > 1 ? (
            <>
              <button
                type="button"
                className="af-lb-btn af-lb-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label="Previous photo"
              >
                ‹
              </button>
              <button
                type="button"
                className="af-lb-btn af-lb-next"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label="Next photo"
              >
                ›
              </button>
            </>
          ) : null}
          <figure onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.image} alt={current.caption || "ARTeration Fest"} />
            {current.caption ? <figcaption>{current.caption}</figcaption> : null}
          </figure>
        </div>
      ) : null}
    </>
  );
}
