import { NextResponse } from "next/server";
import sharp from "sharp";
import { getAllSettings } from "@/lib/settings";

// Social preview card. Built with sharp only — no font loading — so it can't
// fail the way a generated (satori) card can. The artwork comes from the admin
// ("Social preview image", falling back to the hero image).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const W = 1200;
const H = 630;
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://yongolailan.xyz";

// Subtle cinematic grade: darken the edges so the title text the messaging app
// draws underneath sits against a calm frame.
const OVERLAY = Buffer.from(
  `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
     <defs>
       <linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
         <stop offset="0%" stop-color="#05070a" stop-opacity="0.30"/>
         <stop offset="45%" stop-color="#05070a" stop-opacity="0.05"/>
         <stop offset="100%" stop-color="#05070a" stop-opacity="0.55"/>
       </linearGradient>
     </defs>
     <rect width="${W}" height="${H}" fill="url(#v)"/>
     <rect x="0" y="${H - 6}" width="${W}" height="6" fill="#e9b04a"/>
   </svg>`
);

async function loadArtwork(): Promise<Buffer | null> {
  let src = "";
  try {
    const s = await getAllSettings();
    src = s["site.ogImage"] || s["hero.image"] || "";
  } catch {
    /* settings unavailable — use the bundled fallback below */
  }
  if (!src) return null;

  const url = src.startsWith("http") ? src : `${SITE}${src.startsWith("/") ? "" : "/"}${src}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    let base = await loadArtwork();

    if (!base) {
      // Nothing configured — ship a deep tropical gradient instead of failing.
      base = await sharp({
        create: { width: W, height: H, channels: 3, background: { r: 5, g: 7, b: 10 } },
      })
        .composite([
          {
            input: Buffer.from(
              `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
                 <defs>
                   <radialGradient id="a" cx="80%" cy="12%" r="70%">
                     <stop offset="0%" stop-color="#e9b04a" stop-opacity="0.55"/>
                     <stop offset="55%" stop-color="#548c50" stop-opacity="0.22"/>
                     <stop offset="100%" stop-color="#05070a" stop-opacity="0"/>
                   </radialGradient>
                   <radialGradient id="b" cx="12%" cy="95%" r="75%">
                     <stop offset="0%" stop-color="#1c787c" stop-opacity="0.5"/>
                     <stop offset="100%" stop-color="#05070a" stop-opacity="0"/>
                   </radialGradient>
                 </defs>
                 <rect width="${W}" height="${H}" fill="url(#a)"/>
                 <rect width="${W}" height="${H}" fill="url(#b)"/>
               </svg>`
            ),
            top: 0,
            left: 0,
          },
        ])
        .png()
        .toBuffer();
    }

    const jpeg = await sharp(base)
      .rotate() // honour EXIF orientation
      .resize(W, H, { fit: "cover", position: "attention" })
      .composite([{ input: OVERLAY, top: 0, left: 0 }])
      .jpeg({ quality: 86, mozjpeg: true })
      .toBuffer();

    return new NextResponse(jpeg, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    });
  } catch (e) {
    console.error("[og] failed:", e);
    return NextResponse.json({ error: "Could not build preview image." }, { status: 500 });
  }
}
