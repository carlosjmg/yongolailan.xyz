import type { Metadata } from "next";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { getAllSettings } from "@/lib/settings";
import { getLabelRoster } from "@/lib/data";
import LabelRoster from "@/components/site/LabelRoster";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yongolailan.xyz";

export const metadata: Metadata = {
  title: "Caribbean Sea Sound — Record Label",
  description:
    "Caribbean Sea Sound is the Brooklyn record label founded by Yongolailan, connecting Caribbean cultural heritage with international music production. Artists, productions and credits.",
  keywords: [
    "Caribbean Sea Sound",
    "Caribbean Sea Sound record label",
    "Yongolailan label",
    "Brooklyn record label",
    "Afro-Cuban production",
    "Cuban music production",
  ],
  alternates: { canonical: `${siteUrl}/caribbean-sea-sound` },
  openGraph: {
    type: "website",
    url: `${siteUrl}/caribbean-sea-sound`,
    title: "Caribbean Sea Sound — Record Label",
    description:
      "The Brooklyn record label founded by Yongolailan. Artists, productions and credits.",
    siteName: "Yongolailan",
  },
};

export default async function CaribbeanSeaSoundPage() {
  noStore();
  const [settings, artists] = await Promise.all([getAllSettings(), getLabelRoster()]);

  const labelName = settings["label.name"] || "Caribbean Sea Sound";
  const labelLocation = settings["label.location"] || "Brooklyn, New York";
  const intro = settings["label.intro"] || "";

  // Structured data so search engines read this as the label's own entity,
  // tied back to Yongolailan as its founder.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: labelName,
    alternateName: "Caribbean Sea Sound Records",
    url: `${siteUrl}/caribbean-sea-sound`,
    description: intro || `Record label founded by Yongolailan in ${labelLocation}.`,
    foundingLocation: { "@type": "Place", name: labelLocation },
    founder: { "@type": "Person", name: "Yongolailan", url: siteUrl },
    subOrganization: artists.map((a) => ({ "@type": "MusicGroup", name: a.name })),
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header
        style={{
          padding: "clamp(96px, 12vh, 150px) clamp(20px, 6vw, 80px) clamp(48px, 6vw, 76px)",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-block",
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--text-dim)",
            textDecoration: "none",
            marginBottom: "clamp(34px, 5vw, 54px)",
          }}
        >
          ← Yongolailan
        </Link>

        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--gold)",
            marginBottom: "14px",
          }}
        >
          Record Label · {labelLocation}
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(40px, 7vw, 92px)",
            fontWeight: 300,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: "var(--text)",
          }}
        >
          {labelName}
        </h1>

        {intro && (
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(15px, 1.6vw, 18px)",
              lineHeight: 1.7,
              color: "var(--text-dim)",
              maxWidth: "62ch",
              marginTop: "clamp(20px, 2.5vw, 30px)",
            }}
          >
            {intro}
          </p>
        )}
      </header>

      <section
        style={{
          padding: "0 clamp(20px, 6vw, 80px) clamp(80px, 10vw, 130px)",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <LabelRoster artists={artists} />
      </section>

      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "36px clamp(20px, 6vw, 80px)",
          maxWidth: "1400px",
          margin: "0 auto",
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--text-dimmer)",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <span>
          {labelName} · {labelLocation}
        </span>
        <Link href="/" style={{ color: "var(--text-dim)", textDecoration: "none" }}>
          yongolailan.xyz
        </Link>
      </footer>
    </main>
  );
}
