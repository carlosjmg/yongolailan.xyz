"use client";

import { useRef, useState } from "react";

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
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
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
