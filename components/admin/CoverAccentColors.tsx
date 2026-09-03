"use client";

import { useState, type CSSProperties } from "react";

const microLabel: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "10px",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--text-dimmer)",
  marginBottom: "4px",
};

const miniBtn: CSSProperties = {
  width: "22px",
  height: "18px",
  fontSize: "9px",
  fontFamily: "var(--font-mono)",
  border: "1px solid var(--border)",
  borderRadius: "3px",
  background: "transparent",
  color: "var(--text-dim)",
  cursor: "pointer",
  padding: 0,
  lineHeight: "16px",
};

/**
 * The two "accent color" fields for a release, side by side, with a button
 * that reads the actual cover image (via /api/admin/palette) and suggests a
 * real two-colour pair pulled from the artwork — plus a row of swatches from
 * the same cover so either can be reassigned individually.
 */
export default function CoverAccentColors({
  accent1Value,
  accent2Value,
  imageUrl,
  help,
}: {
  accent1Value?: string | null;
  accent2Value?: string | null;
  imageUrl?: string | null;
  help?: string;
}) {
  const [v1, setV1] = useState(accent1Value || "");
  const [v2, setV2] = useState(accent2Value || "");
  const [palette, setPalette] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const suggest = async () => {
    if (!imageUrl) return;
    setLoading(true);
    setError("");
    try {
      const r = await fetch(`/api/admin/palette?url=${encodeURIComponent(imageUrl)}`);
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "failed");
      setPalette(data.palette as string[]);
      setV1(data.accent1 as string);
      setV2(data.accent2 as string);
    } catch {
      setError("Could not read colours from that cover. You can still type them in by hand.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-field">
      <label className="admin-label">Accent colors</label>

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 220px" }}>
          <div style={microLabel}>Accent 1</div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span aria-hidden style={{ width: "26px", height: "26px", borderRadius: "4px", border: "1px solid var(--border)", background: v1 || "transparent", flexShrink: 0 }} />
            <input className="admin-input" name="accentColor" value={v1} onChange={(e) => setV1(e.target.value)} placeholder="oklch(72% 0.16 60) or #d9a441" />
          </div>
        </div>
        <div style={{ flex: "1 1 220px" }}>
          <div style={microLabel}>Accent 2 (Buy gradient)</div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span aria-hidden style={{ width: "26px", height: "26px", borderRadius: "4px", border: "1px solid var(--border)", background: v2 || "transparent", flexShrink: 0 }} />
            <input className="admin-input" name="accentColor2" value={v2} onChange={(e) => setV2(e.target.value)} placeholder="Leave empty for a single colour" />
          </div>
        </div>
      </div>

      {imageUrl ? (
        <button type="button" className="admin-btn admin-btn-sm" onClick={suggest} disabled={loading} style={{ marginTop: "12px" }}>
          {loading ? "Reading cover…" : "🎨 Suggest colors from cover"}
        </button>
      ) : (
        <div className="admin-help" style={{ marginTop: "6px" }}>Upload a cover above, then come back for colour suggestions.</div>
      )}
      {error && <div className="admin-help" style={{ color: "#fc5c64" }}>{error}</div>}

      {palette && palette.length > 0 && (
        <div style={{ marginTop: "14px" }}>
          <div style={microLabel}>From this cover — click 1 or 2 to assign</div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {palette.map((hex) => (
              <div key={hex} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <span aria-hidden title={hex} style={{ width: "26px", height: "26px", borderRadius: "50%", background: hex, border: hex === v1 || hex === v2 ? "2px solid var(--gold)" : "1px solid var(--border)" }} />
                <div style={{ display: "flex", gap: "4px" }}>
                  <button type="button" onClick={() => setV1(hex)} style={{ ...miniBtn, opacity: hex === v1 ? 1 : 0.55, borderColor: hex === v1 ? "var(--gold)" : "var(--border)" }}>
                    1
                  </button>
                  <button type="button" onClick={() => setV2(hex)} style={{ ...miniBtn, opacity: hex === v2 ? 1 : 0.55, borderColor: hex === v2 ? "var(--gold)" : "var(--border)" }}>
                    2
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {help && <div className="admin-help" style={{ marginTop: "10px" }}>{help}</div>}
    </div>
  );
}
