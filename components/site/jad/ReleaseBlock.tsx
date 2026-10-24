"use client";

import { useEffect, useState } from "react";
import { newYorkWallTimeToUtcMs } from "@/lib/ny-time";

const MONTHS = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
];
const pad = (n: number) => String(n).padStart(2, "0");

/** Parse "YYYY-MM-DDTHH:MM" literally, so the printed date is identical on the
 *  server and the client (no timezone drift → no hydration mismatch). */
function parseParts(s: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/.exec(s.trim());
  if (!m) return null;
  return {
    y: +m[1], mo: +m[2], d: +m[3], h: m[4] ? +m[4] : 0, mi: m[5] ? +m[5] : 0,
  };
}

/**
 * The release row (date line + optional countdown) and the primary CTA.
 * Before the release moment the CTA is "Pre-Save"; on/after it flips to
 * "Listen Now". `initialReleased` is computed on the server so the first paint
 * matches; a timer then keeps it live (and ticks the countdown).
 */
export default function ReleaseBlock({
  releaseDate,
  ctaEnabled,
  presaveUrl,
  listenUrl,
  countdown,
  title,
  initialReleased,
}: {
  releaseDate: string;
  ctaEnabled: boolean;
  presaveUrl: string;
  listenUrl: string;
  countdown: boolean;
  title: string;
  initialReleased: boolean;
}) {
  const parts = parseParts(releaseDate);
  const targetTs = parts ? newYorkWallTimeToUtcMs(parts.y, parts.mo, parts.d, parts.h, parts.mi) : NaN;
  const hasDate = parts !== null;

  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(0);
  useEffect(() => {
    setMounted(true);
    setNow(Date.now());
    if (!hasDate) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [hasDate]);

  const released = hasDate ? (mounted ? now >= targetTs : initialReleased) : true;
  const dateStr = parts ? `${MONTHS[parts.mo - 1]} ${parts.d} · ${parts.y}` : "";

  // The clock shows only before release. Until the page has mounted it renders
  // "--" placeholders so the server and browser agree and nothing jumps.
  const showClock = hasDate && countdown && !released;
  const diff = mounted ? Math.max(0, targetTs - now) : null;
  const clock: { label: string; value: string }[] = [
    { label: "Days", value: diff === null ? "--" : String(Math.floor(diff / 86400000)).padStart(2, "0") },
    { label: "Hrs", value: diff === null ? "--" : pad(Math.floor((diff % 86400000) / 3600000)) },
    { label: "Min", value: diff === null ? "--" : pad(Math.floor((diff % 3600000) / 60000)) },
    { label: "Sec", value: diff === null ? "--" : pad(Math.floor((diff % 60000) / 1000)) },
  ];

  const ctaLabel = released ? "Listen Now" : `Pre-Save ${title}`;
  const ctaUrl = released ? listenUrl : presaveUrl;

  if (!hasDate && !ctaEnabled) return null;

  return (
    <>
      {hasDate && (
        <div className="jad-release">
          <span className="jad-release-date">{released ? "OUT NOW" : `OUT: ${dateStr}`}</span>
        </div>
      )}

      {showClock && (
        <div className="jad-clock" role="timer" aria-label="Time until release">
          {clock.map((c, i) => (
            <div key={c.label} className="jad-clock-cell">
              <span className="jad-clock-num">{c.value}</span>
              <span className="jad-clock-label">{c.label}</span>
              {i < clock.length - 1 && <span className="jad-clock-sep" aria-hidden>:</span>}
            </div>
          ))}
        </div>
      )}

      {ctaEnabled &&
        (ctaUrl ? (
          <a className="jad-cta" href={ctaUrl} target="_blank" rel="noopener noreferrer">
            {ctaLabel}
          </a>
        ) : (
          <span className="jad-cta is-disabled" role="link" aria-disabled="true">
            {ctaLabel}
          </span>
        ))}
    </>
  );
}
