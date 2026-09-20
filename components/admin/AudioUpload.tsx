"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { compressToMp3 } from "@/lib/audio-compress";

// Vercel caps serverless request bodies at ~4.5 MB, so files under that go
// through the normal server upload. Anything bigger (every WAV, most long
// MP3s) first tries a direct-to-Blob upload, which needs a
// BLOB_READ_WRITE_TOKEN; when that isn't available the file is converted to a
// smaller MP3 right in the browser and uploaded the normal way instead.
const SERVER_LIMIT = 4.3 * 1024 * 1024;
const HARD_LIMIT = 200 * 1024 * 1024;

const mb = (n: number) => `${(n / 1024 / 1024).toFixed(1)} MB`;

export default function AudioUpload({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string | null;
}) {
  const [url, setUrl] = useState(defaultValue || "");
  const [busy, setBusy] = useState("");
  const [pct, setPct] = useState(0);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function sendToServer(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Upload failed. Please try again.");
    return data.url as string;
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > HARD_LIMIT) {
      setErr("That file is over 200 MB. Please export a smaller MP3 or WAV.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setBusy("Uploading…");
    setErr("");
    setNote("");
    setPct(0);
    try {
      if (file.size <= SERVER_LIMIT) {
        setUrl(await sendToServer(file));
      } else {
        let direct: string | null = null;
        try {
          const blob = await upload(file.name, file, {
            access: "public",
            handleUploadUrl: "/api/admin/blob-upload",
            contentType: file.type || "audio/mpeg",
            onUploadProgress: (p) => setPct(Math.round(p.percentage)),
          });
          direct = blob.url;
        } catch {
          // Direct upload isn't available (or the file is too big for it):
          // fall back to converting it to a smaller MP3 below.
        }
        if (direct) {
          setUrl(direct);
        } else {
          setBusy("Converting to MP3…");
          setPct(0);
          const mp3 = await compressToMp3(file, SERVER_LIMIT, setPct);
          if (mp3.size > SERVER_LIMIT) throw new Error("The converted file is still too large. Try a shorter track.");
          setBusy("Uploading…");
          setPct(0);
          setUrl(await sendToServer(mp3));
          setNote(`Converted to MP3 so it fits (${mb(file.size)} → ${mb(mp3.size)}).`);
        }
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy("");
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <input type="hidden" name={name} value={url} />
      <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
        <button type="button" className="admin-btn admin-btn-sm" onClick={() => inputRef.current?.click()} disabled={Boolean(busy)}>
          {busy ? (pct ? `${busy} ${pct}%` : busy) : url ? "Replace song" : "Upload song"}
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
          accept="audio/mpeg,audio/mp4,audio/aac,audio/x-m4a,audio/ogg,audio/wav,audio/x-wav,.mp3,.m4a,.aac,.ogg,.wav"
          hidden
          onChange={onFile}
        />
      </div>
      <div className="admin-help">
        MP3 or WAV from your computer. Big files (like WAVs) are converted to a smaller MP3 automatically, so the page loads fast.
        Remember to press Save afterwards.
      </div>
      {note && <div className="admin-help">{note}</div>}
      {err && <div className="admin-error">{err}</div>}
    </div>
  );
}
