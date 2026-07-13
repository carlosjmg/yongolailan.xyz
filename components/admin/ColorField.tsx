"use client";

import { useState } from "react";

export default function ColorField({ name, defaultValue }: { name: string; defaultValue?: string | null }) {
  const [value, setValue] = useState(defaultValue || "");

  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <span
        aria-hidden
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "4px",
          border: "1px solid var(--border)",
          background: value || "transparent",
          flexShrink: 0,
        }}
      />
      <input
        className="admin-input"
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="oklch(72% 0.16 60) or #d9a441"
      />
    </div>
  );
}
