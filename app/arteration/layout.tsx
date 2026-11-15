import "./arteration.css";
import { Fraunces, DM_Sans } from "next/font/google";

export const dynamic = "force-dynamic";

// Type for this section only (never loaded by the rest of the site): a soft,
// high-contrast serif for the big words, a clean sans for everything else.
const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
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

// Shared wrapper for the festival pages (/arteration and /arteration/es): its
// own light identity that never touches the dark main site (all under .af).
export default function FestLayout({ children }: { children: React.ReactNode }) {
  return <div className={`af ${display.variable} ${sans.variable}`}>{children}</div>;
}
