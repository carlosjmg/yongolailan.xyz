"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";

// Uploads audio straight to Vercel Blob from the browser (no 4.5 MB serverless
// cap), and stores the resulting URL in a hidden input for the admin form.
export default function AudioUpload({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string | null;
}) {
  const [url, setUrl] = useState(defaultValue || "");
  const [busy, setBusy] = useState(false);
  const [pct, setPct] = useState(0);
  const [err, setErr] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 30 * 1024 * 1024) {
      setErr("That file is over 30 MB. Please upload a compressed MP3 or M4A.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setBusy(true);
    setErr("");
    setPct(0);
    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/admin/blob-upload",
        contentType: file.type || "audio/mpeg",
        onUploadProgress: (p) => setPct(Math.round(p.percentage)),
      });
      setUrl(blob.url);
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
          {busy ? `Uploading… ${pct}%` : url ? "Replace audio" : "Upload audio"}
        </button>
        {url && !busy && (
          <audio src={url} controls preload="none" style={{ height: "34px", maxWidth: "260px" }} />
        )}
        {url && !busy && (
          <button type="button" className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => setUrl("")}>
            Remove
          </button>
        )}
        <input ref={inputRef} type="file" accept="audio/mpeg,audio/mp4,audio/aac,audio/x-m4a,audio/ogg,audio/wav,.mp3,.m4a,.aac,.ogg,.wav" hidden onChange={onFile} />
      </div>
      {err && <div className="admin-error">{err}</div>}
    </div>
  );
}
