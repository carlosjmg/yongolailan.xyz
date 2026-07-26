import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "image/svg+xml"];

function extFor(file: File): string {
  const fromName = file.name.split(".").pop();
  if (fromName && fromName.length <= 5) return fromName.toLowerCase();
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
    "image/svg+xml": "svg",
  };
  return map[file.type] || "bin";
}

/**
 * Store an uploaded file and return its public URL.
 * - On Vercel → Vercel Blob. Auth is automatic: with a connected store the SDK
 *   uses OIDC (VERCEL_OIDC_TOKEN + BLOB_STORE_ID), or a BLOB_READ_WRITE_TOKEN if
 *   one is set. No static token is required.
 * - Local dev (not on Vercel) → saved under /public/uploads so it still works.
 */
export async function uploadFile(file: File, folder = "uploads"): Promise<string> {
  const rand = Math.random().toString(36).slice(2, 8);
  const base = `${Date.now()}-${rand}.${extFor(file)}`;

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const onVercel = Boolean(process.env.VERCEL);

  if (token || onVercel) {
    const blob = await put(`${folder}/${base}`, file, {
      access: "public",
      addRandomSuffix: false,
      ...(token ? { token } : {}),
    });
    return blob.url;
  }

  // Local development fallback.
  const bytes = Buffer.from(await file.arrayBuffer());
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, base), bytes);
  return `/uploads/${base}`;
}

export function isImage(file: File): boolean {
  return IMAGE_TYPES.includes(file.type);
}
