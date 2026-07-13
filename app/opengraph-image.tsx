import { ImageResponse } from "next/og";

// Generated on-demand (edge) so a rendering issue can never fail the build.
export const runtime = "edge";
export const alt = "Yongolailan — DJ · Producer · Live Electronic Performer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0b0d10 0%, #0a0a0c 55%, #12100c 100%)",
          padding: "80px",
        }}
      >
        <div style={{ display: "flex", color: "#d9a441", fontSize: 26, letterSpacing: 8, textTransform: "uppercase" }}>
          Electronic Ritual · Afro-Caribbean Futurism
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 140, color: "#f4f0e8", lineHeight: 1 }}>Yongolailan</div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 30, color: "#b9b3a8", letterSpacing: 6, textTransform: "uppercase" }}>
            DJ · Producer · Live Electronic Performer
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#7c766b" }}>yongolailan.xyz</div>
      </div>
    ),
    { ...size }
  );
}
