import "./label.css";
import type { CSSProperties } from "react";
import Link from "next/link";
import { getAllSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

// Shared chrome for the whole Caribbean Sea Sound section: a light, parallel
// identity that never touches the dark main site (everything is under .cssound).
export default async function LabelLayout({ children }: { children: React.ReactNode }) {
  const s = await getAllSettings();
  const logo = s["label.logo"];
  const logoSize = s["label.logoSize"] || "34";
  // Wordmark size: explicit setting, otherwise match the logo.
  const wordmarkSize = Number(s["label.wordmarkSize"]) > 0 ? Number(s["label.wordmarkSize"]) : Number(logoSize) || 34;
  const name = s["label.name"] || "Caribbean Sea Sound";
  const location = s["label.location"] || "Brooklyn, New York";
  const domain = s["site.domain"] || "yongolailan.xyz";

  // Logo nudge (px). Empty mobile value inherits the desktop one; 0 is respected.
  const lx = Number(s["label.logoOffsetX"]) || 0;
  const ly = Number(s["label.logoOffsetY"]) || 0;
  const mobileNum = (v: string | undefined, fallback: number) => {
    const t = String(v ?? "").trim();
    if (t === "") return fallback;
    const n = Number(t);
    return Number.isNaN(n) ? fallback : n;
  };
  const lxM = mobileNum(s["label.logoOffsetXMobile"], lx);
  const lyM = mobileNum(s["label.logoOffsetYMobile"], ly);

  return (
    <div className="cssound">
      <header className="cssound-header">
        <div className="cssound-header-inner">
          <Link href="/caribbean-sea-sound" className="cssound-logo" aria-label={`${name} — home`}>
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo}
                alt={name}
                style={
                  {
                    height: `${logoSize}px`,
                    // Transform comes from these vars in CSS so a media query
                    // can give phones a different nudge.
                    "--llogo-tx": `${lx}px`,
                    "--llogo-ty": `${ly}px`,
                    "--llogo-tx-mobile": `${lxM}px`,
                    "--llogo-ty-mobile": `${lyM}px`,
                  } as CSSProperties
                }
              />
            ) : null}
          </Link>
          {/* The name, moved here from the page body — far right, one line,
              sized to match the logo (shrinks on narrow screens to fit). */}
          <Link
            href="/caribbean-sea-sound"
            className="cssound-wordmark"
            style={{ fontSize: `min(${wordmarkSize}px, 6.2vw)` }}
          >
            {name}
          </Link>
        </div>
      </header>

      {children}

      <div className="cssound-shell">
        <footer className="cssound-footer">
          <span>
            {name} · {location}
          </span>
          <Link href="/">{domain}</Link>
        </footer>
      </div>
    </div>
  );
}
