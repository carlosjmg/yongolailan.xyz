import { NextResponse } from "next/server";
import sharp from "sharp";
import { isAuthenticated } from "@/lib/session";

export const dynamic = "force-dynamic";

function toHex(r: number, g: number, b: number): string {
  const h = (n: number) => n.toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

/** Lightness/saturation in [0,1], from 0-255 RGB. */
function hsl(r: number, g: number, b: number) {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { s, l };
}

function dist(a: [number, number, number], b: [number, number, number]) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

/**
 * Pulls a small palette of dominant colours out of a cover image, so the
 * admin can pick a real "accent color 1 / 2" pair from the artwork itself
 * instead of guessing. Quantizes down-sampled pixels into a coarse colour
 * cube, scores buckets by frequency × vividness (favouring colours that
 * aren't washed-out or near-black), then greedily de-dupes visually close
 * picks so the returned swatches are actually distinct.
 */
export async function GET(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams, origin } = new URL(req.url);
  const raw = searchParams.get("url");
  if (!raw) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  // Local-dev uploads are stored as "/uploads/..." — resolve against this
  // request's own origin so the fetch below works in both environments.
  const abs = raw.startsWith("/") ? `${origin}${raw}` : raw;

  try {
    const res = await fetch(abs);
    if (!res.ok) throw new Error(`fetch ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());

    const { data, info } = await sharp(buf)
      .resize(64, 64, { fit: "cover" })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const channels = info.channels;
    const STEP = 32; // 256/32 = 8 levels per channel → 512 coarse buckets
    type Bucket = { r: number; g: number; b: number; n: number };
    const buckets = new Map<number, Bucket>();

    for (let i = 0; i + 2 < data.length; i += channels) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const key = ((r / STEP) | 0) * 1024 + ((g / STEP) | 0) * 32 + ((b / STEP) | 0);
      const bucket = buckets.get(key);
      if (bucket) {
        bucket.r += r; bucket.g += g; bucket.b += b; bucket.n++;
      } else {
        buckets.set(key, { r, g, b, n: 1 });
      }
    }

    const totalPixels = data.length / channels;
    const candidates = [...buckets.values()]
      .map((bkt) => {
        const r = Math.round(bkt.r / bkt.n);
        const g = Math.round(bkt.g / bkt.n);
        const b = Math.round(bkt.b / bkt.n);
        const { s, l } = hsl(r, g, b);
        const freq = bkt.n / totalPixels;
        // Favour colours that are common AND read as "a colour" (not muddy
        // grey, not near-black, not near-white).
        const vividness = s * (1 - Math.abs(l - 0.5) * 1.15);
        return { rgb: [r, g, b] as [number, number, number], hex: toHex(r, g, b), l, score: freq * (0.35 + Math.max(0, vividness)) };
      })
      .filter((c) => c.l > 0.05 && c.l < 0.95)
      .sort((a, b) => b.score - a.score);

    const palette: typeof candidates = [];
    for (const c of candidates) {
      if (palette.length >= 8) break;
      if (palette.every((p) => dist(p.rgb, c.rgb) > 26)) palette.push(c);
    }
    if (palette.length === 0 && candidates.length) palette.push(candidates[0]);

    const accent1 = palette[0];
    const accent2 = palette.find((c) => c !== accent1 && dist(c.rgb, accent1.rgb) > 55) || palette[1] || accent1;

    return NextResponse.json({
      accent1: accent1?.hex || "#eb881f",
      accent2: accent2?.hex || accent1?.hex || "#00bec7",
      palette: palette.map((c) => c.hex),
    });
  } catch (e) {
    console.error("[palette] error:", e);
    return NextResponse.json({ error: "Could not read colours from that image." }, { status: 500 });
  }
}
