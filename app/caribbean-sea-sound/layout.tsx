import "./label.css";
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

  return (
    <div className="cssound">
      <header className="cssound-header">
        <div className="cssound-header-inner">
          <Link href="/caribbean-sea-sound" className="cssound-logo" aria-label={`${name} — home`}>
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt={name} style={{ height: `${logoSize}px` }} />
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
