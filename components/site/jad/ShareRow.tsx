"use client";

import { useState } from "react";

/** Small share row: copy the link, or open a WhatsApp / X share. */
export default function ShareRow({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const wa = `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`;
  const x = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  return (
    <div className="jad-share">
      <span className="jad-share-label">Share</span>
      <button type="button" className="jad-share-btn" onClick={copy}>
        {copied ? "Copied ✓" : "Copy link"}
      </button>
      <a className="jad-share-btn" href={wa} target="_blank" rel="noopener noreferrer">
        WhatsApp
      </a>
      <a className="jad-share-btn" href={x} target="_blank" rel="noopener noreferrer">
        X
      </a>
    </div>
  );
}
