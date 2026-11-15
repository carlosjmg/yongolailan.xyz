import "./arteration.css";
import Link from "next/link";
import { Fraunces, DM_Sans } from "next/font/google";
import { getAllSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

// Type for this section only (never loaded by the rest of the site): a soft,
// high-contrast serif for the big words, a clean sans for everything else.
const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600", "800", "900"],
  style: ["normal", "italic"],
  variable: "--af-display",
  display: "swap",
});
const sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--af-sans",
  display: "swap",
});

function InstagramGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Shared chrome for the festival page: its own light, colourful identity that
// never touches the dark main site (everything lives under .af).
export default async function FestLayout({ children }: { children: React.ReactNode }) {
  const s = await getAllSettings();
  const name = s["fest.name"] || "ARTeration Fest";
  const instagram = (s["fest.instagram"] || "").trim();
  const presented = (s["fest.presentedBy"] || "").trim();
  const producer = (s["fest.producedBy"] || "").trim();

  return (
    <div className={`af ${display.variable} ${sans.variable}`}>
      <header className="af-header">
        <div className="af-header-inner">
          <Link href="/arteration" className="af-mark" aria-label={name}>
            <span className="af-c1">A</span>
            <span className="af-c2">R</span>
            <span className="af-c3">T</span>
            <span className="af-c4">eration</span>
          </Link>
          <nav className="af-nav" aria-label="Festival sections">
            <a href="#about">About</a>
            <a href="#lineup">Lineup</a>
            <a href="#videos">Videos</a>
            <a href="#photos">Photos</a>
            <a href="#partners">Partners</a>
            {instagram ? (
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="af-nav-ig" aria-label="Instagram">
                <InstagramGlyph />
              </a>
            ) : null}
          </nav>
        </div>
      </header>

      {children}

      <footer className="af-footer">
        <div className="af-footer-inner">
          <div className="af-footer-brand">
            <div className="af-footer-title">{name}</div>
            <p>
              {presented ? <>Presented by {presented}. </> : null}
              {producer ? <>Produced by {producer}.</> : null}
            </p>
          </div>
          <div className="af-footer-links">
            {instagram ? (
              <a href={instagram} target="_blank" rel="noopener noreferrer">
                Instagram ↗
              </a>
            ) : null}
            <Link href="/caribbean-sea-sound">Caribbean Sea Sound</Link>
            <Link href="/">Yongolailan</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
