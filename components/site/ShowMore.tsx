"use client";

import React from "react";

/** Shared "Show more / Show less" toggle used by the paged sections. */
export default function ShowMore({
  expanded,
  hiddenCount,
  onToggle,
}: {
  expanded: boolean;
  hiddenCount: number;
  onToggle: () => void;
}) {
  if (hiddenCount <= 0 && !expanded) return null;

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "36px" }}>
      <button
        onClick={onToggle}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          padding: "12px 32px",
          borderRadius: "999px",
          border: "1px solid rgba(255,255,255,0.28)",
          background: "transparent",
          color: "rgba(255,255,255,0.85)",
          cursor: "pointer",
          transition: "background 0.2s, border-color 0.2s, color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.08)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)";
          e.currentTarget.style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)";
          e.currentTarget.style.color = "rgba(255,255,255,0.85)";
        }}
      >
        {expanded ? "Show less" : `Show more (${hiddenCount})`}
      </button>
    </div>
  );
}
