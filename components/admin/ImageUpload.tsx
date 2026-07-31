"use client";

import { useRef, useState } from "react";

// Vercel's serverless request body limit is 4.5 MB, so keep a little headroom.
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

// Only used when a file is too big to send as-is. Ordered largest-first so we
// keep as much detail as possible — important for full-screen hero images.
const FALLBACK_STEPS: [number, number][] = [
  [3200, 0.92],
  [2600, 0.9],
  [2048, 0.88],
  [1600, 0.85],
];

const RESIZABLE = ["image/jpeg", "image/png", "image/webp"];

async function loadImage(file: File): Promise<HTMLImageElement> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = document.createElement("img");
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Could not read that image."));
      img.src = objectUrl;
    });
    return img;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function drawToBlob(img: HTMLImageElement, maxDim: number, quality: number): Promise<Blob | null> {
  let w = img.naturalWidth;
  let h = img.naturalHeight;
  if (Math.max(w, h) > maxDim) {
    const s = maxDim / Math.max(w, h);
    w = Math.round(w * s);
    h = Math.round(h * s);
  }
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.resolve(null);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, w, h);
  return new Promise((r) => canvas.toBlob(r, "image/webp", quality));
}

/**
 * Send the original file untouched whenever it fits — that keeps full
 * resolution for hero/background images. Only genuinely oversized files get
 * scaled down, and then as little as possible.
 */
async function prepareImage(file: File): Promise<{ blob: Blob; filename: string }> {
  if (file.size <= MAX_UPLOAD_BYTES) {
    return { blob: file, filename: file.name };
  }
  if (!RESIZABLE.includes(file.type)) {
    throw new Error("That file is too large (max 4 MB). Please export a smaller version.");
  }

  const img = await loadImage(file);
  for (const [maxDim, quality] of FALLBACK_STEPS) {
    const blob = await drawToBlob(img, maxDim, quality);
    if (blob && blob.size <= MAX_UPLOAD_BYTES) {
      return { blob, filename: "image.webp" };
    }
  }
  throw new Error("That image is too large. Please export it at a smaller size and try again.");
}

export default function ImageUpload({ name, defaultValue }: { name: string; defaultValue?: string | null }) {
  const [url, setUrl] = useState(defaultValue || "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr("");
    setInfo("");
    try {
      const { blob, filename } = await prepareImage(file);
      const fd = new FormData();
      fd.append("file", blob, filename);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Upload failed. Please try again.");
      setUrl(data.url);
      if (blob !== file) {
        setInfo("Image was very large, so it was resized slightly to upload.");
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <input type="hidden" name={name} value={url} />
      <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="admin-thumb" style={{ width: "72px", height: "72px" }} />
        ) : (
          <div
            className="admin-thumb"
            style={{ width: "72px", height: "72px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-dimmer)", fontSize: "10px", fontFamily: "var(--font-mono)" }}
          >
            none
          </div>
        )}
        <div>
          <button type="button" className="admin-btn admin-btn-sm" onClick={() => inputRef.current?.click()} disabled={busy}>
            {busy ? "Uploading…" : url ? "Replace" : "Upload image"}
          </button>
          {url && (
            <button type="button" className="admin-btn admin-btn-sm admin-btn-danger" style={{ marginLeft: "6px" }} onClick={() => setUrl("")}>
              Remove
            </button>
          )}
          <input ref={inputRef} type="file" accept="image/*" hidden onChange={onFile} />
          {err && <div className="admin-error">{err}</div>}
          {info && <div className="admin-help">{info}</div>}
        </div>
      </div>
    </div>
  );
}
