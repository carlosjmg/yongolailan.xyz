// Converts the heavy source PNGs in public/images to web-friendly WebP.
// Run with: npx tsx scripts/optimize-images.ts
// Originals remain in _reference/; the deployed site only ships the WebP.

import sharp from "sharp";
import { readdir, stat, unlink } from "fs/promises";
import path from "path";

const DIR = path.join(process.cwd(), "public", "images");

// Per-file max width; photos rarely need more than 2000px, logos far less.
const MAX_WIDTH: Record<string, number> = {
  "ICE.png": 2000,
  "IMG_8117.png": 1800,
  "Yongo-logo-blanco.png": 800,
};

async function main() {
  const files = await readdir(DIR);
  for (const file of files) {
    if (!file.toLowerCase().endsWith(".png")) continue;
    const src = path.join(DIR, file);
    const out = src.replace(/\.png$/i, ".webp");
    const before = (await stat(src)).size;

    await sharp(src)
      .resize({ width: MAX_WIDTH[file] ?? 2000, withoutEnlargement: true })
      .webp({ quality: 84 })
      .toFile(out);

    const after = (await stat(out)).size;
    console.log(
      `${file}: ${(before / 1024 / 1024).toFixed(2)} MB → ${(after / 1024).toFixed(0)} KB (${Math.round(
        (1 - after / before) * 100
      )}% smaller)`
    );
    await unlink(src); // don't ship the heavy original
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
