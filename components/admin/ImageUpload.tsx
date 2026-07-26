"use client";

import { useRef, useState } from "react";

const MAX_DIM = 1600;
const RESIZE_ABOVE = 1_000_000; // only shrink files bigger than ~1 MB

// Downscale large photos in the browser before uploading. This keeps files well
// under Vercel's request-size limit and optimizes them. Small files (logos,
// icons) pass through untouched so they stay crisp.
async function prepareImage(file: File): Promise<{ blob: Blob; filename: string }> {
  const resizable = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
  if (!resizable || file.size < RESIZE_ABOVE) {
    return { blob: file, filename: file.name };
  }
  try {
    const objectUrl = URL.createObjectURL(file);
    const img = document.createElement("img");
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("read-fail"));
      img.src = objectUrl;
    });
    URL.revokeObjectURL(objectUrl);

    let w = img.naturalWidth;
    let h = img.naturalHeight;
    if (Math.max(w, h) > MAX_DIM) {
      const s = MAX_DIM / Math.max(w, h);
      w = Math.round(w * s);
      h = Math.round(h * s);
    }
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return { blob: file, filename: file.name };
    ctx.drawImage(img, 0, 0, w, h);

    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.9));
    if (!blob || blob.size >= file.size) return { blob: file, filename: file.name };
    return { blob, filename: "image.webp" };
  } catch {
    return { blob: file, filename: file.name };
  }
}

export default function ImageUpload({ name, defaultValue }: { name: string; defaultValue?: string | null }) {
  const [url, setUrl] = useState(defaultValue || "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr("");
    try {
      const { blob, filename } = await prepareImage(file);
      if (blob.size > 4 * 1024 * 1024) {
        throw new Error("Image is too large. Please use one under 4 MB.");
      }
      const fd = new FormData();
      fd.append("file", blob, filename);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Upload failed. Please try again.");
      setUrl(data.url);
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
        </div>
      </div>
    </div>
  );
}
