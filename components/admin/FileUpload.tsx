"use client";

import { useRef, useState } from "react";

// Simple file uploader (e.g. a PDF). Uploads to /api/admin/upload → Vercel Blob
// and stores the resulting URL in a hidden input.
export default function FileUpload({
  name,
  defaultValue,
  accept = "application/pdf",
  label = "Upload file",
}: {
  name: string;
  defaultValue?: string | null;
  accept?: string;
  label?: string;
}) {
  const [url, setUrl] = useState(defaultValue || "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setErr("File is too large (max 4 MB). Try compressing the PDF.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setBusy(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
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
      <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
        <button type="button" className="admin-btn admin-btn-sm" onClick={() => inputRef.current?.click()} disabled={busy}>
          {busy ? "Uploading…" : url ? "Replace file" : label}
        </button>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--gold)", textDecoration: "none" }}>
            View current ↗
          </a>
        )}
        {url && (
          <button type="button" className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => setUrl("")}>
            Remove
          </button>
        )}
        <input ref={inputRef} type="file" accept={accept} hidden onChange={onFile} />
      </div>
      {err && <div className="admin-error">{err}</div>}
    </div>
  );
}
