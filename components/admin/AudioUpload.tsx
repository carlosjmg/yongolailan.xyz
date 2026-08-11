"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";

// Vercel caps serverless request bodies at ~4.5 MB. Files under that go through
// the normal server upload (works today via OIDC — no token needed). Larger
// files upload straight from the browser to Blob, which needs a
// BLOB_READ_WRITE_TOKEN; if it's not set, we say so clearly.
const SERVER_LIMIT = 4.3 * 1024 * 1024;
const HARD_LIMIT = 30 * 1024 * 1024;

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
    if (file.size > HARD_LIMIT) {
      setErr("That file is over 30 MB. Please upload a compressed MP3 or M4A.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setBusy(true);
    setErr("");
    setPct(0);
    try {
      if (file.size <= SERVER_LIMIT) {
        // Normal path — small enough for the serverless route (OIDC).
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Upload failed. Please try again.");
        setUrl(data.url);
      } else {
        // Big file — upload straight to Blob (needs BLOB_READ_WRITE_TOKEN).
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/admin/blob-upload",
          contentType: file.type || "audio/mpeg",
          onUploadProgress: (p) => setPct(Math.round(p.percentage)),
        });
        setUrl(blob.url);
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
      <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
        <button type="button" className="admin-btn admin-btn-sm" onClick={() => inputRef.current?.click()} disabled={busy}>
          {busy ? (pct ? `Uploading… ${pct}%` : "Uploading…") : url ? "Replace audio" : "Upload audio"}
        </button>
        {url && !busy && <audio src={url} controls preload="none" style={{ height: "34px", maxWidth: "260px" }} />}
        {url && !busy && (
          <button type="button" className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => setUrl("")}>
            Remove
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="audio/mpeg,audio/mp4,audio/aac,audio/x-m4a,audio/ogg,audio/wav,.mp3,.m4a,.aac,.ogg,.wav"
          hidden
          onChange={onFile}
        />
      </div>
      <div className="admin-help">MP3 or M4A. Up to ~4 MB uploads straight away; larger files need audio storage enabled.</div>
      {err && <div className="admin-error">{err}</div>}
    </div>
  );
}
