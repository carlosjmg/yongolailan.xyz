import { ImageResponse } from "next/og";

// Fallback social card, used when no artwork is set in the admin.
// Kept on the edge runtime with no data or image dependencies so it can never
// fail — the real card is usually the uploaded artwork (see generateMetadata).
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
          position: "relative",
          background: "#05070a",
        }}
      >
        {/* Tropical light bloom */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -140,
            width: 760,
            height: 760,
            borderRadius: 760,
            display: "flex",
            background: "radial-gradient(circle, rgba(233,176,74,0.55) 0%, rgba(84,140,80,0.28) 45%, rgba(5,7,10,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -260,
            left: -160,
            width: 780,
            height: 780,
            borderRadius: 780,
            display: "flex",
            background: "radial-gradient(circle, rgba(28,120,124,0.5) 0%, rgba(20,70,90,0.22) 48%, rgba(5,7,10,0) 72%)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
            width: "100%",
            padding: "72px 80px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 26 }}>
            <div style={{ display: "flex", width: 54, height: 3, background: "#e9b04a" }} />
            <div style={{ display: "flex", color: "#e9b04a", fontSize: 21, letterSpacing: 6, textTransform: "uppercase" }}>
              Electronic Ritual · Afro-Caribbean Futurism
            </div>
          </div>

          <div style={{ display: "flex", fontSize: 128, color: "#ffffff", lineHeight: 1, letterSpacing: -3 }}>
            Yongolailan
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 27,
              color: "rgba(255,255,255,0.82)",
              letterSpacing: 5,
              textTransform: "uppercase",
            }}
          >
            DJ · Producer · Live Electronic Performer
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 44,
              alignItems: "center",
              gap: 14,
              fontSize: 23,
              color: "rgba(255,255,255,0.55)",
              letterSpacing: 2,
            }}
          >
            <div style={{ display: "flex", width: 8, height: 8, borderRadius: 8, background: "#e9b04a" }} />
            yongolailan.xyz
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
