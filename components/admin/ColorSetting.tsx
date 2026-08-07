"use client";

import React, { useState } from "react";

export interface ColorPreset {
  hex: string;
  name: string;
  note: string;
}

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

/**
 * Colour field for the admin: a row of recommended swatches, plus a free
 * colour picker and a hex box for anything else. All three stay in sync and
 * write to the single named input the form submits.
 */
export default function ColorSetting({
  name,
  label,
  value,
  presets,
  fallback,
  help,
}: {
  name: string;
  label: string;
  value?: string | null;
  presets: ColorPreset[];
  /** Used for the preview when nothing has been chosen yet. */
  fallback: string;
  help?: string;
}) {
  const [color, setColor] = useState((value || "").trim());
  const [text, setText] = useState((value || "").trim());

  const effective = HEX.test(color) ? color : fallback;
  // Judge what was typed, not what was kept: `color` only ever holds valid
  // values, so deriving the warning from it would never fire.
  const typed = text.trim();
  const typedHex = typed && !typed.startsWith("#") ? `#${typed}` : typed;
  const valid = typedHex === "" || HEX.test(typedHex);

  const pick = (hex: string) => {
    setColor(hex);
    setText(hex);
  };

  const onText = (raw: string) => {
    const v = raw.trim();
    setText(v);
    // Accept "e8a33d" as well as "#e8a33d".
    const withHash = v && !v.startsWith("#") ? `#${v}` : v;
    if (withHash === "" || HEX.test(withHash)) setColor(withHash);
  };

  return (
    <div className="admin-field">
      <label className="admin-label">{label}</label>

      {/* What the form actually submits. */}
      <input type="hidden" name={name} value={color} />

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
        {presets.map((p) => {
          const active = color.toLowerCase() === p.hex.toLowerCase();
          return (
            <button
              key={p.hex}
              type="button"
              onClick={() => pick(p.hex)}
              title={`${p.name} — ${p.note}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "7px 12px 7px 8px",
                borderRadius: "999px",
                cursor: "pointer",
                background: active ? "rgba(255,255,255,0.07)" : "transparent",
                border: `1px solid ${active ? p.hex : "var(--border)"}`,
                color: "var(--text)",
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                minHeight: "auto",
              }}
            >
              <span
                aria-hidden
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: p.hex,
                  // Outer ring, so a black swatch is still visible on the
                  // dark admin background.
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.35)",
                  flexShrink: 0,
                }}
              />
              {p.name}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <input
          type="color"
          aria-label="Pick any colour"
          value={effective}
          onChange={(e) => pick(e.target.value)}
          style={{
            width: "46px",
            height: "34px",
            minHeight: "34px",
            padding: "2px",
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        />
        <input
          type="text"
          value={text}
          onChange={(e) => onText(e.target.value)}
          placeholder={fallback}
          spellCheck={false}
          className="admin-input"
          style={{ width: "130px", fontFamily: "var(--font-mono)", minHeight: "34px" }}
        />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: effective,
          }}
        >
          DJ · Producer
        </span>
      </div>

      {!valid && (
        <div className="admin-help" style={{ color: "#fc5c64" }}>
          That isn&rsquo;t a colour code yet — use six characters like <code>#e8a33d</code>. Your
          saved colour stays as it is until this reads correctly.
        </div>
      )}
      {help && <div className="admin-help">{help}</div>}
    </div>
  );
}
