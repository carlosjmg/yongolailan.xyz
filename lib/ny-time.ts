// Release times are typed in the admin as plain wall-clock time ("2026-11-06
// 00:00") with no timezone. They mean New York time (the label is in Brooklyn),
// so every visitor, wherever they are, counts down to the same instant — and the
// server and the browser agree on whether the song is out yet.

const TZ = "America/New_York";

/** How far New York's clock is ahead of UTC at the given instant (negative). */
function nyOffsetMs(utcMs: number): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hourCycle: "h23",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).formatToParts(new Date(utcMs));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return asUtc - Math.floor(utcMs / 1000) * 1000;
}

/** The UTC timestamp for a wall-clock time in New York. */
export function newYorkWallTimeToUtcMs(y: number, mo: number, d: number, h: number, mi: number): number {
  const guess = Date.UTC(y, mo - 1, d, h, mi);
  // Two passes settle correctly across the daylight-saving switch.
  const first = guess - nyOffsetMs(guess);
  return guess - nyOffsetMs(first);
}
